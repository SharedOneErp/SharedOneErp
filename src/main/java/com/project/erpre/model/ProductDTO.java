package com.project.erpre.model;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ProductDTO {
    private String productCd;
    private String productNm;
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
}
