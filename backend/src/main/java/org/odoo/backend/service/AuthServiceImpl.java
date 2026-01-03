package org.odoo.backend.service;

import lombok.RequiredArgsConstructor;
import org.odoo.backend.common.exception.EmailAlreadyVerifiedException;
import org.odoo.backend.common.exception.InvalidCredentialsException;
import org.odoo.backend.common.exception.InvalidOtpException;
import org.odoo.backend.common.exception.UserNotFoundException;
import org.odoo.backend.dto.*;
import org.odoo.backend.model.User;
import org.odoo.backend.repositories.UserRepository;
import org.odoo.backend.security.jwt.JwtService;
import org.odoo.backend.service.impl.OtpServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpServiceImpl otpService;

    @Override
    @Transactional
    public ApiResponse login(LoginRequest request) {

        User user = userRepository.findByCompany_CompanyIdAndEmployeeId(request.getCompanyId(), request.getEmployeeId())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!user.isActive()) {
            throw new InvalidCredentialsException("Account disabled");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(
                user.getUserId(),
                user.getCompany().getCompanyId(),
                user.getRole(),
                user.getEmail()
        );

        user.setLastLogin(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        otpService.generateAndSendOtp(savedUser.getEmail());


      AuthResponse authResponse = AuthResponse.builder()
                .accessToken(token)
                .companyId(String.valueOf(user.getCompany().getCompanyId()))
                .role(user.getRole().name())
                .build();

        return new ApiResponse(true, "Registration successful. Please verify your email with OTP sent to " +
                savedUser.getEmail(), authResponse);
    }


    @Transactional
    public ApiResponse resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (user.isEmailVerified()) {
            throw new EmailAlreadyVerifiedException("Email is Already verified");
        }

        otpService.generateAndSendOtp(email);
        return new ApiResponse(true, "Otp Send Successfully to -> " + email, null);
    }

    public ApiResponse verifyOtp(OtpRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtpCode());
        if (!isValid) {
            throw new InvalidOtpException("Otp is not Valid");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User is not found By email" + request.getEmail()));

        user.setEmailVerified(true);
        userRepository.save(user);

        return new ApiResponse(true, "Email Verification is successful and now you can free to login ", null);
    }
}
