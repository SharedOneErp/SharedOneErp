package com.project.erpre.service;

import com.project.erpre.repository.OrderReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderReportService {

    @Autowired
    private OrderReportRepository orderReportRepository;

    // 달별 주문 건수 집계
    public List<Object[]> getOrdersByMonth(LocalDateTime startDate, LocalDateTime endDate) {
        return orderReportRepository.countOrdersByMonth(startDate, endDate);
    }

    // 반기별 주문 건수 집계
    public List<Object[]> getOrdersByHalfYear(LocalDateTime startDate, LocalDateTime endDate) {
        // 현재 날짜를 기준으로 시작/끝 달 계산
        int currentMonth = LocalDateTime.now().getMonthValue();

        int startMonth1 = currentMonth - 5;  // 첫 반기의 시작 달
        int endMonth1 = currentMonth;        // 첫 반기의 끝 달

        return orderReportRepository.countOrdersByHalfYear(
                startMonth1,
                endMonth1,
                startDate,
                endDate
        );
    }


    // 연도별 주문 건수 집계
    public List<Object[]> getOrdersByYear(LocalDateTime startDate, LocalDateTime endDate) {
        return orderReportRepository.countOrdersByYear(startDate, endDate);
    }
            
    // 총 주문건수
    public Long getTotalOrders(LocalDateTime startDate, LocalDateTime endDate) {
        return orderReportRepository.countTotalOrders(startDate, endDate);
    }

//    // 고객별 주문건수
//    public List<Object[]> getOrdersByCustomer(LocalDateTime startDate, LocalDateTime endDate) {
//        return orderReportRepository.countOrdersByCustomer(startDate, endDate);
//    }
//
//    // 담당자별 주문건수
//    public List<Object[]> getOrdersByEmployee(LocalDateTime startDate, LocalDateTime endDate) {
//        return orderReportRepository.countOrdersByEmployee(startDate, endDate);
//    }
//
//    // 상품별 주문건수
//    public List<Object[]> getOrdersByProduct(LocalDateTime startDate, LocalDateTime endDate) {
//        return orderReportRepository.countOrdersByProduct(startDate, endDate);
//    }
}
