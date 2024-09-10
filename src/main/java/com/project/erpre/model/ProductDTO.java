package com.project.erpre.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO {
    private String productCd;
    private String productNm;
    private Timestamp productInsertDate;
    private Timestamp productUpdateDate;
    private Integer categoryNo;
}
