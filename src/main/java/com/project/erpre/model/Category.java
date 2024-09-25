package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "m_category")
@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_no")
    private Integer categoryNo;

    @Column(name = "category_level", nullable = false)
    private Integer categoryLevel = 1; // 기본값 설정

    @Column(name = "parent_category_no")
    private Integer parentCategoryNo;

    @Column(name = "category_nm", length = 100, nullable = false)
    private String categoryNm;

    @Column(name = "category_insert_date", nullable = false, insertable = false)
    // insertable = false: JPA가 엔터티를 삽입할 때 이 필드를 무시하고, 데이터베이스가 자동으로 값을 설정하도록 합니다. 예: CURRENT_TIMESTAMP로 현재 시간을 자동 입력.
    private Timestamp categoryInsertDate;

    @Column(name = "category_update_date")
    private Timestamp categoryUpdateDate;

    @Column(name = "category_delete_yn", length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'N'")
    private String categoryDeleteYn = "N"; // 삭제 여부 기본값 'N'

    @Column(name = "category_delete_date")
    private Timestamp categoryDeleteDate; // 삭제 일시

    @ToString.Exclude
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore
    // @JsonBackReference
    private List<Product> products;

    // 부모 카테고리를 참조하는 필드
    @ManyToOne
    @JoinColumn(name = "parent_category_no", insertable = false, updatable = false) // 외래 키 설정
    @JsonBackReference // 순환 참조 방지
    private Category parentCategory;

    // 자식 카테고리를 참조하는 필드
    @OneToMany(mappedBy = "parentCategory")
    @JsonIgnore
    private List<Category> subCategories;

    public String getCategoryPath() {
        StringBuilder path = new StringBuilder(this.categoryNm);
        Category parent = this.parentCategory;

        while (parent != null) {
            path.insert(0, parent.getCategoryNm() + " > "); // 상위 카테고리를 앞에 추가
            parent = parent.getParentCategory();
        }

        return path.toString();
    }
}