package com.ration.ration_system.dto;

import lombok.Data;

@Data
public class UserRequestDTO {

    private String name;
    private String email;
    private String phoneNumber;
    private String role;
}