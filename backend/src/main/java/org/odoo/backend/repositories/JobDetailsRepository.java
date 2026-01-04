package org.odoo.backend.repositories;

import org.odoo.backend.model.JobDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JobDetailsRepository extends JpaRepository<JobDetails, UUID> {
}