package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "m_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Price {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_no")
    private Long priceNo;

    @ManyToOne
    @JoinColumn(name = "customer_no", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "product_cd", nullable = false)
    private Product product;

    @Column(name = "price_customer", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceCustomer;

    @Column(name = "price_discount_rate", precision = 4, scale = 2)
    private BigDecimal priceDiscountRate;

    @Column(name = "price_discount_start_date")
    private Timestamp priceDiscountStartDate;

    @Column(name = "price_discount_end_date")
    private Timestamp priceDiscountEndDate;

    @Column(name = "price_insert_date", nullable = false)
    private Timestamp priceInsertDate;

    @Column(name = "price_update_date")
    private Timestamp priceUpdateDate;

}
