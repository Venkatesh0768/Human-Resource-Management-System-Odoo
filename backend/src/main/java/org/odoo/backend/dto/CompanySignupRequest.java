package org.odoo.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanySignupRequest {
    private String companyName;
    private String logoUrl;
    private String adminName;

    private String adminEmail;
    private String adminPassword;
}
