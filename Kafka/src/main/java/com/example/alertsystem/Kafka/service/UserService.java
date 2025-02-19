package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(String username, String password, boolean isAdmin) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // ⚠️ Hash password in production
        user.setRole(isAdmin ? Role.ADMIN : Role.USER);
        return userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.map(user -> user.getPassword().equals(password)).orElse(false);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // ⚠️ Make sure password is encoded
                .roles(user.getRole().name())
                .build();
    }
}
