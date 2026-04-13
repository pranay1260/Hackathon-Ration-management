package com.ration.ration_system.controller;

import com.ration.ration_system.dto.InventoryRequestDTO;
import com.ration.ration_system.dto.InventoryResponseDTO;
import com.ration.ration_system.Service.InventoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@CrossOrigin
@RequestMapping("/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
    @PostMapping
    public InventoryResponseDTO createInventory(@RequestBody InventoryRequestDTO dto) {
        return inventoryService.createInventory(dto);
    }
    @GetMapping
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryService.getAllInventory();
    }
}