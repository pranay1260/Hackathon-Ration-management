package com.ration.ration_system.dto;

import lombok.Data;

@Data
public class InventoryRequestDTO {

    private int quantityAvailable;
    private Long itemId;
    private Long managerId;
    private String status;
}