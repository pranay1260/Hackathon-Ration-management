package com.ration.ration_system.Repository;
import com.ration.ration_system.entity.RationCard;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RationCardRepository extends JpaRepository<RationCard, Long> {
}