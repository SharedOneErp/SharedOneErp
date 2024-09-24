package com.project.erpre.repository;

import com.project.erpre.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderReportRepository extends JpaRepository<Order, Integer> {

    // 총 주문건수 집계
//    @Query("SELECT COUNT(o) FROM Order o WHERE " +
//            "(o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
//            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)")
//    Long countTotalOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 각 달별 주문 건수 집계
    @Query("SELECT " +
        "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
        "SUM(o.orderHTotalPrice) " +
        "FROM Order o " +
        "WHERE o.orderHStatus = 'approved' " +
        "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
        "GROUP BY CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
        "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN YEAR(o.orderHUpdateDate) ELSE YEAR(o.orderHInsertDate) END")
    List<Object[]> countOrdersByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    //반기별 집계
    @Query("SELECT " +
            "CASE " +
            "  WHEN MONTH(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END) BETWEEN :startMonth1 AND :endMonth1 THEN 'FirstHalf' " +
            "  ELSE 'SecondHalf' " +
            "END AS halfYear, " +
            "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
            "SUM(o.orderHTotalPrice) " +
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' " +
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY halfYear, YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByHalfYear(
            @Param("startMonth1") int startMonth1,
            @Param("endMonth1") int endMonth1,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // 연도별 주문 건수 집계
    @Query("SELECT " +
        "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
        "SUM(o.orderHTotalPrice) " +
        "FROM Order o " +
        "WHERE o.orderHStatus = 'approved' " +
        "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
        "GROUP BY YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);




}
