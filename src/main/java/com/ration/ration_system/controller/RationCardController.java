package com.ration.ration_system.controller;

import com.ration.ration_system.dto.RationCardRequestDTO;
import com.ration.ration_system.dto.RationCardResponseDTO;
import com.ration.ration_system.Service.RationCardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cards")
public class RationCardController {

    private final RationCardService rationCardService;

    public RationCardController(RationCardService rationCardService) {
        this.rationCardService = rationCardService;
    }

    @PostMapping
    public RationCardResponseDTO createCard(@RequestBody RationCardRequestDTO dto) {
        return rationCardService.createRationCard(dto);
    }
}