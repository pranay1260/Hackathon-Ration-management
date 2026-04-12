package com.ration.ration_system.Service;

import com.ration.ration_system.dto.AllocationRequestDTO;
import com.ration.ration_system.dto.AllocationResponseDTO;
import com.ration.ration_system.entity.Allocation;
import com.ration.ration_system.entity.RationCard;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.entity.Inventory;
import com.ration.ration_system.Repository.AllocationRepository;
import com.ration.ration_system.Repository.RationCardRepository;
import com.ration.ration_system.Repository.RationItemRepository;
import com.ration.ration_system.Repository.InventoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final RationCardRepository rationCardRepository;
    private final RationItemRepository rationItemRepository;
    private final InventoryRepository inventoryRepository;

    public AllocationService(AllocationRepository allocationRepository,
                             RationCardRepository rationCardRepository,
                             RationItemRepository rationItemRepository,
                             InventoryRepository inventoryRepository) {
        this.allocationRepository = allocationRepository;
        this.rationCardRepository = rationCardRepository;
        this.rationItemRepository = rationItemRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public AllocationResponseDTO createAllocation(AllocationRequestDTO dto) {
        if (dto.getCardId() == null || dto.getItemId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card ID and Item ID are required");
        }

        RationCard card = rationCardRepository.findById(dto.getCardId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));

        // RULE: Allocation must be MONTHLY (Only once per card/item/month)
        allocationRepository.findByRationCardIdAndRationItemIdAndAllocationMonthAndAllocationYear(
                dto.getCardId(), dto.getItemId(), dto.getAllocationMonth(), dto.getAllocationYear())
                .ifPresent(a -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Allocation for this item has already been done for this period.");
                });

        // RULE: Ration card must be ACTIVE for allocation (Section 6)
        if (card.getStatus() != RationCard.CardStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Card is not ACTIVE. Status: " + card.getStatus());
        }

        RationItem item = rationItemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        // RULE: Cannot allocate ration if inventory is OUT_OF_STOCK (Section 6)
        List<Inventory> inventoryList = inventoryRepository.findAll();
        Inventory itemInventory = inventoryList.stream()
                .filter(inv -> inv.getRationItem() != null && inv.getRationItem().getId().equals(item.getId()))
                .findFirst()
                .orElseGet(() -> {
                    // SELF-HEALING: Create missing inventory record with 0 stock
                    Inventory newInv = new Inventory();
                    newInv.setRationItem(item);
                    newInv.setQuantityAvailable(0);
                    newInv.setStatus(Inventory.Status.OUT_OF_STOCK);
                    return inventoryRepository.save(newInv);
                });

        if (itemInventory.getQuantityAvailable() <= 0 || itemInventory.getStatus() == Inventory.Status.OUT_OF_STOCK) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot allocate: Item '" + item.getItemName() + "' is OUT OF STOCK. Please add stock in Inventory Management.");
        }

        // SYSTEM MUST: Calculate allocation quantity based on Eligibility Matrix (Section 5.5 / Section 6)
        int calculatedQuantity = 0;
        int familySize = card.getFamilySize() > 0 ? card.getFamilySize() : 1;
        String name = item.getItemName().trim().toLowerCase();
        RationCard.CardType type = card.getCardType();

        // 1. CEREALS (Rice / Wheat) - Calculated PER MEMBER
        if (name.contains("rice")) {
            if (type == RationCard.CardType.AAY) {
                calculatedQuantity = 35; // Flat per AAY family
            } else if (type == RationCard.CardType.BPL) {
                calculatedQuantity = 10 * familySize; 
            } else {
                calculatedQuantity = 5 * familySize;
            }
        } 
        else if (name.contains("wheat")) {
            if (type == RationCard.CardType.AAY) {
                calculatedQuantity = 0; // AAY get Rice only
            } else if (type == RationCard.CardType.BPL) {
                calculatedQuantity = 5 * familySize;
            } else {
                calculatedQuantity = 3 * familySize;
            }
        }
        // 2. SUBSIDIZED EXCLUSIVES (Sugar / Kerosene) - Calculated PER FAMILY (Flat)
        else if (name.contains("sugar")) {
            if (type == RationCard.CardType.APL) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "APL (White Card) holders are not eligible for subsidized Sugar.");
            }
            calculatedQuantity = 1; // 1 KG Flat
        }
        else if (name.contains("kerosene")) {
            if (type == RationCard.CardType.APL) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "APL holders are not eligible for Kerosene.");
            }
            calculatedQuantity = (type == RationCard.CardType.AAY) ? 5 : 3; // Ltrs
        }
        // 3. OTHERS (Oil / Powder etc.) - Calculated PER FAMILY (Flat)
        else if (name.contains("oil")) {
            calculatedQuantity = 1; // 1 Ltr Flat
        }
        else {
            calculatedQuantity = 1; // Default
        }

        // Final check: If after all rules quantity is 0, it means ineligible (except specifically handled cases)
        if (calculatedQuantity <= 0 && !name.contains("wheat")) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Zero eligibility for " + item.getItemName() + " on " + type + " card.");
        }

        Allocation allocation = new Allocation();
        allocation.setAllocatedQuantity(calculatedQuantity);
        allocation.setAllocationMonth(dto.getAllocationMonth());
        allocation.setAllocationYear(dto.getAllocationYear());
        allocation.setRationCard(card);
        allocation.setRationItem(item);
        allocation.setStatus(Allocation.Status.ALLOCATED);

        Allocation saved = allocationRepository.save(allocation);
        System.out.println("AUTO-ALLOCATION SUCCESS: " + calculatedQuantity + " KG for " + card.getCardType() + " card");
        return mapToResponse(saved);
    }

    public List<AllocationResponseDTO> getAllAllocations() {
        return allocationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AllocationResponseDTO> getAllocationsByCardId(Long cardId) {
        return allocationRepository.findAll().stream()
                .filter(a -> a.getRationCard() != null && a.getRationCard().getId().equals(cardId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AllocationResponseDTO mapToResponse(Allocation saved) {
        AllocationResponseDTO response = new AllocationResponseDTO();
        response.setId(saved.getId());
        response.setAllocatedQuantity(saved.getAllocatedQuantity());
        response.setAllocationMonth(saved.getAllocationMonth());
        response.setAllocationYear(saved.getAllocationYear());
        if (saved.getRationCard() != null) {
            response.setCardId(saved.getRationCard().getId());
            response.setCardNumber(saved.getRationCard().getCardNumber());
            response.setCardType(saved.getRationCard().getCardType().name());
            response.setFamilySize(saved.getRationCard().getFamilySize());
        }
        if (saved.getRationItem() != null) {
            response.setItemId(saved.getRationItem().getId());
            response.setItemName(saved.getRationItem().getItemName());
        }
        response.setStatus(saved.getStatus().name());
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }
}