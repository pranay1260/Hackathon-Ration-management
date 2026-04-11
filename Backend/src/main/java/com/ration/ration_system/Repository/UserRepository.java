package com.ration.ration_system.Repository;

import com.ration.ration_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // SINGLE IDENTIFIER: Email is enough to uniquely identify a user
    Optional<User> findByEmail(String email);
}