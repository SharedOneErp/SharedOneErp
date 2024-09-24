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

    // 총 주문건수(기간동안의 총 주문건수를 집계하는 거, 일단은 안씀)
//    @GetMapping("/totalOrders")
//    public Long getTotalOrders(@RequestParam String startDate, @RequestParam String endDate) {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd"); //요청이 String으로 오니까 변환해줘야함
//
//        // LocalDate로 변환 후, LocalDateTime으로 시작/끝 시간 추가
//        LocalDate start = LocalDate.parse(startDate, formatter);
//        LocalDate end = LocalDate.parse(endDate, formatter);
//
//        LocalDateTime startDateTime = start.atStartOfDay(); // 00:00:00 추가(localdatetime)
//        LocalDateTime endDateTime = end.atTime(23, 59, 59);  // 23:59:59 추가
//
//        return orderReportService.getTotalOrders(startDateTime, endDateTime);
//    }

    // 달별 주문건수
    @GetMapping("/monthlyOrders")
    public List<Object[]> getMonthlyOrders(@RequestParam String startDate, @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        return orderReportService.getOrdersByMonth(startDateTime, endDateTime);
    }

    // 반기별 주문건수
    @GetMapping("/halfYearlyOrders")
    public List<Object[]> getHalfYearlyOrders(@RequestParam String startDate, @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        return orderReportService.getOrdersByHalfYear(startDateTime, endDateTime);
    }


    // 연도별 주문건수
    @GetMapping("/yearlyOrders")
    public List<Object[]> getYearlyOrders(@RequestParam String startDate, @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        return orderReportService.getOrdersByYear(startDateTime, endDateTime);
    }    


}
