package org.odoo.backend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String accessToken;   // JWT
    private String tokenType;     // "Bearer"
    private String role;          // ROLE_ADMIN / ROLE_HR / ROLE_EMPLOYEE
    private String companyId;     // UUID (for frontend context)
}