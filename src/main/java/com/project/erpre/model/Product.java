package com.project.erpre.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "m_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @Column(name = "product_cd", length = 10, nullable = false)
    private String productCd;

    @Column(name = "category_no")
    private Integer categoryNo;

    @Column(name = "product_nm", length = 100, nullable = false)
    private String productNm;

    @Column(name = "product_insert_date", nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime productInsertDate;

    @Column(name = "product_update_date", columnDefinition = "timestamp")
    private LocalDateTime productUpdateDate;
}
