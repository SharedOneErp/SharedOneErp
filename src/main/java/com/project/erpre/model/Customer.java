package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "m_customer")
@Data //@Data는 @Getter, @Setter, @ToString, @EqualsAndHashCode 등을 포함
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_no")
    private Integer customerNo;

    @Column(name = "customer_name", length = 100, nullable = false)
    private String customerName;

    @Column(name = "customer_tel", length = 20)
    private String customerTel;

    @Column(name = "customer_representative_name", length = 50)
    private String customerRepresentativeName;

    @Column(name = "customer_business_reg_no", length = 20, nullable = false)
    private String customerBusinessRegNo;

    @Column(name = "customer_addr", length = 200)
    private String customerAddr;

    @Column(name = "customer_fax_no", length = 20)
    private String customerFaxNo;

    @Column(name = "customer_manager_name", length = 20)
    private String customerManagerName;

    @Column(name = "customer_manager_email", length = 50)
    private String customerManagerEmail;

    @Column(name = "customer_manager_tel", length = 20)
    private String customerManagerTel;

    @Column(name = "customer_country_code", length = 20)
    private String customerCountryCode;

    @Column(name = "customer_type", length = 20)
    private String customerType;

    @Column(name = "customer_e_tax_invoice_yn", length = 20)
    private String customerEtaxInvoiceYn;

    @Column(name = "customer_transaction_start_date")
    private Timestamp customerTransactionStartDate;

    @Column(name = "customer_transaction_end_date")
    private Timestamp customerTransactionEndDate;

    @Column(name = "customer_insert_date", insertable = false, nullable = false)
    private Timestamp customerInsertDate;

    @Column(name = "customer_update_date")
    private Timestamp customerUpdateDate;

    @Column(name = "customer_delete_yn", length = 20, nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'N'")
    private String customerDeleteYn; // 삭제 여부 기본값 'N'

    @Column(name = "customer_delete_date")
    private Timestamp customerDeleteDate; // 삭제 일시

    @ToString.Exclude
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)

    @JsonIgnore // 순환 참조 방지(무한 재귀 호출-스택 오버플로우 해결) -> 해당 필드를 완전히 직렬화/역직렬화에서 배제합니다. 특정 필드를 직렬화에서 아예 제외하고 싶을 때 사용됩니다.
    private List<Order> orderHeads;

    @ToString.Exclude
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Price> prices = new ArrayList<>();  // 빈 리스트로 초기화

}