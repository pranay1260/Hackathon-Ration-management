package com.ration.ration_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class RationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemName;

    @Enumerated(EnumType.STRING)
    private UnitType unitType;

    private double pricePerUnit;

    public enum UnitType {
        KG,
        LITRE,
        PACK
    }
}