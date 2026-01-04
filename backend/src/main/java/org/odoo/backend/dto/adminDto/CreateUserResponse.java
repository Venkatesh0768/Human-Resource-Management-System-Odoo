package org.odoo.backend.dto.adminDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateUserResponse {

    private String userId;
    private String employeeId;
    private String role;
    private String temporaryPassword;
}