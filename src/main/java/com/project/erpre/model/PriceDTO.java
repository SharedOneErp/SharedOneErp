package com.project.erpre.model;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class PriceDTO {

    private Integer priceNo; // 가격 번호
    private Integer customerNo; // 고객 번호 (m_customer)
    private String customerName; // 고객 이름
    private String productCd; // 제품 코드 (m_product)
    private String productNm; // 제품 이름
    private String categoryNm;  // 카테고리 이름 (m_category)
    private BigDecimal priceCustomer; // 고객별 가격
    private Timestamp priceStartDate; // 가격 적용 시작 일자
    private Timestamp priceEndDate; // 가격 적용 종료 일자
    private Timestamp priceInsertDate; // 가격 등록 일시
    private Timestamp priceUpdateDate; // 가격 수정 일시
}