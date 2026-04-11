package com.ration.ration_system.Service;

import com.ration.ration_system.dto.AllocationRequestDTO;
import com.ration.ration_system.dto.AllocationResponseDTO;
import com.ration.ration_system.entity.Allocation;
import com.ration.ration_system.entity.RationCard;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.Repository.AllocationRepository;
import com.ration.ration_system.Repository.RationCardRepository;
import com.ration.ration_system.Repository.RationItemRepository;
import org.springframework.stereotype.Service;

@Service
public class AllocationService {

    private final AllocationRepository allocationRepository;
    private final RationCardRepository rationCardRepository;
    private final RationItemRepository rationItemRepository;

    public AllocationService(AllocationRepository allocationRepository,
                             RationCardRepository rationCardRepository,
                             RationItemRepository rationItemRepository) {
        this.allocationRepository = allocationRepository;
        this.rationCardRepository = rationCardRepository;
        this.rationItemRepository = rationItemRepository;
    }

    public AllocationResponseDTO createAllocation(AllocationRequestDTO dto) {

        RationCard card = rationCardRepository.findById(dto.getCardId())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        RationItem item = rationItemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Allocation allocation = new Allocation();
        allocation.setAllocatedQuantity(dto.getAllocatedQuantity());
        allocation.setAllocationMonth(dto.getAllocationMonth());
        allocation.setAllocationYear(dto.getAllocationYear());
        allocation.setRationCard(card);
        allocation.setRationItem(item);
        allocation.setStatus(Allocation.Status.valueOf(dto.getStatus()));

        Allocation saved = allocationRepository.save(allocation);

        AllocationResponseDTO response = new AllocationResponseDTO();
        response.setId(saved.getId());
        response.setAllocatedQuantity(saved.getAllocatedQuantity());
        response.setAllocationMonth(saved.getAllocationMonth());
        response.setAllocationYear(saved.getAllocationYear());
        response.setCardId(saved.getRationCard().getId());
        response.setItemId(saved.getRationItem().getId());
        response.setStatus(saved.getStatus().name());
        response.setCreatedAt(saved.getCreatedAt());

        return response;
    }
}