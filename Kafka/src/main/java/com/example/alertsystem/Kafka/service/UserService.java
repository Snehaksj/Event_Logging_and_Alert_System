package com.example.alertsystem.Kafka.service;

import com.example.alertsystem.Kafka.entity.Role;
import com.example.alertsystem.Kafka.entity.User;
import com.example.alertsystem.Kafka.repository.UserRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder password) {
        this.userRepository = userRepository;
        this.passwordEncoder = password;
    }

    public void saveAll(List<User> users) {
        userRepository.saveAll(users);
    }


    public List<String> saveBulkUsers(MultipartFile file) throws IOException {
        List<String> errorMessages = new ArrayList<>();
        List<User> usersToSave = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        // Create a set to store usernames from the Excel file to check for duplicates
        Set<String> excelUsernames = new HashSet<>();

        // Iterate through rows to extract usernames and passwords
        for (Row row : sheet) {
            String username = row.getCell(0).getStringCellValue();  // Assuming username is in the first column
            String password = row.getCell(1).getStringCellValue();  // Assuming password is in the second column

            // Check if the username is already in the Excel file (to prevent internal duplicates)
            if (excelUsernames.contains(username)) {
                errorMessages.add("Duplicate username in the file: " + username);
                continue;  // Skip this user
            }
            excelUsernames.add(username);

            // Check if the username already exists in the database
            if (existsByUsername(username)) {
                errorMessages.add("Username already exists in the database: " + username);
            } else {
                String encryptedPassword = passwordEncoder.encode(password);  // Encrypt the password

                User user = new User();
                user.setUsername(username);
                user.setRole(Role.USER);
                user.setPassword(encryptedPassword);  // Store the encrypted password
                usersToSave.add(user);
            }
        }

        // If there are no errors, save the users
        if (errorMessages.isEmpty()) {
            saveAll(usersToSave);
        }

        return errorMessages;
    }


    public User createUser(String username, String password, boolean isAdmin) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // ⚠️ Hash password in production
        user.setRole(isAdmin ? Role.ADMIN : Role.USER);
        return userRepository.save(user);
    }

    public void editUser(String username, String password) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.deleteById(user.getId());
    }

    public List<User> getAllUsers() {
        try{
            return userRepository.findAll();
        }
       catch (Exception e){
            System.out.println(e);
            List<User> a=new ArrayList();
           return a;
       }
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

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
