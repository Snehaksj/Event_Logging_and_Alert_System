//package com.example.alertsystem.Kafka.sms;
//
//import com.twilio.Twilio;
//import com.twilio.rest.api.v2010.account.Message;
//import com.twilio.type.PhoneNumber;
//import org.springframework.stereotype.Service;
//
//@Service
//public class SmsService {
//
//    // Twilio account SID and Auth Token (these should be kept in application.properties)
//    private static final String ACCOUNT_SID = "US297a17319b414692c7ba38145c828475";
//    private static final String AUTH_TOKEN = "your_auth_token";
//    private static final String FROM_PHONE = "your_twilio_phone_number";
//
//    // Initialize Twilio
//    public SmsService() {
//        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
//    }
//
//    public void sendSms(String toPhone, String message) {
//        Message.creator(
//                new PhoneNumber(toPhone), // recipient
//                new PhoneNumber(FROM_PHONE), // sender (your Twilio phone number)
//                message // SMS content
//        ).create();
//    }
//}
