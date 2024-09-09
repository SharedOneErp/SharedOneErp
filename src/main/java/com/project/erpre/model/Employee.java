package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_employee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Employee {

    @Id
    @Column(name = "employee_id", length = 50, nullable = false)
    private String employeeId;

    @Column(name = "employee_pw", length = 50, nullable = false)
    private String employeePw;

    @Column(name = "employee_email", length = 30)
    private String employeeEmail;

    @Column(name = "employee_contact", length = 20, nullable = false)
    private String employeeContact;

    @Column(name = "employee_role", length = 20, nullable = false)
    private String employeeRole;

    @Column(name = "employee_insert_date", nullable = false)
    private Timestamp employeeInsertDate;

    @Column(name = "employee_update_date")
    private Timestamp employeeUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<OrderHead> orderHeads;

}