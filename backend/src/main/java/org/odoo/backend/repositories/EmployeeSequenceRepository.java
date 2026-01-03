package org.odoo.backend.repositories;

import org.odoo.backend.model.EmployeeSequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeSequenceRepository extends JpaRepository<EmployeeSequence, Long> {
    Optional<EmployeeSequence> findByCompany_CompanyIdAndYear(String companyId, int year);
}
