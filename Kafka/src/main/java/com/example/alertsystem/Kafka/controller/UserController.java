package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.service.UserService;
import com.example.alertsystem.Kafka.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody RegisterRequest request, Authentication authentication) {
        User admin = userService.getUserByUsername(authentication.getName());
        if (admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        User newUser = userService.createUser(request.getUsername(), request.getPassword(), request.isAdmin());
        return ResponseEntity.ok(newUser);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId, Authentication authentication) {
        User admin = userService.getUserByUsername(authentication.getName());
        if (admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body("Unauthorized");
        }
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(Authentication authentication) {
        User admin = userService.getUserByUsername(authentication.getName());
        if (admin.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(null);
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/create-bulk")
    public ResponseEntity<String> createUsersBulk(@RequestBody List<User> users) {
        userService.saveAll(users);
        return ResponseEntity.ok("Users created successfully");
    }
}
