package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "m_order_d")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_d_no")
    private Integer orderNo;

    @ManyToOne
    @JoinColumn(name = "order_h_no", nullable = false)
    @JsonIgnore
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

    @Column(name = "order_d_insert_date", nullable = false, insertable = false)
    // insertable = false: JPA가 엔터티를 삽입할 때 이 필드를 무시하고, 데이터베이스가 자동으로 값을 설정하도록 합니다. 예: CURRENT_TIMESTAMP로 현재 시간을 자동 입력.
    private LocalDateTime orderDInsertDate;

    @Column(name = "order_d_update_date")
    private LocalDateTime orderDUpdateDate;

    @Column(name = "order_d_delete_yn", nullable = false)
    private String orderDDeleteYn="N";

    @Column(name = "order_d_delete_date")
    private Timestamp orderDDeleteDate; // 삭제 일시

}
