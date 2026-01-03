package org.odoo.backend.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanySignupResponse {
    private String companyId;
    private String companyCode;
    private String adminUserId;
    private String message;
}