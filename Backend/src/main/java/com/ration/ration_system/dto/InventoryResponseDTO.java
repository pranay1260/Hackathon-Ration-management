package com.ration.ration_system.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InventoryResponseDTO {

    private Long id;
    private int quantityAvailable;
    private Long itemId;
    private String itemName;
    private String unitType;
    private Long managerId;
    private String status;
    private LocalDateTime lastUpdated;
}