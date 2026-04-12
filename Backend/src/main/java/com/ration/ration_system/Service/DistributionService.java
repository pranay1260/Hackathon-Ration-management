package com.ration.ration_system.Service;

import com.ration.ration_system.dto.DistributionRequestDTO;
import com.ration.ration_system.dto.DistributionResponseDTO;
import com.ration.ration_system.entity.Distribution;
import com.ration.ration_system.entity.Allocation;
import com.ration.ration_system.Repository.DistributionRepository;
import com.ration.ration_system.Repository.AllocationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DistributionService {

    private final DistributionRepository distributionRepository;
    private final AllocationRepository allocationRepository;

    public DistributionService(DistributionRepository distributionRepository,
                               AllocationRepository allocationRepository) {
        this.distributionRepository = distributionRepository;
        this.allocationRepository = allocationRepository;
    }

    public DistributionResponseDTO distribute(DistributionRequestDTO dto) {
        if (dto.getAllocationId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Allocation ID is required");
        }

        Allocation allocation = allocationRepository.findById(dto.getAllocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Allocation record not found"));

        // RULE: Allocation cannot be modified once DISTRIBUTED (Section 6)
        if (allocation.getStatus() == Allocation.Status.DISTRIBUTED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Allocation is already fully DISTRIBUTED");
        }

        // SYSTEM MUST: Prevent distribution exceeding allocated quantity (Section 5.6)
        List<Distribution> existingDistributions = distributionRepository.findAll();
        int totalAlreadyDistributed = existingDistributions.stream()
                .filter(d -> d.getAllocation() != null && d.getAllocation().getId().equals(allocation.getId()))
                .mapToInt(Distribution::getDistributedQuantity)
                .sum();

        int remainingAllowance = allocation.getAllocatedQuantity() - totalAlreadyDistributed;

        if (dto.getDistributedQuantity() > remainingAllowance) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Quantity exceeds remaining allowance. Available: " + remainingAllowance + " KG");
        }

        Distribution distribution = new Distribution();
        distribution.setDistributedQuantity(dto.getDistributedQuantity());
        distribution.setReferenceId(dto.getReferenceId());
        distribution.setAllocation(allocation);
        distribution.setTransactionStatus(Distribution.Status.SUCCESS);

        Distribution saved = distributionRepository.save(distribution);

        // SYSTEM MUST: Update allocationStatus automatically
        int newTotalDistributed = totalAlreadyDistributed + dto.getDistributedQuantity();
        if (newTotalDistributed >= allocation.getAllocatedQuantity()) {
            allocation.setStatus(Allocation.Status.DISTRIBUTED);
        } else {
            allocation.setStatus(Allocation.Status.PARTIALLY_DISTRIBUTED);
        }
        allocationRepository.save(allocation);

        return mapToResponse(saved);
    }

    public List<DistributionResponseDTO> getAllDistributions() {
        return distributionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DistributionResponseDTO> getDistributionsByCardId(Long cardId) {
        return distributionRepository.findAll().stream()
                .filter(d -> d.getAllocation() != null && d.getAllocation().getRationCard() != null 
                             && d.getAllocation().getRationCard().getId().equals(cardId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DistributionResponseDTO mapToResponse(Distribution saved) {
        DistributionResponseDTO response = new DistributionResponseDTO();
        response.setId(saved.getId());
        response.setDistributedQuantity(saved.getDistributedQuantity());
        response.setReferenceId(saved.getReferenceId());
        if (saved.getAllocation() != null) {
            response.setAllocationId(saved.getAllocation().getId());
            if (saved.getAllocation().getRationCard() != null) {
                response.setCardNumber(saved.getAllocation().getRationCard().getCardNumber());
            }
            if (saved.getAllocation().getRationItem() != null) {
                response.setItemName(saved.getAllocation().getRationItem().getItemName());
            }
        }
        response.setTransactionStatus(saved.getTransactionStatus() != null ? saved.getTransactionStatus().name() : "SUCCESS");
        response.setDistributionDate(saved.getTransactionDate());
        return response;
    }
}