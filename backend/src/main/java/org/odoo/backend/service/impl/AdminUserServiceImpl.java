package org.odoo.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.odoo.backend.dto.adminDto.CreateUserRequest;
import org.odoo.backend.dto.adminDto.CreateUserResponse;
import org.odoo.backend.model.*;
import org.odoo.backend.repositories.EmployeeProfileRepository;
import org.odoo.backend.repositories.EmployeeSequenceRepository;
import org.odoo.backend.repositories.JobDetailsRepository;
import org.odoo.backend.repositories.UserRepository;
import org.odoo.backend.service.AdminUserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final EmployeeProfileRepository profileRepository;
    private final JobDetailsRepository jobDetailsRepository;
    private final EmployeeSequenceRepository sequenceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public CreateUserResponse createUser(CreateUserRequest request) {

        // 1. Validate role
        if (request.getRole() == UserRole.ROLE_ADMIN) {
            throw new IllegalStateException("Cannot create ADMIN user");
        }

        // 2. Get logged-in admin
        User admin = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        UUID companyId = admin.getCompany().getCompanyId();

        // 2.5 Check if user already exists in this company
        if (userRepository.existsByCompany_CompanyIdAndEmail(companyId, request.getEmail().toLowerCase())) {
            throw new IllegalStateException("User with this email already exists in your company");
        }

        // 3. Generate Employee ID
        LocalDate doj = LocalDate.parse(request.getDateOfJoining());
        int year = doj.getYear();

        EmployeeSequence seq = sequenceRepository
                .findByCompany_CompanyIdAndYear(companyId, year)
                .orElseGet(() -> sequenceRepository.save(
                        EmployeeSequence.builder()
                                .company(admin.getCompany())
                                .year(year)
                                .currentValue(0)
                                .build()
                ));

        seq.setCurrentValue(seq.getCurrentValue() + 1);
        sequenceRepository.save(seq);

        String employeeId = admin.getCompany().getCompanyCode()
                + "-"
                + request.getFirstName().substring(0, 1).toUpperCase()
                + request.getLastName().substring(0, 1).toUpperCase()
                + "-"
                + year
                + "-"
                + String.format("%04d", seq.getCurrentValue());

        // 4. Generate temp password
        String tempPassword = UUID.randomUUID().toString().substring(0, 10);

        // 5. Create User
        User user = User.builder()
                .userId(UUID.randomUUID())
                .company(admin.getCompany())
                .employeeId(employeeId)
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(tempPassword))
                .role(request.getRole())
                .active(true)
                .emailVerified(true)
                .firstLogin(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        // 6. Create Profile
        profileRepository.save(
                EmployeeProfile.builder()
                        .profileId(UUID.randomUUID().toString())
                        .user(user)
                        .company(admin.getCompany())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .build()
        );

        // 7. Create Job Details
        jobDetailsRepository.save(
                JobDetails.builder()
                        .company(admin.getCompany())
                        .user(user)
                        .department(request.getDepartment())
                        .dateOfJoining(doj)
                        .employeeStatus(EmployeeStatus.ACTIVE)
                        .build()
        );

        return CreateUserResponse.builder()
                .userId(user.getUserId().toString())
                .employeeId(employeeId)
                .role(user.getRole().name())
                .temporaryPassword(tempPassword)
                .build();
    }
}
