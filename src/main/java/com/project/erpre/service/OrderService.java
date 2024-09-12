package com.project.erpre.service;

import com.project.erpre.controller.PriceController;
import com.project.erpre.model.*;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

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
                .orderHStatus(orderDTO.getOrderHStatus()) // 주문 상태
                .build();

        // 엔터티 저장
        return orderRepository.save(order);
    }

    public OrderDTO getOrderHeaderById(Integer orderNo) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // Order 정보를 OrderDTO로 변환
        return OrderDTO.builder()
                .orderNo(order.getOrderNo())
                .employee(order.getEmployee())
                .customer(order.getCustomer())
                .orderHTotalPrice(order.getOrderHTotalPrice())
                .orderHInsertDate(order.getOrderHInsertDate())
                .orderHInsertDate(order.getOrderHInsertDate())
                .orderHUpdateDate(order.getOrderHUpdateDate())
                .build();
    }
    // 주문 상세 정보 조회
    public List<OrderDetailDTO> getOrderDetailsByOrderNo(Integer orderNo) {
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderOrderNo(orderNo);

        // OrderDetail 엔티티 리스트를 OrderDetailDTO 리스트로 변환
        return orderDetails.stream()
                .map(orderDetail -> OrderDetailDTO.builder()
                        .orderNo(orderDetail.getOrderNo())
                        .orderHNo(orderDetail.getOrder().getOrderNo())
                        .productCd(orderDetail.getProduct().getProductCd())
                        .orderDPrice(orderDetail.getOrderDPrice())
                        .orderDQty(orderDetail.getOrderDQty())
                        .orderDTotalPrice(orderDetail.getOrderDTotalPrice())
                        .orderDDeliveryRequestDate(orderDetail.getOrderDDeliveryRequestDate())
                        .build())
                .collect(Collectors.toList());
    }

}