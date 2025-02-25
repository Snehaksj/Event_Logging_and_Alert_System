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
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;
    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
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
            // Check if user exists
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Username does not exist"));

            // Check if password matches
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Invalid password");
            }

            // Perform authentication
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Generate token
            String token = jwtUtil.generateToken(username);

            // Prepare response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("status", "success");
            response.put("role", authentication.getAuthorities().toString());
            response.put("username", username);
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Handle errors and provide specific error message
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

        }
    }


}
