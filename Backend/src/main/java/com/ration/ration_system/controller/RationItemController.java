package com.ration.ration_system.controller;
import com.ration.ration_system.dto.RationItemRequestDTO;
import com.ration.ration_system.dto.RationItemResponseDTO;
import com.ration.ration_system.Service.RationItemService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/items")
public class RationItemController {
    private final RationItemService rationItemService;
    public RationItemController(RationItemService rationItemService) {
        this.rationItemService = rationItemService;
    }
    @PostMapping
    public RationItemResponseDTO createItem(@RequestBody RationItemRequestDTO dto) {
        return rationItemService.createItem(dto);
    }
    @GetMapping
    public List<RationItemResponseDTO> getAllItems() {
        return rationItemService.getAllItems();
    }
    @PatchMapping("/{id}/price")
    public RationItemResponseDTO updatePrice(@PathVariable Long id, @RequestBody RationItemRequestDTO dto) {
        return rationItemService.updatePrice(id, dto.getPricePerUnit());
    }
}