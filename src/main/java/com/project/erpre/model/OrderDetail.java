package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "m_order_d")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_d_no")
    private Integer orderDNo;

    @ManyToOne
    @JoinColumn(name = "order_h_no", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_cd", nullable = false)
    private Product product;

    @Column(name = "order_d_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal orderDPrice;

    @Column(name = "order_d_qty", nullable = false)
    private int orderDQty;

    @Column(name = "order_d_total_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal orderDTotalPrice;

    @Column(name = "order_d_delivery_request_date")
    private Timestamp orderDDeliveryRequestDate;
}