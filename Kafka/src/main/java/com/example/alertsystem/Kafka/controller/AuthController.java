package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.LoginRequest;
import com.example.alertsystem.Kafka.dto.RegisterRequest;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.authenticateUser(request));
    }
}
