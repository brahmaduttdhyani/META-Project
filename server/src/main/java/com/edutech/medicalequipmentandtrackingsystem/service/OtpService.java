package com.edutech.medicalequipmentandtrackingsystem.service;
public interface OtpService {
 String generateOtp(String email); 
 boolean validateOtp(String email, String otp);
   
}
 