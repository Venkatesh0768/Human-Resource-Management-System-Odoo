package org.odoo.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_sequence",
        uniqueConstraints = @UniqueConstraint(columnNames = "year"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "year", nullable = false)
    private int year;

    @Column(name = "current_value", nullable = false)
    private int currentValue;
}