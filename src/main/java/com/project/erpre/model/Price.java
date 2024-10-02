package com.project.erpre.model;

import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.sql.Date;

/**
 * Price 엔티티는 m_price 테이블과 매핑됩니다.
 * 가격 정보와 고객, 제품에 대한 연관 관계를 나타내며, 각 가격의 적용 기간 및 삭제 여부 등을 관리합니다.
 */
@Entity
@Table(name = "m_price")  // m_price 테이블과 매핑
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
    private Integer priceNo;  // 가격 번호 (자동 증가, 기본키)

    @ManyToOne
    @JoinColumn(name = "customer_no", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Customer customer;  // 고객 정보 (m_customer 테이블 참조, 외래키)

    @ManyToOne
    @JoinColumn(name = "product_cd", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Product product;  // 제품 정보 (m_product 테이블 참조, 외래키)

    @Column(name = "price_customer", nullable = false, precision = 15, scale = 2)
    private BigDecimal priceCustomer;  // 고객별 가격 (소수점 포함, 정밀도 15, 소수점 이하 2자리)

    @Column(name = "price_start_date")
    private Date priceStartDate;  // 가격 적용 시작 일자 (null일 경우 즉시 적용)

    @Column(name = "price_end_date")
    private Date priceEndDate;  // 가격 적용 종료 일자 (null일 경우 무기한 적용)

    @Column(name = "price_insert_date", nullable = false, insertable = false, updatable = false)
    private Timestamp priceInsertDate;  // 가격 등록 일시 (데이터베이스에서 자동으로 설정, CURRENT_TIMESTAMP 사용)

    @Column(name = "price_update_date")
    private Timestamp priceUpdateDate;  // 가격 수정 일시 (수정 시 업데이트)

    @Column(name = "price_delete_yn", length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'N'")
    private String priceDeleteYn = "N";  // 삭제 여부 (기본값 'N', 삭제되지 않은 상태)

    @Column(name = "price_delete_date")
    private Timestamp priceDeleteDate;  // 삭제 일시 (삭제된 경우에만 설정)
}