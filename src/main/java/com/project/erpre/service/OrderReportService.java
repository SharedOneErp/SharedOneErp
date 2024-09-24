package com.project.erpre.service;

import com.project.erpre.repository.OrderReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderReportService {

    @Autowired
    private OrderReportRepository orderReportRepository;

    // 🔴 주문 금액 집계 (달별, 반기별, 연도별 통합)
    // 기간 타입에 따라 반기별이면 startMonth, endMonth를 계산해 사용, 그 외에는 기본 값(0)을 사용하여 집계합니다.
    public List<Object[]> getOrders(String periodType, LocalDateTime startDate, LocalDateTime endDate) {

        // 반기별 처리
        if (periodType.equals("halfyearly")) {
            int currentMonth = LocalDateTime.now().getMonthValue();
            int startMonth = currentMonth - 5; // 첫 반기 시작
            int endMonth = currentMonth;       // 첫 반기 끝
            return orderReportRepository.countOrdersByHalfYear(startMonth, endMonth, startDate, endDate);
        }

        // 연도별 처리
        if (periodType.equals("yearly")) {
            return orderReportRepository.countOrdersByYear(startDate, endDate);
        }

        // 달별 처리 (기본)
        return orderReportRepository.countOrdersByMonth(startDate, endDate);
    }

    // 🟡 담당자별 주문 금액 및 주문 건수 집계 (달별)
    public List<Object[]> getOrdersByEmployee(String periodType, LocalDateTime startDate, LocalDateTime endDate) {
        return orderReportRepository.countOrdersByMonthAndEmployee(startDate, endDate);
    }

    // 🟡 최근 3개월 동안 각 월별로 주문 건수가 가장 많은 상위 3명의 담당자에 대한 주문 건수와 총 금액을 조회
    public List<Object[]> getTop3EmployeesLast3Months() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(3).with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0).withNano(0);

        return orderReportRepository.countTop3OrdersByMonthAndEmployee(startDate, endDate);
    }

//    // 총 주 금액
//    public Long getTotalOrders(LocalDateTime startDate, LocalDateTime endDate) {
//        return orderReportRepository.countTotalOrders(startDate, endDate);
//    }

}
