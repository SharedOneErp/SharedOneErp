package com.project.erpre.repository;

import com.project.erpre.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderReportRepository extends JpaRepository<Order, Integer> {

    // 🔴 각 달별 주문 금액 집계
    // 월별 주문 금액을 집계하는 쿼리입니다. orderHUpdateDate가 있을 경우 해당 월을 기준으로, 없을 경우 orderHInsertDate를 기준으로 집계합니다.
    // approved 상태의 주문만 포함하며, 지정된 기간(startDate와 endDate) 내에 있는 주문을 집계합니다.
    @Query("SELECT " +
            "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
            "COUNT(o), " +  // 주문 건수 추가
            "SUM(o.orderHTotalPrice) " +  // 총 금액 집계
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +  // 삭제되지 않은 주문만 필터링
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
            "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN YEAR(o.orderHUpdateDate) ELSE YEAR(o.orderHInsertDate) END")
    List<Object[]> countOrdersByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 🔴 반기별 주문 금액 집계
    // 반기별로 주문 금액을 집계하는 쿼리입니다. 해당 기간(startDate와 endDate) 내에서 월을 기준으로 두 반기(FirstHalf, SecondHalf)로 나누어 집계합니다.
    // 반기 구분은 startMonth1과 endMonth1 파라미터를 사용하여 첫 반기를 정의합니다.
    @Query("SELECT " +
            "CASE " +
            "  WHEN MONTH(COALESCE(o.orderHUpdateDate, o.orderHInsertDate)) BETWEEN 1 AND 6 THEN 'FirstHalf' " +
            "  ELSE 'SecondHalf' " +
            "END AS halfYear, " +
            "YEAR(COALESCE(o.orderHUpdateDate, o.orderHInsertDate)), " +
            "COUNT(o), " +
            "SUM(o.orderHTotalPrice) " +
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +
            "AND COALESCE(o.orderHUpdateDate, o.orderHInsertDate) BETWEEN :startDate AND :endDate " +
            "GROUP BY halfYear, YEAR(COALESCE(o.orderHUpdateDate, o.orderHInsertDate)) " +
            "ORDER BY YEAR(COALESCE(o.orderHUpdateDate, o.orderHInsertDate)), halfYear")
    List<Object[]> countOrdersByHalfYear(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 🔴 연도별 주문 금액 집계
    // 연도별 주문 금액을 집계하는 쿼리입니다. orderHUpdateDate가 있을 경우 해당 연도를 기준으로, 없을 경우 orderHInsertDate를 기준으로 집계합니다.
    // 지정된 기간(startDate와 endDate) 내에 있는 approved 상태의 주문만을 집계합니다.
    @Query("SELECT " +
            "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
            "COUNT(o), " +  // 주문 건수 추가
            "SUM(o.orderHTotalPrice) " +  // 총 금액 집계
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +  // 삭제되지 않은 주문만 필터링
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 상품별 주문 금액, 건수 집계
    @Query("SELECT p.productNm, COUNT(o), SUM(od.orderDTotalPrice) " +
            "FROM OrderDetail od " +
            "JOIN od.product p " +
            "JOIN od.order o " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY p.productNm " +  // 공백 추가
            "ORDER BY SUM(od.orderDTotalPrice) DESC")
    List<Object[]> countOrdersByProduct(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    // 고객사별 주문 금액 집계
    @Query("SELECT c.customerName, COUNT(o), SUM(o.orderHTotalPrice) " +
            "FROM Order o " +
            "JOIN o.customer c " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY c.customerName " +  // 공백 추가
            "ORDER BY SUM(o.orderHTotalPrice) DESC")
    List<Object[]> countOrdersByCustomer(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

    // 담당자(직원)별 주문 금액 집계
    @Query("SELECT e.employeeName, COUNT(o), SUM(o.orderHTotalPrice) " +
            "FROM Order o " +
            "JOIN o.employee e " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY e.employeeName " +  // 공백 추가
            "ORDER BY SUM(o.orderHTotalPrice) DESC")
    List<Object[]> countOrdersByEmployee(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);

}
