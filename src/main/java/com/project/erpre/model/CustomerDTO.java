package com.project.erpre.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {

    private Integer customerNo;
    private String customerName;
    private String customerTel;
    private String customerRepresentativeName;
    private String customerBusinessRegNo;
    private String customerAddr;
    private String customerFaxNo;
    private String customerManagerName;
    private String customerManagerEmail;
    private String customerManagerTel;
    private String customerCountryCode;
    private String customerType;
    private String customerEtaxInvoiceYn;
    private Timestamp customerTransactionStartDate;
    private Timestamp customerTransactionEndDate;
    private Timestamp customerInsertDate;
    private Timestamp customerUpdateDate;
    private String customerDeleteYn; // 삭제 여부 기본값 'N'
    private Timestamp customerDeleteDate; // 삭제 일시
}
