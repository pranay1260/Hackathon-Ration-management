package com.ration.ration_system.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Data
public class Distribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int distributedQuantity;
    private LocalDateTime transactionDate;
    private String referenceId;
    @Enumerated(EnumType.STRING)
    private Status transactionStatus;
    @ManyToOne
    @JoinColumn(name = "allocation_id")
    private Allocation allocation;
    @PrePersist
    public void setTransactionDate() {
        this.transactionDate = LocalDateTime.now();
    }
    public enum Status {
        INITIATED,
        SUCCESS,
        FAILED
    }
}