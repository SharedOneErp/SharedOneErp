package com.project.erpre.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailDTO {

    private Integer orderNo;  // OrderDetail의 PK
    private Integer orderHNo; // Order의 FK (Order 엔티티 대신 사용)
    private String productCd; // Product의 FK (Product 엔티티 대신 사용)
    private BigDecimal orderDPrice;
    private int orderDQty;
    private BigDecimal orderDTotalPrice;
    private Timestamp orderDDeliveryRequestDate;

    private LocalDateTime orderDInsertDate;
    private LocalDateTime orderDUpdateDate;
    private String orderDDeleteYn = "N"; // 기본값 설정
    private Timestamp orderDDeleteDate; // 삭제 일시

    //Entity : 데이터베이스 테이블과 1:1로 매핑되며, JPA 어노테이션을 사용해 연관 관계(@ManyToOne, @OneToMany 등)를 설정하고 데이터베이스에서 가져온 데이터를 관리합니다.
    //DTO : 서비스 계층과 컨트롤러 사이에서 데이터를 간결하게 전송하기 위한 객체로, 필요에 따라 연관 객체 대신 ID와 같은 단순 필드만 포함하여 전송 효율을 높입니다.
}