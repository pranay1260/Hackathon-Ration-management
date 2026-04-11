package com.ration.ration_system.dto;

import lombok.Data;

@Data
public class AllocationRequestDTO {

    private int allocatedQuantity;
    private int allocationMonth;
    private int allocationYear;
    private Long cardId;
    private Long itemId;
    private String status;
}