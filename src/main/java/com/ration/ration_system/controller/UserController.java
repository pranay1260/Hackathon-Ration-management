package com.ration.ration_system.controller;

import com.ration.ration_system.dto.UserRequestDTO;
import com.ration.ration_system.dto.UserResponseDTO;
import com.ration.ration_system.Service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserRequestDTO dto) {
        return userService.createUser(dto);
    }
}