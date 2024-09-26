package com.project.erpre.service;

import com.project.erpre.controller.PriceController;
import com.project.erpre.model.*;
import com.project.erpre.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class); // 로거 선언

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
                .orderHStatus(order.getOrderHStatus())
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
        Order existingOrder = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문 정보를 찾을 수 없습니다."));

        // 고객 및 직원 정보 업데이트 (기존 로직 유지)
        existingOrder.setCustomer(customerRepository.findById(orderDTO.getCustomer().getCustomerNo()).orElse(null));
        existingOrder.setEmployee(employeeRepository.findById(orderDTO.getEmployee().getEmployeeId()).orElse(null));
        existingOrder.setOrderHTotalPrice(orderDTO.getOrderHTotalPrice());
        existingOrder.setOrderHStatus(orderDTO.getOrderHStatus());
        existingOrder.setOrderHUpdateDate(LocalDateTime.now());
        existingOrder.setOrderHDeleteYn(orderDTO.getOrderHDeleteYn());

        // 주문 상세 업데이트 (기존 로직 유지)
        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            OrderDetail existingDetail = orderDetailRepository.findById(detailDTO.getOrderNo())
                    .orElseThrow(() -> new RuntimeException("주문 상세를 찾을 수 없습니다."));
            existingDetail.setOrderDDeliveryRequestDate(detailDTO.getOrderDDeliveryRequestDate());
            orderDetailRepository.save(existingDetail);
        }

        // 삭제할 주문 상세 처리
        if (orderDTO.getDeletedDetailIds() != null) {
            for (Integer detailId : orderDTO.getDeletedDetailIds()) {
                orderDetailRepository.deleteById(detailId);
            }
        }

        return orderRepository.save(existingOrder);
    }


    // 주문 삭제
    public void deleteOrder(Integer orderNo) {
        orderRepository.deleteById(orderNo);
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }
    public OrderDetail addOrderDetail(Integer orderNo, OrderDetailDTO orderDetailDTO) {
        // 주문이 존재하는지 확인
        Order existingOrder = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // DTO를 엔티티로 변환
        OrderDetail orderDetail = new OrderDetailService().convertToEntity(orderDetailDTO);
        orderDetail.setOrder(existingOrder); // 주문 설정
        return orderDetailRepository.save(orderDetail);
    }


    // 주문 상세 삭제
    public void deleteOrderDetail(Integer orderNo, Integer detailId) {
        logger.info("deleteOrderDetail - 주문 번호: {}, 삭제할 상세 번호: {}", orderNo, detailId); // 삭제 요청 로그

        // 주문이 존재하는지 확인
        Order existingOrder = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        logger.info("주문 {} 존재 확인 완료", orderNo); // 주문 확인 완료 로그

        // 상세 항목을 삭제
        orderDetailRepository.deleteById(detailId);

        logger.info("상세 주문 {} 삭제 완료", detailId); // 삭제 완료 로그
    }

    
    //전체 수량 카운트 코드
    public long getTotalOrderCount() {
        return orderRepository.countOrders();
    }

    // 특정 상태에 따른 주문 수 계산
    public long countOrdersByStatus(String status) {
        return orderRepository.countByOrderHStatus(status);
    }

    public BigDecimal getApprovedTotalAmount() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        LocalDateTime thirtyDaysAgoDateTime = thirtyDaysAgo.atStartOfDay(); // LocalDateTime으로 변환
        return orderRepository.sumApprovedOrdersLastMonth(thirtyDaysAgoDateTime);
    }

    public BigDecimal getIngTotalAmount() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        LocalDateTime thirtyDaysAgoDateTime = thirtyDaysAgo.atStartOfDay(); // LocalDateTime으로 변환
        return orderRepository.sumIngOrdersLastMonth(thirtyDaysAgoDateTime);
    }

    public String getSettlementDeadline() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline;

        if (now.getDayOfMonth() > 15) {
            deadline = LocalDateTime.of(now.getYear(), now.getMonth().plus(1), 15, 0, 0);
        } else {
            deadline = LocalDateTime.of(now.getYear(), now.getMonth(), 15, 0, 0);
        }

        return deadline.format(DateTimeFormatter.ofPattern("yyyy년 M월 d일")); // "2024년 9월 15일" 형식
    }


    public BigDecimal getTotalSalesLastYear() {
        LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
        return orderRepository.sumIngOrdersLastYear(oneYearAgo);
    }

    // 오늘부터 30일간의 매출 계산
    public BigDecimal getTotalSalesLast30Days() {
        LocalDateTime today = LocalDateTime.now(); // 현재 날짜와 시간
        LocalDateTime thirtyDaysAgo = today.minusDays(30); // 30일 전 날짜 계산
        return orderRepository.sumTotalSalesForPeriod(thirtyDaysAgo, today);
    }



}