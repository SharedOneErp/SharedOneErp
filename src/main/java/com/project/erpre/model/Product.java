package com.project.erpre.model;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;
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

    @Column(name = "product_insert_date", nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime productInsertDate;

    @Column(name = "product_update_date", columnDefinition = "timestamp")
    private LocalDateTime productUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // 양방향 관계에서 부모-자식 관계를 직렬화할 때 순환 참조를 방지합니다. 부모는 직렬화하고 자식은 무시하는 방식으로 설정합니다.
    private List<Price> prices;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderDetail> orderDetails;

    @PreUpdate
    public void preUpdate() {
        this.productUpdateDate = LocalDateTime.now();
    }
}