package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_customer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_no")
    private Long customerNo;

    @Column(name = "customer_name", length = 100, nullable = false)
    private String customerName;

    @Column(name = "customer_addr", length = 200)
    private String customerAddr;

    @Column(name = "customer_tel", length = 20, nullable = false)
    private String customerTel;

    @Column(name = "customer_business_reg_no", length = 20)
    private String customerBusinessRegNo;

    @Column(name = "customer_manager_name", length = 50, nullable = false)
    private String customerManagerName;

    @Column(name = "customer_manager_email", length = 100)
    private String customerManagerEmail;

    @Column(name = "customer_manager_tel", length = 20, nullable = false)
    private String customerManagerTel;

    @Column(name = "customer_insert_date", nullable = false)
    private Timestamp customerInsertDate;

    @Column(name = "customer_update_date")
    private Timestamp customerUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orderHeads;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Price> prices;

}