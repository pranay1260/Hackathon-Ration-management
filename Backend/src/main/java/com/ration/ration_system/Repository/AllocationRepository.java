package com.ration.ration_system.Repository;
import com.ration.ration_system.entity.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AllocationRepository extends JpaRepository<Allocation, Long> {
    Optional<Allocation> findByRationCardIdAndRationItemIdAndAllocationMonthAndAllocationYear(
            Long cardId, Long itemId, int month, int year);
}