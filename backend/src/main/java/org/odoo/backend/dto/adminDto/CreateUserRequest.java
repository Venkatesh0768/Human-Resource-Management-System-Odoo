package org.odoo.backend.dto.adminDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.odoo.backend.model.UserRole;

@Getter
@Setter
public class CreateUserRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotNull
    private UserRole role; // ROLE_HR or ROLE_EMPLOYEE

    @NotBlank
    private String department;

    @NotNull
    private String dateOfJoining; // yyyy-MM-dd
}