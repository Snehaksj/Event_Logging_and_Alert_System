package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.LoginRequest;
import com.example.alertsystem.Kafka.dto.RegisterRequest;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.createUser(request.getUsername(), request.getPassword(), request.isAdmin());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", registeredUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginRequest request) {
        boolean authenticated = userService.authenticateUser(request.getUsername(), request.getPassword());
        Map<String, String> response = new HashMap<>();
        if (authenticated) {
            User user = userService.getUserByUsername(request.getUsername());
            response.put("message","Login successfull");
            response.put("status","success");
            response.put("role",user.getRole().name());
            return ResponseEntity.ok(response);
        } else {
            response.put("message","Login failed. Check username and password");
            response.put("status","error");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
