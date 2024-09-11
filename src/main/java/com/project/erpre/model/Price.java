package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "m_price")
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
    private Integer priceNo; // 가격 번호

    @ManyToOne
    @JoinColumn(name = "customer_no", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Customer customer; // 고객 번호 (m_customer 테이블 참조)

    @ManyToOne
    @JoinColumn(name = "product_cd", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Product product; // 제품 코드 (m_product 테이블 참조)

    @Column(name = "price_customer", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceCustomer; // 고객별 가격

    @Column(name = "price_start_date")
    private Timestamp priceStartDate; // 가격 적용 시작 일자

    @Column(name = "price_end_date")
    private Timestamp priceEndDate; // 가격 적용 종료 일자

    @Column(name = "price_insert_date", nullable = false)
    private Timestamp priceInsertDate; // 가격 등록 일시

    @Column(name = "price_update_date")
    private Timestamp priceUpdateDate; // 가격 수정 일시

    @Column(name = "price_delete_yn", length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'N'")
    private String priceDeleteYn; // 삭제 여부 기본값 'N'

    @Column(name = "price_delete_date")
    private Timestamp priceDeleteDate; // 삭제 일시

}