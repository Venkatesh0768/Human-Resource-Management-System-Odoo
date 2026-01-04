package org.odoo.backend.service;

import org.odoo.backend.dto.adminDto.CreateUserRequest;
import org.odoo.backend.dto.adminDto.CreateUserResponse;

public interface AdminUserService {
    CreateUserResponse createUser(CreateUserRequest request);
}