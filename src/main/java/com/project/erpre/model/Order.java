package com.project.erpre.model;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Employee;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "m_order_h")
@Setter
@Getter
//@ToString()
@NoArgsConstructor
@AllArgsConstructor
@Builder // 빌더 패턴을 추가합니다.
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_h_no")
    private Integer orderNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_no")
    private Customer customer;

    @Column(name = "order_h_total_price")
    private BigDecimal orderHTotalPrice;

    @Column(name = "order_h_status")
    private String orderHStatus;

    @Column(name = "order_h_insert_date", nullable = false, insertable = false)
    // insertable = false: JPA가 엔터티를 삽입할 때 이 필드를 무시하고, 데이터베이스가 자동으로 값을 설정하도록 합니다. 예: CURRENT_TIMESTAMP로 현재 시간을 자동 입력.
    private LocalDateTime orderHInsertDate;

    @Column(name = "order_h_update_date")
    private LocalDateTime orderHUpdateDate;

    @Column(name = "order_h_delete_yn", length = 1, nullable = false, columnDefinition = "VARCHAR(1) DEFAULT 'N'")
    private String orderHDeleteYn; // 기본값 'N'

    @Column(name = "order_h_delete_date")
    private Timestamp orderHDeleteDate; // 삭제 일시
}