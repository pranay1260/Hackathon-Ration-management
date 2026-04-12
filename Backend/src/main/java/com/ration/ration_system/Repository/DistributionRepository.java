package com.ration.ration_system.Repository;
import com.ration.ration_system.entity.Distribution;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DistributionRepository extends JpaRepository<Distribution, Long> {
}