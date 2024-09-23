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
        return orderReportRepository.countOrdersByHalfYear(startDate, endDate);
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
