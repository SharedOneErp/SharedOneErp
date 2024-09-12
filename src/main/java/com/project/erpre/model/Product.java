package com.project.erpre.model;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "m_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "productCd")
public class Product {

    @Id
    @Column(name = "product_cd", length = 10, nullable = false)
    private String productCd;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "category_no", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonIgnore
    private Category category;

    @Column(name = "product_nm", length = 100, nullable = false)
    private String productNm;

    @Column(name = "product_insert_date", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime productInsertDate;

    @Column(name = "product_update_date")
    private LocalDateTime productUpdateDate;

    @Column(name = "product_delete_yn", length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'N'")
    private String productDeleteYn; // 삭제 여부 기본값 'N'

    @Column(name = "product_delete_date")
    private Timestamp productDeleteDate; // 삭제 일시

    @PrePersist
    @PreUpdate
    public void updateFields() {
        if (this.productDeleteYn == null) {
            this.productDeleteYn = "N"; // 기본값 설정
        }
        if (this.productUpdateDate != null) {
            this.productUpdateDate = LocalDateTime.now();
        }
        if (this.productInsertDate == null) {
            this.productInsertDate = LocalDateTime.now(); // 기본값 설정
        }
    }

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Price> prices;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderDetail> orderDetails;
}
