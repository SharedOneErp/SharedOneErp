package com.project.erpre.model;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.sql.Date;

/**
 * PriceDTO는 클라이언트와 서버 간의 데이터 전송을 위한 객체입니다.
 * Price 엔티티의 데이터를 전달하거나, 데이터베이스와 직접 연관되지 않은 비즈니스 로직에서 사용됩니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class PriceDTO {

    private Integer priceNo; // 가격 번호
    private Integer customerNo;  // 고객 번호 (m_customer 테이블의 고객 번호)
    private String productCd;  // 제품 코드 (m_product 테이블의 제품 코드)
    private BigDecimal priceCustomer; // 고객별 가격
    private Date priceStartDate; // 가격 적용 시작 일자
    private Date priceEndDate; // 가격 적용 종료 일자
    private Timestamp priceInsertDate; // 가격 등록 일시
    private Timestamp priceUpdateDate; // 가격 수정 일시
    private String priceDeleteYn = "N"; // 삭제 여부 기본값 'N'
    private Timestamp priceDeleteDate; // 삭제 일시

    // 연관된 엔티티의 추가 정보 (직접적으로 Price 엔티티와는 연관되지 않지만 UI를 위해 사용)
    private String customerName;  // 고객 이름 (m_customer 테이블에서 가져온 값)
    private String productNm;  // 제품 이름 (m_product 테이블에서 가져온 값)
    private String categoryNm;  // 카테고리 이름 (m_category 테이블에서 가져온 값)
    private String categoryPath;  // 카테고리 경로 (m_category 테이블에서 가져온 값)
}