package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to,
                            @RequestParam String subject,
                            @RequestParam String message) {
        emailService.sendEmail(to, subject, message);
        return "Email sent successfully to: " + to;
    }
}
