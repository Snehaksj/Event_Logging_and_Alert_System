package com.example.alertsystem.Kafka.repository;

import com.example.alertsystem.Kafka.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
