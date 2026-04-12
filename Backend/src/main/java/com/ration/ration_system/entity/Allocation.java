package com.ration.ration_system.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Data
public class Allocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int allocatedQuantity;
    private int allocationMonth;
    private int allocationYear;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "card_id")
    private RationCard rationCard;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private RationItem rationItem;
    @Enumerated(EnumType.STRING)
    private Status status;
    @PrePersist
    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }
    public enum Status {
        ALLOCATED,
        PARTIALLY_DISTRIBUTED,
        DISTRIBUTED,
        CANCELLED
    }
}