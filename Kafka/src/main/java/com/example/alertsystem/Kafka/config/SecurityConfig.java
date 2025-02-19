package com.example.alertsystem.Kafka.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.disable())  // Disable if handled separately
                .csrf(csrf -> csrf.disable())  // Disable CSRF for APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login", "/auth/register", "/email/send").permitAll() // Allow login, register, and email sending
                        .anyRequest().authenticated() // Secure other endpoints
                )
                .logout(logout -> logout.logoutUrl("/auth/logout").permitAll()); // Ensure logout works properly

        return http.build();
    }
}