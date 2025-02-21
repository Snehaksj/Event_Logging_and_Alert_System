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

    // ✅ Support JSON Body Requests
    @PostMapping("/send")
    public String sendEmail(@RequestBody EmailRequest emailRequest) {
        emailService.sendEmail(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getMessage());
        return "Email sent successfully to: " + emailRequest.getTo();
    }

    // ✅ Support Query Parameters (Existing Functionality)
    @PostMapping("/send-params")
    public String sendEmailWithParams(@RequestParam String to,
                                      @RequestParam String subject,
                                      @RequestParam String message) {
        emailService.sendEmail(to, subject, message);
        return "Email sent successfully to: " + to;
    }
}
