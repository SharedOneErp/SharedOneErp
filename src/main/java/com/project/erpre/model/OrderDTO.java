package com.project.erpre.model;

import lombok.*;

import java.math.BigDecimal;
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
    private String orderDStatus;
    private LocalDateTime orderDInsertDate;
    private LocalDateTime orderDUpdateDate;
}