package com.project.erpre.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

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
}
