package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_order_h")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class OrderHead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_h_no")
    private Long orderHNo;

    @ManyToOne
    @JoinColumn(name = "customer_no", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Employee employee;

    @Column(name = "order_h_total_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal orderHTotalPrice;

    @Column(name = "order_d_status", length = 10)
    private String orderDStatus;

    @Column(name = "order_d_insert_date", nullable = false)
    private Timestamp orderDInsertDate;

    @Column(name = "order_d_update_date")
    private Timestamp orderDUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "orderHead", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails;

}