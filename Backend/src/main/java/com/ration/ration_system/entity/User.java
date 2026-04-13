package com.ration.ration_system.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String password;
    private LocalDateTime createdAt;
    @PrePersist
    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }
    public enum Role {
        ADMIN,
        SHOP_MANAGER,
        BENEFICIARY
    }
}