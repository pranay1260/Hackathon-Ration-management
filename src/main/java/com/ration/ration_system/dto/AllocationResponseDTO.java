package com.ration.ration_system.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AllocationResponseDTO {

    private Long id;
    private int allocatedQuantity;
    private int allocationMonth;
    private int allocationYear;
    private Long cardId;
    private Long itemId;
    private String status;
    private LocalDateTime createdAt;
}