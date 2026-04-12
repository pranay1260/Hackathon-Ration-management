package com.ration.ration_system.Service;

import com.ration.ration_system.dto.RationItemRequestDTO;
import com.ration.ration_system.dto.RationItemResponseDTO;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.entity.Inventory;
import com.ration.ration_system.Repository.RationItemRepository;
import com.ration.ration_system.Repository.InventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RationItemService {

    private final RationItemRepository rationItemRepository;
    private final InventoryRepository inventoryRepository;

    public RationItemService(RationItemRepository rationItemRepository, InventoryRepository inventoryRepository) {
        this.rationItemRepository = rationItemRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional
    public RationItemResponseDTO createItem(RationItemRequestDTO dto) {
        RationItem item = new RationItem();
        item.setItemName(dto.getItemName());
        item.setUnitType(RationItem.UnitType.valueOf(dto.getUnitType()));
        item.setPricePerUnit(dto.getPricePerUnit());

        RationItem saved = rationItemRepository.save(item);

        // AUTO-INIT: Create an empty inventory record so the Allocation system doesn't error out
        Inventory inventory = new Inventory();
        inventory.setRationItem(saved);
        inventory.setQuantityAvailable(0);
        inventory.setStatus(Inventory.Status.OUT_OF_STOCK);
        inventoryRepository.save(inventory);

        return mapToResponse(saved);
    }

    public List<RationItemResponseDTO> getAllItems() {
        return rationItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RationItemResponseDTO updatePrice(Long id, Double price) {
        RationItem item = rationItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setPricePerUnit(price);
        RationItem saved = rationItemRepository.save(item);
        return mapToResponse(saved);
    }

    private RationItemResponseDTO mapToResponse(RationItem saved) {
        RationItemResponseDTO response = new RationItemResponseDTO();
        response.setId(saved.getId());
        response.setItemName(saved.getItemName());
        response.setUnitType(saved.getUnitType().name());
        response.setPricePerUnit(saved.getPricePerUnit());
        return response;
    }
}