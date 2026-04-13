package com.ration.ration_system.Service;

import com.ration.ration_system.dto.InventoryRequestDTO;
import com.ration.ration_system.dto.InventoryResponseDTO;
import com.ration.ration_system.entity.Inventory;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.entity.User;
import com.ration.ration_system.Repository.InventoryRepository;
import com.ration.ration_system.Repository.RationItemRepository;
import com.ration.ration_system.Repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final RationItemRepository rationItemRepository;
    private final UserRepository userRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            RationItemRepository rationItemRepository,
                            UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.rationItemRepository = rationItemRepository;
        this.userRepository = userRepository;
    }

    public InventoryResponseDTO createInventory(InventoryRequestDTO dto) {
        System.out.println("Processing Inventory Automation: " + dto.getQuantityAvailable() + " KGs");

        if (dto.getItemId() == null || dto.getManagerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item ID and Manager ID are required");
        }

        RationItem item = rationItemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manager User not found"));

        Inventory inventory = new Inventory();
        inventory.setQuantityAvailable(dto.getQuantityAvailable());
        inventory.setRationItem(item);
        inventory.setManagedBy(manager);
        if (dto.getQuantityAvailable() <= 0) {
            inventory.setStatus(Inventory.Status.OUT_OF_STOCK);
        } else if (dto.getQuantityAvailable() < 10) {
            inventory.setStatus(Inventory.Status.LOW_STOCK);
        } else {
            inventory.setStatus(Inventory.Status.AVAILABLE);
        }
        Inventory saved = inventoryRepository.save(inventory);
        return mapToResponse(saved);
    }

    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InventoryResponseDTO mapToResponse(Inventory saved) {
        InventoryResponseDTO response = new InventoryResponseDTO();
        response.setId(saved.getId());
        response.setQuantityAvailable(saved.getQuantityAvailable());
        if (saved.getRationItem() != null) {
            response.setItemId(saved.getRationItem().getId());
            response.setItemName(saved.getRationItem().getItemName());
            response.setUnitType(saved.getRationItem().getUnitType().name());
        }
        if (saved.getManagedBy() != null) response.setManagerId(saved.getManagedBy().getId());
        response.setStatus(saved.getStatus().name());
        response.setLastUpdated(saved.getLastUpdated());
        return response;
    }
}