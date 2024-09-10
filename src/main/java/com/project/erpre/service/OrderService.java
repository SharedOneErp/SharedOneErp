package com.project.erpre.service;

import com.project.erpre.controller.PriceController;
import com.project.erpre.model.*;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Order createOrder(OrderDTO orderDTO) {

        // 고객 번호로 고객 엔티티를 조회
        Customer customer = customerRepository.findById(orderDTO.getCustomer().getCustomerNo())
                .orElseThrow(() -> new RuntimeException("고객 정보를 찾을 수 없습니다."));

        // 직원 정보도 동일하게 처리 (직원 ID를 이용해 조회)
        Employee employee = employeeRepository.findById(orderDTO.getEmployee().getEmployeeId())
                .orElseThrow(() -> new RuntimeException("직원 정보를 찾을 수 없습니다."));

        // DTO -> Entity 변환
        Order order = Order.builder()
                .orderNo(orderDTO.getOrderNo()) // 주문 번호
                .employee(orderDTO.getEmployee()) // 직원 정보
                .customer(orderDTO.getCustomer()) // 고객 정보
                .orderHTotalPrice(orderDTO.getOrderHTotalPrice()) // 총 가격
                .orderDStatus(orderDTO.getOrderDStatus()) // 주문 상태
                .build();

        // 엔터티 저장
        return orderRepository.save(order);
    }
}
