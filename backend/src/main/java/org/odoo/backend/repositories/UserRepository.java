package org.odoo.backend.repositories;

import org.odoo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByCompany_CompanyIdAndEmployeeId(UUID companyId, String employeeId);
    boolean existsByCompany_CompanyIdAndEmail(UUID companyId, String email);
    Optional<User> findByEmail(String email);
}
