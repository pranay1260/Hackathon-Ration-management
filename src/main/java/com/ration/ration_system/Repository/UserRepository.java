package com.ration.ration_system.Repository;

import com.ration.ration_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}