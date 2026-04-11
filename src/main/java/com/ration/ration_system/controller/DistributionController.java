package com.ration.ration_system.controller;

import com.ration.ration_system.dto.DistributionRequestDTO;
import com.ration.ration_system.dto.DistributionResponseDTO;
import com.ration.ration_system.Service.DistributionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/distribution")
public class DistributionController {

    private final DistributionService distributionService;

    public DistributionController(DistributionService distributionService) {
        this.distributionService = distributionService;
    }

    @PostMapping
    public DistributionResponseDTO distribute(@RequestBody DistributionRequestDTO dto) {
        return distributionService.distribute(dto);
    }
}