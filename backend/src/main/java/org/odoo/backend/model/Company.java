package org.odoo.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "companies",
        uniqueConstraints = @UniqueConstraint(columnNames = "company_code"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @Column(name = "company_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID companyId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_code", nullable = false, length = 10)
    private String companyCode; // e.g. OI, TCS, INFY

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "is_active")
    private boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
