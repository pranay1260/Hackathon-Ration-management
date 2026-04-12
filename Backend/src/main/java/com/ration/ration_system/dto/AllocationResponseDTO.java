package com.ration.ration_system.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AllocationResponseDTO {
    private Long id;
    private int allocatedQuantity;
    private int allocationMonth;
    private int allocationYear;
    private Long cardId;
    private String cardNumber;
    private String cardType;
    private int familySize;
    private Long itemId;
    private String itemName;
    private String status;
    private LocalDateTime createdAt;
}