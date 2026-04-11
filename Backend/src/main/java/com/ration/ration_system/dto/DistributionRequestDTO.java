package com.ration.ration_system.dto;

import lombok.Data;

@Data
public class DistributionRequestDTO {

    private int distributedQuantity;
    private String referenceId;
    private String transactionStatus;
    private Long allocationId;
}