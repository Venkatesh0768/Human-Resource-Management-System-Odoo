package org.odoo.backend.controller;



import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.odoo.backend.dto.CompanySignupRequest;
import org.odoo.backend.dto.CompanySignupResponse;
import org.odoo.backend.service.CompanySignupServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/company")
@RequiredArgsConstructor
public class CompanySignupController {

    private final CompanySignupServiceImpl companySignupService;

    @PostMapping("/signup")
    public ResponseEntity<CompanySignupResponse> signupCompany(@Valid @RequestBody CompanySignupRequest requestDto) {
        CompanySignupResponse response = companySignupService.signupCompanyWithAdmin(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}