package com.ration.ration_system.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String role;
    private String password; 
    private LocalDateTime createdAt;
}