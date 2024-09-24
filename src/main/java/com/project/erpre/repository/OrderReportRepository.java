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
            "  WHEN MONTH(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END) BETWEEN :startMonth1 AND :endMonth1 THEN 'FirstHalf' " +
            "  ELSE 'SecondHalf' " +
            "END AS halfYear, " +
            "YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END), " +
            "COUNT(o), " +  // 주문 건수 추가
            "SUM(o.orderHTotalPrice) " +  // 총 금액 집계
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' AND o.orderHDeleteYn = 'N' " +  // 삭제되지 않은 주문만 필터링
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "GROUP BY halfYear, YEAR(CASE WHEN o.orderHUpdateDate IS NOT NULL THEN o.orderHUpdateDate ELSE o.orderHInsertDate END)")
    List<Object[]> countOrdersByHalfYear(
            @Param("startMonth1") int startMonth1,
            @Param("endMonth1") int endMonth1,
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

    // 🟡 담당자별 월별 주문 금액 및 주문 건수 집계
    @Query("SELECT " +
            "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +  // 월별 구분
            "o.employee.employeeName, " +  // 담당자 이름
            "COUNT(o), " +  // 주문 건수
            "SUM(o.orderHTotalPrice) " +  // 총 금액 집계
            "FROM Order o " +
            "WHERE o.orderHStatus = 'approved' " +  // 승인된 주문만 포함
            "AND ((o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)) " +
            "AND o.orderHDeleteYn = 'N' " +  // 삭제되지 않은 주문만 포함
            "GROUP BY " +
            "CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +  // 월별 그룹화
            "o.employee.employeeName " +  // 담당자별로 그룹화
            "ORDER BY CASE WHEN o.orderHUpdateDate IS NOT NULL THEN MONTH(o.orderHUpdateDate) ELSE MONTH(o.orderHInsertDate) END, " +  // 월별 정렬
            "o.employee.employeeName")
    List<Object[]> countOrdersByMonthAndEmployee(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 🟡 최근 3개월 동안 각 월별로 주문 건수가 가장 많은 상위 3명의 담당자에 대한 주문 건수와 총 금액을 집계
    @Query(
            value = "SELECT t.orderMonth, t.employeeName, t.orderCount, t.totalAmount " +
                    "FROM (" +
                    "   SELECT " +
                    "       CASE WHEN o.order_h_update_date IS NOT NULL THEN MONTH(o.order_h_update_date) ELSE MONTH(o.order_h_insert_date) END AS orderMonth, " +
                    "       e.employee_name AS employeeName, " +
                    "       COUNT(o.order_h_no) AS orderCount, " +
                    "       SUM(o.order_h_total_price) AS totalAmount, " +
                    "       ROW_NUMBER() OVER (PARTITION BY " +
                    "           CASE WHEN o.order_h_update_date IS NOT NULL THEN MONTH(o.order_h_update_date) ELSE MONTH(o.order_h_insert_date) END " +
                    "           ORDER BY COUNT(o.order_h_no) DESC) AS rn " +
                    "   FROM m_order_h o " +
                    "   JOIN employees e ON o.employee_id = e.id " +
                    "   WHERE o.order_h_status = 'approved' " +
                    "     AND o.order_h_delete_yn = 'N' " +
                    "     AND (" +
                    "         (o.order_h_update_date IS NOT NULL AND o.order_h_update_date BETWEEN :startDate AND :endDate) " +
                    "         OR " +
                    "         (o.order_h_update_date IS NULL AND o.order_h_insert_date BETWEEN :startDate AND :endDate)" +
                    "     ) " +
                    "   GROUP BY " +
                    "       CASE WHEN o.ekaeorder_h_update_date IS NOT NULL THEN MONTH(o.order_h_update_date) ELSE MONTH(o.order_h_insert_date) END, " +
                    "       e.employee_name " +
                    ") t " +
                    "WHERE t.rn <= 3 " +
                    "ORDER BY t.orderMonth, t.orderCount DESC",
            nativeQuery = true
    )
    List<Object[]> countTop3OrdersByMonthAndEmployee(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // 총 주문건수 집계
//    @Query("SELECT COUNT(o) FROM Order o WHERE " +
//            "(o.orderHUpdateDate IS NOT NULL AND o.orderHUpdateDate BETWEEN :startDate AND :endDate) " +
//            "OR (o.orderHUpdateDate IS NULL AND o.orderHInsertDate BETWEEN :startDate AND :endDate)")
//    Long countTotalOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
