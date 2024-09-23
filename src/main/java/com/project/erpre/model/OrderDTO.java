package com.project.erpre.model;

import lombok.*;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    // 추가된 필드
    private List<OrderDetailDTO> orderDetails = new ArrayList<>();
    private List<Integer> deletedDetailIds; // 삭제할 상세항목 id 배열
    private List<Product> products; // 상품 리스트
}