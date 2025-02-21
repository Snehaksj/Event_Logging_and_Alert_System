package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.dto.LoginRequest;
import com.example.alertsystem.Kafka.dto.RegisterRequest;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.UserRepository;
import com.example.alertsystem.Kafka.security.JwtUtil;
import com.example.alertsystem.Kafka.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.userRepository=userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userService.existsByUsername(request.getUsername())) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
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
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        // Authenticate user
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            Optional<User> userdetails = Optional.ofNullable(userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found")));
            String token = jwtUtil.generateToken(username);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("status", "success");
            response.put("role", authentication.getAuthorities().toString());
            response.put("username", username);
            response.put("token",token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login failed: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

}
