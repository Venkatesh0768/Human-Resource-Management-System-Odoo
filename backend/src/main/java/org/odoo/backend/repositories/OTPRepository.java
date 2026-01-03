package org.odoo.backend.repositories;

import org.odoo.backend.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OTPRepository extends JpaRepository<OTP, UUID> {
    void deleteOTPByEmail(String email);
    Optional<OTP> findByEmailAndOtpCodeAndVerifiedFalse(String email , String otp);
}