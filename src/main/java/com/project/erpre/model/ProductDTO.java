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
    private String topCategory; // 대분류 이름
    private String middleCategory; // 중분류 이름
    private String lowCategory; // 소분류 이름
    private String productDeleteYn; // 삭제 여부 기본값 'N'
    private Timestamp productDeleteDate; // 삭제 일시


    public ProductDTO(String productCd, String productNm, LocalDateTime productInsertDate, LocalDateTime productUpdateDate, Integer categoryNo, String topCategory, String middleCategory, String lowCategory) {
        this.productCd = productCd;
        this.productNm = productNm;
        this.productInsertDate = productInsertDate;
        this.productUpdateDate = productUpdateDate;
        this.categoryNo = categoryNo;
        this.topCategory = topCategory;
        this.middleCategory = middleCategory;
        this.lowCategory = lowCategory;
    }

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

    public ProductDTO(String productCd, String productNm, Integer CategoryNo) {
         this.productCd = productCd;
         this.productNm = productNm;
         this.categoryNo = CategoryNo;
    }

}
