package com.project.erpre.repository;

import com.project.erpre.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
//crud 메서드 생성 가능

    // 주문 상태 별 주문 목록 조회
    List<Order> findByOrderHStatus (String orderHStatus);

    //고객사 이름별 주문 등록 조회
    List <Order> findByCustomerCustomerNameContaining (String name);

    //날짜로 주문 목록 조회
    List<Order> findByOrderHInsertDateContaining(String orderHInsertDate);

    // 리스트에 포함된 모든 주문 조회
    List<Order> findAllByOrderNoIn(List<Integer> orderNos);

    //오더 전체 수량
    @Query("SELECT COUNT(o) FROM Order o")
    long countOrders();

    // 특정 상태에 따른 주문 수를 계산하는 메서드
    long countByOrderHStatus(String orderHStatus);

    @Query("SELECT SUM(o.orderHTotalPrice) FROM Order o WHERE o.orderHStatus = 'approved' AND o.orderHInsertDate >= :thirtyDaysAgo")
    BigDecimal sumApprovedOrdersLastMonth(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    @Query("SELECT SUM(o.orderHTotalPrice) FROM Order o WHERE o.orderHStatus = 'ing' AND o.orderHInsertDate >= :thirtyDaysAgo")
    BigDecimal sumIngOrdersLastMonth(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);

    @Query("SELECT SUM(o.orderHTotalPrice) FROM Order o WHERE o.orderHStatus = 'approved' AND o.orderHInsertDate >= :oneYearAgo")
    BigDecimal sumIngOrdersLastYear(@Param("oneYearAgo") LocalDateTime oneYearAgo);

    @Query("SELECT SUM(o.orderHTotalPrice) FROM Order o WHERE o.orderHStatus = 'approved' AND o.orderHInsertDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalSalesForPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}