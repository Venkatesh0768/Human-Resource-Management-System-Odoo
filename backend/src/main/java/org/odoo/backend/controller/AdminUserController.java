package org.odoo.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.odoo.backend.dto.adminDto.CreateUserRequest;
import org.odoo.backend.dto.adminDto.CreateUserResponse;
import org.odoo.backend.service.impl.AdminUserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserServiceImpl adminUserService;

    @PostMapping
//    @PreAuthorize("h('ROLE_ADMIN')")
    public ResponseEntity<CreateUserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        CreateUserResponse response  = adminUserService.createUser(request);
        return new ResponseEntity<>(response , HttpStatus.CREATED);
    }
}