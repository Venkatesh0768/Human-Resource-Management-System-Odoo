package org.odoo.backend.repositories;

import org.odoo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByCompany_CompanyIdAndEmployeeId(
            String companyId, UUID employeeId);

    boolean existsByCompany_CompanyIdAndEmail(
            String companyId, UUID email);
}
