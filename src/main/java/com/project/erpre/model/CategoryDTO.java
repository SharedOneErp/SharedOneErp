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

    private Integer one; // 대분류 번호
    private Integer two; // 중분류 번호
    private Integer three; // 소분류 번호
    private String paths; // 전체 경로

    // 추가
    private Integer topCategoryNo;
    private Integer middleCategoryNo;
    private Integer lowCategoryNo;
    private Integer categoryLv;




    public CategoryDTO(Integer one, Integer two, Integer three, Integer categoryNo, Integer categoryLevel, String paths, Timestamp categoryInsertDate, Timestamp categoryUpdateDate) {
        this.one = one;
        this.two = two;
        this.three = three;
        this.categoryNo = categoryNo;
        this.categoryLevel = categoryLevel;
        this.paths = paths;
        this.categoryInsertDate = categoryInsertDate;
        this.categoryUpdateDate = categoryUpdateDate;
    }

    // 카테고리 조회 생성자
    public CategoryDTO(Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo) {
        this.topCategoryNo = topCategoryNo;
        this.middleCategoryNo = middleCategoryNo;
        this.lowCategoryNo = lowCategoryNo;
    }
}