package com.ration.ration_system.Service;

import com.ration.ration_system.dto.InventoryRequestDTO;
import com.ration.ration_system.dto.InventoryResponseDTO;
import com.ration.ration_system.entity.Inventory;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.entity.User;
import com.ration.ration_system.Repository.InventoryRepository;
import com.ration.ration_system.Repository.RationItemRepository;
import com.ration.ration_system.Repository.UserRepository;
import org.springframework.stereotype.Service;

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

        RationItem item = rationItemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        User manager = userRepository.findById(dto.getManagerId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Inventory inventory = new Inventory();
        inventory.setQuantityAvailable(dto.getQuantityAvailable());
        inventory.setRationItem(item);
        inventory.setManagedBy(manager);
        inventory.setStatus(Inventory.Status.valueOf(dto.getStatus()));

        Inventory saved = inventoryRepository.save(inventory);

        InventoryResponseDTO response = new InventoryResponseDTO();
        response.setId(saved.getId());
        response.setQuantityAvailable(saved.getQuantityAvailable());
        response.setItemId(saved.getRationItem().getId());
        response.setManagerId(saved.getManagedBy().getId());
        response.setStatus(saved.getStatus().name());
        response.setLastUpdated(saved.getLastUpdated());

        return response;
    }
}