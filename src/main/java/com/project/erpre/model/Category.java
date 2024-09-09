package com.project.erpre.model;

import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_no")
    private Long categoryNo;

    @Column(name = "category_level", nullable = false)
    private Integer categoryLevel;

    @Column(name = "parent_category_no")
    private Integer parentCategoryNo;

    @Column(name = "category_nm", length = 100, nullable = false)
    private String categoryNm;

    @Column(name = "category_insert_date", nullable = false)
    private Timestamp categoryInsertDate;

    @Column(name = "category_update_date")
    private Timestamp categoryUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;


}