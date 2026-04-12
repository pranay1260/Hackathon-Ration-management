package com.ration.ration_system.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class DistributionResponseDTO {
    private Long id;
    private int distributedQuantity;
    private String referenceId;
    private String transactionStatus;
    private Long allocationId;
    private String cardNumber;
    private String itemName;
    private LocalDateTime distributionDate; // Re-aligned with service logic
}