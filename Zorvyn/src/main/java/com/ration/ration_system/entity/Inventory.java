package com.ration.ration_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantityAvailable;

    private LocalDateTime lastUpdated;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private RationItem rationItem;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private User managedBy;

    @Enumerated(EnumType.STRING)
    private Status status;

    @PrePersist
    @PreUpdate
    public void updateTime() {
        this.lastUpdated = LocalDateTime.now();
    }

    public enum Status {
        AVAILABLE,
        LOW_STOCK,
        OUT_OF_STOCK
    }
}