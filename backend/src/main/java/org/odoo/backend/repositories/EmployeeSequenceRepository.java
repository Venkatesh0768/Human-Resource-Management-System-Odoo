package org.odoo.backend.repositories;

import org.odoo.backend.model.EmployeeSequence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmployeeSequenceRepository extends JpaRepository<EmployeeSequence, Long> {
    Optional<EmployeeSequence> findByCompany_CompanyIdAndYear(UUID companyId, int year);
}
