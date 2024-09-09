package com.project.erpre.model;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Employee;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "m_order_h")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder // 빌더 패턴을 추가합니다.
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_h_no")
    private Long orderNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_no")
    private Customer customer;

    @Column(name = "order_h_total_price")
    private BigDecimal orderHTotalPrice;

    @Column(name = "order_d_status")
    private String orderDStatus;

    @Column(name = "order_d_insert_date")
    private LocalDateTime orderDInsertDate;

    @Column(name = "order_d_update_date")
    private LocalDateTime orderDUpdateDate;
}
