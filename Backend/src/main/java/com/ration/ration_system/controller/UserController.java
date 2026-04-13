package com.ration.ration_system.controller;

import com.ration.ration_system.dto.UserRequestDTO;
import com.ration.ration_system.dto.UserResponseDTO;
import com.ration.ration_system.Service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@CrossOrigin
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
    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody UserRequestDTO dto) {
        return userService.login(dto.getEmail(), dto.getPassword());
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
