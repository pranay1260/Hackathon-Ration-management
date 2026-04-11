package com.ration.ration_system.Service;

import com.ration.ration_system.dto.UserRequestDTO;
import com.ration.ration_system.dto.UserResponseDTO;
import com.ration.ration_system.entity.User;
import com.ration.ration_system.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDTO createUser(UserRequestDTO dto) {

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole(User.Role.valueOf(dto.getRole()));

        User savedUser = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setRole(savedUser.getRole().name());
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }
}