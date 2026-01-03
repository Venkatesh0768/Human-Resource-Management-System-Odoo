package org.odoo.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.odoo.backend.dto.ApiResponse;
import org.odoo.backend.dto.AuthResponse;
import org.odoo.backend.dto.LoginRequest;
import org.odoo.backend.dto.OtpRequest;
import org.odoo.backend.service.AuthService;
import org.odoo.backend.service.AuthServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse response = authService.login(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody OtpRequest request) {
        ApiResponse response = authService.verifyOtp(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/resend-otp/{email}")
    public ResponseEntity<ApiResponse> resendOtp(@PathVariable String email) {
        ApiResponse response = authService.resendOtp(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

