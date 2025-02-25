package com.example.alertsystem.Kafka.controller;

import com.example.alertsystem.Kafka.model.EmailRequest;
import com.example.alertsystem.Kafka.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    // ✅ JSON Body Request
    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getMessage());
        return "Email sent successfully to: " + emailRequest.getTo();
    }
}
