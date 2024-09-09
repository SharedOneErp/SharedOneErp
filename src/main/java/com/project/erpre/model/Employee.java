package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
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

    @Column(name = "employee_name", length = 50, nullable = false) // 길이 수정
    private String employeeName;

    @Column(name = "employee_email", length = 30)
    private String employeeEmail;

    @Column(name = "employee_contact", length = 20, nullable = false) // employee_tel -> employee_contact로 수정
    private String employeeContact;

    @Column(name = "employee_role", length = 20, nullable = false)
    private String employeeRole;

    @Column(name = "employee_insert_date", nullable = false, updatable = false)
    private Timestamp employeeInsertDate;

    @Column(name = "employee_update_date")
    private Timestamp employeeUpdateDate;

    // 하나의 직원이 여러 개의 주문을 가질 수 있따
    @ToString.Exclude
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderHead> orderHeads;

    @PrePersist
    protected void onCreate() {
        this.employeeInsertDate = Timestamp.valueOf(LocalDateTime.now());
    }

    @PreUpdate
    protected void onUpdate() {
        this.employeeUpdateDate = Timestamp.valueOf(LocalDateTime.now());
    }
}
