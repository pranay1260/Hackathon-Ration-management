package com.ration.ration_system.config;
import com.ration.ration_system.entity.RationItem;
import com.ration.ration_system.Repository.RationItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
@Component
public class DataInitializer implements CommandLineRunner {
    private final RationItemRepository itemRepository;
    public DataInitializer(RationItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }
    @Override
    public void run(String... args) throws Exception {
        if (itemRepository.count() == 0) {
            addItem("Rice", RationItem.UnitType.KG, 3.0);
            addItem("Wheat", RationItem.UnitType.KG, 2.0);
            addItem("Sugar", RationItem.UnitType.KG, 13.5);
            addItem("Kerosene", RationItem.UnitType.LITRE, 15.0);
            addItem("Oil", RationItem.UnitType.LITRE, 40.0);
            System.out.println("SEED DATA: Default Ration Items Added!");
        }
    }
    private void addItem(String name, RationItem.UnitType unit, double price) {
        RationItem item = new RationItem();
        item.setItemName(name);
        item.setUnitType(unit);
        item.setPricePerUnit(price);
        item.setPricePerUnit(price);
        itemRepository.save(item);
    }
}
