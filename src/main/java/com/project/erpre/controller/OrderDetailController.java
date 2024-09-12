package com.project.erpre.controller;

import com.project.erpre.model.Order;
import com.project.erpre.model.OrderDetail;
import com.project.erpre.model.OrderDetailDTO;
import com.project.erpre.model.Product;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.OrderRepository;
import com.project.erpre.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderDetailController {

    private static final Logger logger = LoggerFactory.getLogger(OrderDetailController.class); // Logger 선언

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository; // OrderRepository 추가

    @Autowired
    private ProductRepository productRepository;

    @PostMapping(value = "/api/orderDetails")
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetailDTO orderDetailDTO) {

        try {
            // OrderNo로 Order를 DB에서 조회
            Order order = orderRepository.findById(orderDetailDTO.getOrderNo())
                    .orElseThrow(() -> new RuntimeException("해당 주문이 존재하지 않습니다."));

            // Product를 DB에서 조회
            Product product = productRepository.findById(orderDetailDTO.getProductCd())
                    .orElseThrow(() -> new RuntimeException("해당 제품이 존재하지 않습니다."));

            // DTO -> Entity 변환
            OrderDetail orderDetail = OrderDetail.builder()
                    .orderNo(orderDetailDTO.getOrderNo())
                    .order(order)  // 조회된 Order 설정
                    .product(product)
                    .orderDPrice(orderDetailDTO.getOrderDPrice())
                    .orderDQty(orderDetailDTO.getOrderDQty())
                    .orderDTotalPrice(orderDetailDTO.getOrderDTotalPrice())
                    .orderDDeliveryRequestDate(orderDetailDTO.getOrderDDeliveryRequestDate())
                    .build();

            // 엔티티 저장
            OrderDetail savedOrderDetail = orderDetailRepository.save(orderDetail);

            return new ResponseEntity<>(savedOrderDetail, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}