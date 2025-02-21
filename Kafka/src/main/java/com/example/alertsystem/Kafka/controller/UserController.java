package com.example.alertsystem.Kafka.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.UserRepository;
import com.example.alertsystem.Kafka.service.UserService;
import com.example.alertsystem.Kafka.dto.RegisterRequest;
import org.apache.kafka.common.protocol.types.Field;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.swing.plaf.synth.SynthOptionPaneUI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {

        this.userService = userService;
        this.userRepository = userRepository;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestBody Map<String,String> request) {
        Map<String, String> response = new HashMap<>();
        String username = request.get("username");
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Username does not exist"));
            userService.deleteUser(username);
            response.put("message","User deleted successfully");
            response.put("status","success");
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException e){

            response.put("message", e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<Map<String, String>> editUser(@RequestBody Map<String,String> request) {
        Map<String, String> response = new HashMap<>();
        String username = request.get("username");
        String password = request.get("password");
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Username does not exist"));
            userService.editUser(username,password);
            response.put("message","Password edited successfully");
            response.put("status","success");
            return ResponseEntity.ok(response);
        }
        catch (RuntimeException e){

            response.put("message", e.getMessage());
            response.put("status", "error");

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        System.out.println("skgwbgf bjkfsbvsfnvsfnvnslkvns");
        return ResponseEntity.ok(users);
    }
}
