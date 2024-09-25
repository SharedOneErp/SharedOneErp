package com.project.erpre.controller;

import com.project.erpre.service.OrderReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/orderReport")
public class OrderReportController {

    @Autowired
    private OrderReportService orderReportService;

    // 🔴 총 주문금액 조회 메서드
    // 이 메서드는 클라이언트로부터 시작 날짜(startDate), 종료 날짜(endDate), 기간 타입(periodType)을 파라미터로 받아
    // 해당 기간 동안의 주문 금액을 집계하여 반환합니다.
    @GetMapping("/orders")
    public List<Object[]> getOrders(@RequestParam String startDate,
                                    @RequestParam String endDate,
                                    @RequestParam String periodType) {
        // 날짜 형식을 yyyy-MM-dd로 맞추기 위한 포매터
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 입력받은 문자열을 LocalDate 객체로 변환
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        // LocalDate 객체를 LocalDateTime 객체로 변환하여 시작과 끝 시간을 지정
        LocalDateTime startDateTime = start.atStartOfDay(); // 시작 날짜는 00:00:00
        LocalDateTime endDateTime = end.atTime(23, 59, 59); // 종료 날짜는 23:59:59

        // orderReportService의 통합 메서드를 호출하여 기간에 따른 주문 금액 집계 결과 반환
        return orderReportService.getOrders(periodType, startDateTime, endDateTime);
    }

    @GetMapping("/ordersByFilter")
    public List<Object[]> getOrdersByFilter(@RequestParam String filterType,
                                            @RequestParam String startDate,
                                            @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime startDateTime = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime endDateTime = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);

        return orderReportService.getOrdersByFilter(filterType, startDateTime, endDateTime);
    }

}
