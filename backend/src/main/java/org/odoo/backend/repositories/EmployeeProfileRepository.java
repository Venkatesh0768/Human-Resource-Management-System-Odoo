package org.odoo.backend.repositories;

import org.odoo.backend.model.EmployeeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeProfileRepository extends JpaRepository<EmployeeProfile, String> {
}