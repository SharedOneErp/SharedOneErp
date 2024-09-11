package com.project.erpre.model;

import lombok.*;

import javax.persistence.Column;
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
    private String categoryDeleteYn; // 삭제 여부 기본값 'N'
    private Timestamp categoryDeleteDate; // 삭제 일시
}