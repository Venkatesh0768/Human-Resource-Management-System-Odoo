package org.odoo.backend.service;

import java.util.Random;

public interface OTPService {
    String generateOtp();
    void generateAndSendOtp(String email);
    void generateAndSendPasswordResetOTP(String email);
    boolean validateOtp(String email , String otp);

}