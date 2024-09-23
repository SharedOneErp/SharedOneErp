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
    @Query("SELECT COUNT(o) FROM Order o WHERE " +
            "(o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)")
    Long countTotalOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 각 달별 주문 건수 집계
    @Query("SELECT " +
        "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
        "COUNT(o) " +
        "FROM Order o " +
        "WHERE o.orderHStatus = 'approved' " +
        "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
        "GROUP BY CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +
        "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN YEAR(o.orderHUpdateDate) ELSE YEAR(o.orderHInsertDate) END")
    List<Object[]> countOrdersByMonth(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);



    @Query("SELECT " +
            "CASE " +
            "  WHEN MONTH(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END) BETWEEN 4 AND 9 THEN 'April-September' " +
            "  ELSE 'October-March' " +
            "END AS halfYear, " +
            "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
            "COUNT(o) " +
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' " +
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY halfYear, YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByHalfYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);






    // 연도별 주문 건수 집계
    @Query("SELECT " +
        "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
        "COUNT(o) " +
        "FROM Order o " +
        "WHERE o.orderHStatus = 'approved' " +
        "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
        "GROUP BY YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByYear(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);



    // // 고객별 주문건수 집계 (approved 상태만)
    // @Query("SELECT o.customer.customerName, COUNT(o) FROM Order o WHERE " +
    //        "(o.orderHStatus = 'approved') AND " +
    //        "((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
    //        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
    //        "GROUP BY o.customer.customerName")
    // List<Object[]> countOrdersByCustomer(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // // 담당자별 주문건수 집계 (approved 상태만)
    // @Query("SELECT o.employee.employeeId, COUNT(o) FROM Order o WHERE " +
    //        "(o.orderHStatus = 'approved') AND " +
    //        "((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
    //        "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
    //        "GROUP BY o.employee.employeeId")
    // List<Object[]> countOrdersByEmployee(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // // 상품별 주문건수 집계 (approved 상태만)
    // @Query("SELECT p.productNm, COUNT(od) FROM OrderDetail od JOIN od.product p WHERE " +
    //        "(od.order.orderHStatus = 'approved') AND " +
    //        "((od.order.orderHUpdateDate IS NOT NULL AND od.order.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
    //        "OR (od.order.orderHUpdateDate IS NULL AND od.order.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
    //        "GROUP BY p.productNm")
    // List<Object[]> countOrdersByProduct(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
