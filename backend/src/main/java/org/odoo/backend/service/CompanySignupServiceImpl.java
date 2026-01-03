package org.odoo.backend.service;

import lombok.RequiredArgsConstructor;
import org.odoo.backend.dto.ApiResponse;
import org.odoo.backend.dto.CompanySignupRequest;
import org.odoo.backend.dto.CompanySignupResponse;
import org.odoo.backend.model.Company;
import org.odoo.backend.model.User;
import org.odoo.backend.model.UserRole;
import org.odoo.backend.repositories.CompanyRepository;
import org.odoo.backend.repositories.UserRepository;
import org.odoo.backend.service.impl.OtpServiceImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanySignupServiceImpl {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpServiceImpl otpService;


    @Transactional
    public ApiResponse signupCompanyWithAdmin(CompanySignupRequest request) {

        // 1. Validate company uniqueness
        if (companyRepository.existsByCompanyNameIgnoreCase(request.getCompanyName())) {
            throw new IllegalStateException("Company already exists");
        }

        // 2. Generate company code
        String companyCode = generateUniqueCompanyCode(request.getCompanyName());

        // 3. Create company
        Company company = Company.builder()
                .companyName(request.getCompanyName())
                .companyCode(companyCode)
                .logoUrl(request.getLogoUrl())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        Company savedCompany = companyRepository.save(company);

        // 4. Create admin user
        User admin = User.builder()
                .company(company)
                .employeeId("ADMIN-001")
                .email(request.getAdminEmail().toLowerCase(Locale.ROOT))
                .passwordHash(passwordEncoder.encode(request.getAdminPassword()))
                .role(UserRole.ROLE_ADMIN)
                .active(true)
                .emailVerified(true)
                .firstLogin(false)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser=  userRepository.save(admin);

        otpService.generateAndSendOtp(savedUser.getEmail());

        CompanySignupResponse response = CompanySignupResponse.builder()
                .companyId(savedCompany.getCompanyId().toString())
                .companyCode(savedCompany.getCompanyCode())
                .adminUserId(savedUser.getUserId().toString())
                .message("Company and Admin registered successfully")
                .build();

        return new ApiResponse(true, "Registration successful. Please verify your email with OTP sent to " +
                savedUser.getEmail(), response);

        // 5. Response

    }

    private String generateUniqueCompanyCode(String companyName) {
        // 1. INPUT VALIDATION
        if (companyName == null || companyName.trim().isEmpty()) {
            throw new IllegalArgumentException("Company name cannot be null or empty");
        }

        String[] words = companyName.replaceAll("[^A-Za-z ]", "").trim().split("\\s+");

        StringBuilder codeBuilder = new StringBuilder();
        if (words.length == 0 || (words.length == 1 && words[0].isEmpty())) {
            codeBuilder.append("DEF");
        } else {
            for (String word : words) {
                if (!word.isEmpty()) {
                    codeBuilder.append(word.charAt(0));
                }
            }
        }


        if (codeBuilder.length() < 2 && words.length > 0 && words[0].length() > 1) {
            codeBuilder.append(words[0].substring(1, Math.min(words[0].length(), 3)));
        }

        String code = codeBuilder.toString().toUpperCase(Locale.ROOT);

        if (code.isEmpty()) code = "GEN";

        // 4. HANDLE COLLISIONS
        String finalCode = code;
        int counter = 1;
        while (companyRepository.existsByCompanyCode(finalCode)) {
            finalCode = code + counter++;
        }

        return finalCode;
    }

}
