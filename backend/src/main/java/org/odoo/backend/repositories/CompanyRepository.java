package org.odoo.backend.repositories;

import org.odoo.backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, UUID> {
    boolean existsByCompanyNameIgnoreCase(String companyName);
    boolean existsByCompanyCode(String finalCode);
}