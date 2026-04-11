package com.ration.ration_system.dto;

import lombok.Data;

@Data
public class RationItemRequestDTO {

    private String itemName;
    private String unitType;
    private double pricePerUnit;
}