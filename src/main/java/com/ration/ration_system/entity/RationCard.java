package com.ration.ration_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class RationCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardNumber;

    private int familySize;

    @Enumerated(EnumType.STRING)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    private CardStatus status;

    private LocalDate issueDate;
    private LocalDate expiryDate;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public enum CardType {
        APL,
        BPL,
        AAY
    }

    public enum CardStatus {
        ACTIVE,
        SUSPENDED,
        EXPIRED
    }
}