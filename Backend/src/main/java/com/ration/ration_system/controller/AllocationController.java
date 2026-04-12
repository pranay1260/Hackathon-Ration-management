package com.ration.ration_system.controller;
import com.ration.ration_system.dto.AllocationRequestDTO;
import com.ration.ration_system.dto.AllocationResponseDTO;
import com.ration.ration_system.Service.AllocationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/allocations")
public class AllocationController {
    private final AllocationService allocationService;
    public AllocationController(AllocationService allocationService) {
        this.allocationService = allocationService;
    }
    @PostMapping
    public AllocationResponseDTO createAllocation(@RequestBody AllocationRequestDTO dto) {
        return allocationService.createAllocation(dto);
    }
    @GetMapping
    public List<AllocationResponseDTO> getAllAllocations() {
        return allocationService.getAllAllocations();
    }
    @GetMapping("/card/{cardId}")
    public List<AllocationResponseDTO> getAllocationsByCardId(@PathVariable Long cardId) {
        return allocationService.getAllocationsByCardId(cardId);
    }
}