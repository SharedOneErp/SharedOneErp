package com.project.erpre.model;

import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryDTO {
    private Integer categoryNo;
    private Integer categoryLevel;
    private Integer parentCategoryNo;
    private String categoryNm;
    private Timestamp categoryInsertDate;
    private Timestamp categoryUpdateDate;
}