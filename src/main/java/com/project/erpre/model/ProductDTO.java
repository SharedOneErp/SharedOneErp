package com.project.erpre.model;

import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class ProductDTO {
    private String productCd;
    private String productNm;
    private LocalDateTime productInsertDate;
    private LocalDateTime productUpdateDate;
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
}
