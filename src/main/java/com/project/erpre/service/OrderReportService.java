package com.project.erpre.service;

import com.project.erpre.repository.OrderReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
            return orderReportRepository.countOrdersByHalfYear(startDate, endDate);
        } 

        // 연도별 처리
        if (periodType.equals("yearly")) {
            return orderReportRepository.countOrdersByYear(startDate, endDate);
        }

        // 달별 처리 (기본)
        return orderReportRepository.countOrdersByMonth(startDate, endDate);
    }

    public List<Object[]> getOrdersByFilter(String filterType, LocalDateTime startDate, LocalDateTime endDate) {
        Pageable top10 = PageRequest.of(0, 10);
        switch (filterType) {
            case "productOrders":
                return orderReportRepository.countOrdersByProduct(startDate, endDate, top10);
            case "customerOrders":
                return orderReportRepository.countOrdersByCustomer(startDate, endDate, top10);
            case "employeeOrders":
                return orderReportRepository.countOrdersByEmployee(startDate, endDate, top10);
            default:
                throw new IllegalArgumentException("Invalid filter type");
        }
    }   



}
