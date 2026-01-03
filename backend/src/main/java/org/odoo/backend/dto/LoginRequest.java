package org.odoo.backend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class LoginRequest {

    @NotNull(message = "Company ID is required")
    private UUID companyId;   // UUID as String

    @NotBlank(message = "Employee ID is required")
    private String employeeId;  // LOGIN ID (ADMIN-001 / OI-JD-2024-0001)

    @NotBlank(message = "Password is required")
    private String password;
}