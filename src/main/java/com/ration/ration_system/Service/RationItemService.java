package com.ration.ration_system.Service;

import com.ration.ration_system.dto.RationItemRequestDTO;
import com.ration.ration_system.dto.RationItemResponseDTO;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.Repository.RationItemRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RationItemService {

    private final RationItemRepository rationItemRepository;

    public RationItemService(RationItemRepository rationItemRepository) {
        this.rationItemRepository = rationItemRepository;
    }

    public RationItemResponseDTO createItem(RationItemRequestDTO dto) {
        RationItem item = new RationItem();
        item.setItemName(dto.getItemName());
        item.setUnitType(RationItem.UnitType.valueOf(dto.getUnitType()));
        item.setPricePerUnit(dto.getPricePerUnit());

        RationItem saved = rationItemRepository.save(item);
        return mapToResponse(saved);
    }

    public List<RationItemResponseDTO> getAllItems() {
        return rationItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RationItemResponseDTO updatePrice(Long id, Double price) {
        RationItem item = rationItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setPricePerUnit(price);
        RationItem saved = rationItemRepository.save(item);
        return mapToResponse(saved);
    }

    private RationItemResponseDTO mapToResponse(RationItem saved) {
        RationItemResponseDTO response = new RationItemResponseDTO();
        response.setId(saved.getId());
        response.setItemName(saved.getItemName());
        response.setUnitType(saved.getUnitType().name());
        response.setPricePerUnit(saved.getPricePerUnit());
        return response;
    }
}