package org.odoo.backend.service;

import org.odoo.backend.dto.ApiResponse;
import org.odoo.backend.dto.LoginRequest;

public interface AuthService {
    ApiResponse login(LoginRequest request);
}
