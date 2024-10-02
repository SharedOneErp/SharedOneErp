package com.project.erpre.controller;

import com.project.erpre.model.*;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.service.OrderService;
import com.project.erpre.service.ProductService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/order")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private OrderService orderDTOService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;


    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {

            // Customer와 Employee를 ID로 조회
            if (orderDTO.getCustomer() != null && orderDTO.getCustomer().getCustomerNo() != null) {
                Customer customer = customerRepository.findById(orderDTO.getCustomer().getCustomerNo())
                        .orElseThrow(() -> new RuntimeException("고객이 존재하지 않습니다."));
                orderDTO.setCustomer(customer);
            }


            if (orderDTO.getEmployee() != null && orderDTO.getEmployee().getEmployeeId() != null) {
                Employee employee = employeeRepository.findById(orderDTO.getEmployee().getEmployeeId())
                        .orElseThrow(() -> new RuntimeException("직원이 존재하지 않습니다."));
                orderDTO.setEmployee(employee);
            }

            // Null 값 체크 후 저장
            if (orderDTO.getCustomer() == null || orderDTO.getEmployee() == null) {
                throw new RuntimeException("주문을 생성하기 위해 고객과 직원 정보를 모두 제공해야 합니다.");
            }

            // 서비스에서 처리 후 저장
            Order savedOrder = orderDTOService.createOrder(orderDTO);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

//    / 검색 API/
//    @GetMapping("/search")
//    public List<Product> searchProducts(
//            @RequestParam(required = false) String productCd,
//            @RequestParam(required = false) Category category,
//            @RequestParam(required = false) String productNm
//    ) {
//        return productService.searchProducts(productCd, category, productNm);
//    }


    // 검색 API
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String productCd,
            @RequestParam(required = false) String productNm,
            @RequestParam(required = false) Integer topCategory,
            @RequestParam(required = false) Integer middleCategory,
            @RequestParam(required = false) Integer lowCategory) {
        return productService.searchProducts(productCd, productNm, topCategory, middleCategory, lowCategory);
    }


    @GetMapping
    public ResponseEntity<?> searchOrder(@RequestParam Integer no) {
        try {
            OrderDTO orderDTO = orderDTOService.getOrderHeaderById(no);
            if (orderDTO == null) {
                return new ResponseEntity<>("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(orderDTO, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("주문 조회 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{orderNo}")
    public ResponseEntity<?> updateOrder(@PathVariable Integer orderNo, @RequestBody OrderDTO orderDTO) {
        try {
            // 주문 업데이트 서비스 호출
            Order updatedOrder = orderService.updateOrder(orderNo, orderDTO);

            if (orderDTO.getDeletedDetailIds() != null && !orderDTO.getDeletedDetailIds().isEmpty()) {
                for (Integer detailId : orderDTO.getDeletedDetailIds()) {
                    orderService.deleteOrderDetail(orderNo, detailId);
                }
            }

            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("주문 수정 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전체 주문 목록 조회
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // 특정 주문 상태로 필터링된 주문 목록 조회
    @GetMapping("/status")
    public List<Order> getOrdersByStatus(@RequestParam String status) {
        return orderService.getOrdersByStatus(status);
    }

    // 고객사 이름으로 주문 검색
    @GetMapping("/customer")
    public List<Order> getOrdersByCustomerName(@RequestParam String customerName) {
        return orderService.getOrdersByCustomerName(customerName);
    }

    // 주문 날짜로 검색
    @GetMapping("/date")
    public List<Order> getOrdersByOrderDate(@RequestParam String orderDate) {
        return orderService.getOrdersByOrderDate(orderDate);
    }

    // 주문 상태 업데이트 엔드포인트
    @PatchMapping("/updateStatus/{orderNo}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderNo, @RequestBody OrderDTO orderDTO) {
        try {
            // 주문 엔티티를 조회합니다.
            Order existingOrder = orderService.getOrderById(orderNo);
            if (existingOrder == null) {
                return new ResponseEntity<>("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            // 상태를 DTO에서 가져와서 업데이트합니다.
            existingOrder.setOrderHStatus(orderDTO.getOrderHStatus());
            existingOrder.setOrderHUpdateDate(LocalDateTime.now());

            // 엔티티를 업데이트하고 저장합니다.
            Order updatedOrder = orderService.updateOrder(existingOrder);
            return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("주문 상태 업데이트 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // 주문 상세 항목 추가
    @PostMapping("/{orderNo}/details")
    public ResponseEntity<?> addOrderDetail(@PathVariable Integer orderNo, @RequestBody OrderDetailDTO orderDetailDTO) {
        try {
            // 주문이 존재하는지 확인
            Order existingOrder = orderService.getOrderById(orderNo);
            if (existingOrder == null) {
                return new ResponseEntity<>("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            // 주문 상세 항목 추가
            OrderDetail addedDetail = orderService.addOrderDetail(orderNo, orderDetailDTO);
            return new ResponseEntity<>(addedDetail, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("주문 상세 항목 추가 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 주문 상세 항목 삭제
    @DeleteMapping("/{orderNo}/details/{detailId}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable Integer orderNo, @PathVariable Integer detailId) {
        try {
            // 주문이 존재하는지 확인
            Order existingOrder = orderService.getOrderById(orderNo);
            if (existingOrder == null) {
                return new ResponseEntity<>("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            // 주문 상세 항목 삭제
            orderService.deleteOrderDetail(orderNo, detailId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 성공적으로 삭제되었음을 나타냄
        } catch (Exception e) {
            logger.error("주문 상세 항목 삭제 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/count")
    public long getOrderCount() {
        return orderService.getTotalOrderCount();
    }

    // 상태별 주문 수 조회
    @GetMapping("/status/count")
    public ResponseEntity<?> getOrderCountByStatus() {
        try {
            // 결재중(ing), 결재완료(approved), 반려(denied) 상태별 주문 수 계산
            long ingCount = orderService.countOrdersByStatus("ing");
            long approvedCount = orderService.countOrdersByStatus("approved");
            long deniedCount = orderService.countOrdersByStatus("denied");

            // 결과를 객체로 반환
            return new ResponseEntity<>(new OrderStatusCount(ingCount, approvedCount, deniedCount), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 정산 정보 조회 API
    @GetMapping("/settlement")
    public ResponseEntity<?> getSettlementInfo() {
        try {
            BigDecimal approvedTotal = orderService.getApprovedTotalAmount();
            BigDecimal ingTotal = orderService.getIngTotalAmount();
            String settlementDeadline = orderService.getSettlementDeadline();

            SettlementResponse response = new SettlementResponse(approvedTotal, ingTotal, settlementDeadline);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("정산 정보 조회 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/annual")
    public BigDecimal getTotalSalesLastYear() {
        return orderService.getTotalSalesLastYear();
    }

    // 오늘부터 30일 동안의 매출 계산
    @GetMapping("/lastMonth")
    public BigDecimal getTotalSalesLast30Days() {
        return orderService.getTotalSalesLast30Days();
    }


    // 정산 총액 정보를 담을 DTO 클래스
    @Data
    @AllArgsConstructor
    static class SettlementTotalsResponse {
        private BigDecimal approvedTotal;
        private BigDecimal deniedTotal;
    }

    // 정산 정보를 담을 DTO 클래스
    @Data
    @AllArgsConstructor
    static class SettlementResponse {
        private BigDecimal approvedTotal;
        private BigDecimal deniedTotal;
        private String settlementDeadline;
    }

    // 상태별 주문 수를 담을 DTO 클래스
    @Data
    @AllArgsConstructor
    static class OrderStatusCount {
        private long ingCount;
        private long approvedCount;
        private long deniedCount;
    }
}


