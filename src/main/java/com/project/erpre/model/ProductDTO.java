package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private String productCd;
    private String productNm;
    private String categoryNm;
    private LocalDateTime productInsertDate;
    private LocalDateTime productUpdateDate;
    private String employeeName;
    private Date orderDDeliveryRequestDate;
    private Integer orderDQty;
    private BigDecimal orderDTotalPrice;
    private String customerName;
    private Integer categoryNo;
    private Integer topCategoryNo;    // 대분류 번호
    private Integer middleCategoryNo; // 중분류 번호
    private Integer lowCategoryNo;    // 소분류 번호
    private String topCategory; // 대분류 이름
    private String middleCategory; // 중분류 이름
    private String lowCategory; // 소분류 이름
    private String productDeleteYn; // 삭제 여부 기본값 'N'
    private Timestamp productDeleteDate; // 삭제 일시


    // 1. 전체 상품 목록 조회 생성자
    public ProductDTO(String productCd, String productNm, LocalDateTime productInsertDate, LocalDateTime productUpdateDate,
                      Timestamp productDeleteDate, String productDeleteYn,
                      String lowCategory, String middleCategory, String topCategory,
                      Integer lowCategoryNo, Integer middleCategoryNo,Integer topCategoryNo) {
        this.productCd = productCd;
        this.productNm = productNm;
        this.productInsertDate = productInsertDate;
        this.productUpdateDate = productUpdateDate;
        this.productDeleteDate = productDeleteDate;
        this.productDeleteYn = productDeleteYn;
        this.lowCategory = lowCategory;
        this.middleCategory = middleCategory;
        this.topCategory = topCategory;
        this.lowCategoryNo = lowCategoryNo;
        this.middleCategoryNo = middleCategoryNo;
        this.topCategoryNo = topCategoryNo;
    }

    // 2. 상품 상세정보 조회 생성자
    public ProductDTO(String productCd, String productNm, LocalDateTime productInsertDate, LocalDateTime productUpdateDate,
                      String employeeName, String customerName, Date orderDDeliveryRequestDate, Integer orderDQty, BigDecimal orderDTotalPrice,
                      String topCategory, String middleCategory, String lowCategory) {
        this.productCd = productCd;
        this.productNm = productNm;
        this.productInsertDate = productInsertDate;
        this.productUpdateDate = productUpdateDate;
        this.employeeName = employeeName;
        this.customerName = customerName;
        this.orderDDeliveryRequestDate = orderDDeliveryRequestDate;
        this.orderDQty = orderDQty;
        this.orderDTotalPrice = orderDTotalPrice;
        this.topCategory = topCategory;
        this.middleCategory = middleCategory;
        this.lowCategory = lowCategory;
    }

    // 3. 상품 등록 및 수정 생성자
    public ProductDTO(String productCd, String productNm, Integer categoryNo) {
        this.productCd = productCd;
        this.productNm = productNm;
        this.categoryNo = categoryNo;
    }

}
