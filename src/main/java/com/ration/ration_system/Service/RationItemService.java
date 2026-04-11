package com.ration.ration_system.Service;

import com.ration.ration_system.dto.RationItemRequestDTO;
import com.ration.ration_system.dto.RationItemResponseDTO;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.Repository.RationItemRepository;
import org.springframework.stereotype.Service;

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

        RationItemResponseDTO response = new RationItemResponseDTO();
        response.setId(saved.getId());
        response.setItemName(saved.getItemName());
        response.setUnitType(saved.getUnitType().name());
        response.setPricePerUnit(saved.getPricePerUnit());

        return response;
    }
}