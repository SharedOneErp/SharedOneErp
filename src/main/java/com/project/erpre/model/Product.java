package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Product {

    @Id
    @Column(name = "product_cd", length = 10, nullable = false)
    private String productCd;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "category_no", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Category category;

    @Column(name = "product_nm", length = 100, nullable = false)
    private String productNm;

    @Column(name = "product_insert_date", nullable = false, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime productInsertDate;

    @Column(name = "product_update_date", columnDefinition = "timestamp")
    private LocalDateTime productUpdateDate;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Price> prices;

    @ToString.Exclude
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<OrderDetail> orderDetails;
}