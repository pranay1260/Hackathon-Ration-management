package com.ration.ration_system.controller;
import com.ration.ration_system.dto.RationCardRequestDTO;
import com.ration.ration_system.dto.RationCardResponseDTO;
import com.ration.ration_system.Service.RationCardService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@CrossOrigin
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
    @GetMapping
    public List<RationCardResponseDTO> getAllCards() {
        return rationCardService.getAllCards();
    }
    @GetMapping("/user/{userId}")
    public List<RationCardResponseDTO> getCardsByUserId(@PathVariable Long userId) {
        return rationCardService.getCardsByUserId(userId);
    }
    @PatchMapping("/{id}/status")
    public RationCardResponseDTO updateStatus(@PathVariable Long id, @RequestBody RationCardRequestDTO dto) {
        return rationCardService.updateCardStatus(id, dto.getStatus());
    }
}
