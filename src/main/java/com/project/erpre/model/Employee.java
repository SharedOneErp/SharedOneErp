package com.project.erpre.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id", length = 50, nullable = false)
    private String employeeId;

    @Column(name = "employee_pw", length = 50, nullable = false)
    private String employeePw;

    @Column(name = "employee_email", length = 30)
    private String employeeEmail;

    @Column(name = "employee_tel", length = 20, nullable = false)
    private String employeeTel;

    @Column(name = "employeeRole", length = 20, nullable = false)
    private String employeeRole;

    @Column(name = "employee_insert_date", nullable = false)
    private Timestamp employeeInsertDate;

    @Column(name = "employee_update_date")
    private Timestamp employeeUpdateDate;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Order> orders;
}