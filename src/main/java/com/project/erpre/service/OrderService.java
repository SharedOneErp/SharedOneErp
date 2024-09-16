package com.project.erpre.service;

import com.project.erpre.controller.PriceController;
import com.project.erpre.model.*;
import com.project.erpre.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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
    @Autowired
    private ProductRepository productRepository;

    // 전체 주문 목록 가져오기
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 주문 상태별 주문 목록 가져오기
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByOrderHStatus(status);
    }

    // 고객사 이름으로 검색
    public List<Order> getOrdersByCustomerName(String customerName) {
        return orderRepository.findByCustomerCustomerNameContaining(customerName);
    }

    // 날짜로 주문 목록 검색
    public List<Order> getOrdersByOrderDate(String orderDate) {
        return orderRepository.findByOrderHInsertDateContaining(orderDate);
    }

    // 특정 주문번호로 주문 조회
    public Order getOrderById(Integer orderNo) {
        return orderRepository.findById(orderNo).orElse(null);
    }


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
                .orderHDeleteYn("N") // 기본값 설정
                .build();

        if (order.getOrderHDeleteYn() == null) {
            order.setOrderHDeleteYn("N"); // 기본값 설정
        }


        // 엔터티 저장
        return orderRepository.save(order);
    }

    public OrderDTO getOrderHeaderById(Integer orderNo) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderOrderNo(orderNo);
        List<Product> products = orderDetails.stream()
                .map(detail -> productRepository.findById(detail.getProduct().getProductCd()).orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        OrderDTO orderDTO = OrderDTO.builder()
                .orderNo(order.getOrderNo())
                .employee(order.getEmployee())
                .customer(order.getCustomer())
                .orderHTotalPrice(order.getOrderHTotalPrice())
                .orderHInsertDate(order.getOrderHInsertDate())
                .orderHUpdateDate(order.getOrderHUpdateDate())
                .orderHDeleteYn(order.getOrderHDeleteYn())
                .build();

        orderDTO.setOrderDetails(orderDetails.stream()
                .map(orderDetail -> OrderDetailDTO.builder()
                        .orderNo(orderDetail.getOrderNo())
                        .orderHNo(orderDetail.getOrder().getOrderNo())
                        .productCd(orderDetail.getProduct().getProductCd())
                        .orderDPrice(orderDetail.getOrderDPrice())
                        .orderDQty(orderDetail.getOrderDQty())
                        .orderDTotalPrice(orderDetail.getOrderDTotalPrice())
                        .orderDDeliveryRequestDate(orderDetail.getOrderDDeliveryRequestDate())
                        .build())
                .collect(Collectors.toList()));

        orderDTO.setProducts(products);

        return orderDTO;
    }
    public Order updateOrder(Integer orderNo, OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // 주문 정보 업데이트
        order.setOrderHTotalPrice(orderDTO.getOrderHTotalPrice());
        order.setOrderHStatus(orderDTO.getOrderHStatus());
        order.setOrderHUpdateDate(LocalDateTime.now());

        return orderRepository.save(order);
    }

    // 주문 삭제
    public void deleteOrder(Integer orderNo) {
        orderRepository.deleteById(orderNo);
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

}