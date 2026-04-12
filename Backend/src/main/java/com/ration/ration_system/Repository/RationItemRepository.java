
package com.ration.ration_system.Repository;
import com.ration.ration_system.entity.RationItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RationItemRepository extends JpaRepository<RationItem, Long> {
}