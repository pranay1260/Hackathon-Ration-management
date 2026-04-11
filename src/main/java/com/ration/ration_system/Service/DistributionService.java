package com.ration.ration_system.Service;

import com.ration.ration_system.dto.DistributionRequestDTO;
import com.ration.ration_system.dto.DistributionResponseDTO;
import com.ration.ration_system.entity.Allocation;
import com.ration.ration_system.entity.Distribution;
import com.ration.ration_system.entity.Inventory;
import com.ration.ration_system.Repository.AllocationRepository;
import com.ration.ration_system.Repository.DistributionRepository;
import com.ration.ration_system.Repository.InventoryRepository;
import org.springframework.stereotype.Service;

@Service
public class DistributionService {

    private final DistributionRepository distributionRepository;
    private final AllocationRepository allocationRepository;
    private final InventoryRepository inventoryRepository;

    public DistributionService(DistributionRepository distributionRepository,
                               AllocationRepository allocationRepository,
                               InventoryRepository inventoryRepository) {
        this.distributionRepository = distributionRepository;
        this.allocationRepository = allocationRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public DistributionResponseDTO distribute(DistributionRequestDTO dto) {

        Allocation allocation = allocationRepository.findById(dto.getAllocationId())
                .orElseThrow(() -> new RuntimeException("Allocation not found"));

        Distribution distribution = new Distribution();
        distribution.setDistributedQuantity(dto.getDistributedQuantity());
        distribution.setReferenceId(dto.getReferenceId());
        distribution.setAllocation(allocation);

        //  set INITIATED
        distribution.setTransactionStatus(Distribution.Status.INITIATED);

        //  check card is active
        if (!allocation.getRationCard().getStatus().name().equals("ACTIVE")) {
            distribution.setTransactionStatus(Distribution.Status.FAILED);
            Distribution saved = distributionRepository.save(distribution);
            return mapToResponse(saved);
        }

        //  check quantity
        if (dto.getDistributedQuantity() > allocation.getAllocatedQuantity()) {
            distribution.setTransactionStatus(Distribution.Status.FAILED);
            Distribution saved = distributionRepository.save(distribution);
            return mapToResponse(saved);
        }

        // check inventory
        Inventory inventory = inventoryRepository
                .findByRationItemId(allocation.getRationItem().getId())
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        if (inventory.getQuantityAvailable() < dto.getDistributedQuantity()) {
            distribution.setTransactionStatus(Distribution.Status.FAILED);
            Distribution saved = distributionRepository.save(distribution);
            return mapToResponse(saved);
        }

        //  success → update inventory
        inventory.setQuantityAvailable(
                inventory.getQuantityAvailable() - dto.getDistributedQuantity()
        );
        inventoryRepository.save(inventory);

        distribution.setTransactionStatus(Distribution.Status.SUCCESS);

        Distribution saved = distributionRepository.save(distribution);

        return mapToResponse(saved);
    }

    private DistributionResponseDTO mapToResponse(Distribution saved) {
        DistributionResponseDTO response = new DistributionResponseDTO();
        response.setId(saved.getId());
        response.setDistributedQuantity(saved.getDistributedQuantity());
        response.setReferenceId(saved.getReferenceId());
        response.setTransactionStatus(saved.getTransactionStatus().name());
        response.setAllocationId(saved.getAllocation().getId());
        response.setCreatedAt(saved.getTransactionDate());
        return response;
    }
}