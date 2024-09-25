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

    // 🟡 담당자별 주문 금액 및 주문 건수 조회 메서드
    @GetMapping("/ordersByEmployee")
    public List<Object[]> getOrdersByEmployee(@RequestParam String startDate,
                                              @RequestParam String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(23, 59, 59);

        // OrderReportService에서 담당자별 주문 금액 및 주문 건수를 가져오는 메서드 호출
        return orderReportService.getOrdersByEmployee("monthly", startDateTime, endDateTime);  // 기본으로 월별 조회
    }

    // 🟡 최근 3개월 동안 각 월별로 주문 건수가 가장 많은 상위 3명의 담당자에 대한 주문 건수와 총 금액을 조회
    @GetMapping("/top3-employees-last3months")
    public List<Object[]> getTop3EmployeesLast3Months() {
        return orderReportService.getTop3EmployeesLast3Months();
    }


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

}
