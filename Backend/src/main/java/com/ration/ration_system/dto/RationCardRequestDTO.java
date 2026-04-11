package com.ration.ration_system.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RationCardRequestDTO {

    private String cardNumber;
    private int familySize;
    private String cardType;
    private String status;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private Long userId;
}