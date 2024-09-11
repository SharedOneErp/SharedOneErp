package com.project.erpre.model;

import lombok.*;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {

    private Integer orderNo;
    private Employee employee;
    private Customer customer;
    private BigDecimal orderHTotalPrice;
    private String orderHStatus;
    private LocalDateTime orderHInsertDate;
    private LocalDateTime orderHUpdateDate;
    private String orderHDeleteYn; // 삭제 여부 기본값 'N'
    private Timestamp orderHDeleteDate; // 삭제 일시
}