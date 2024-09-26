package com.project.erpre.controller;

import com.project.erpre.model.Order;
import com.project.erpre.model.OrderDetail;
import com.project.erpre.model.OrderDetailDTO;
import com.project.erpre.model.Product;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.OrderRepository;
import com.project.erpre.repository.ProductRepository;
import com.project.erpre.service.OrderDetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class OrderDetailController {

    private static final Logger logger = LoggerFactory.getLogger(OrderDetailController.class);

    @Autowired
    private OrderDetailService orderDetailService;

    @PostMapping(value = "/api/orderDetails")
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetailDTO orderDetailDTO) {

        try {
            // DTO -> Entity 변환
            OrderDetail orderDetail = orderDetailService.convertToEntity(orderDetailDTO);

            // 엔티티 저장
            OrderDetail savedOrderDetail = orderDetailService.createOrderDetail(orderDetail);

            return new ResponseEntity<>(savedOrderDetail, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/api/orderDetails/batch")
    public ResponseEntity<?> createOrderDetails(@RequestBody List<OrderDetailDTO> orderDetailDTOList) {
        try {
            // DTO 리스트 -> 엔티티 리스트 변환
            List<OrderDetail> orderDetailList = orderDetailDTOList.stream()
                    .map(orderDetailService::convertToEntity)
                    .collect(Collectors.toList());

            // 엔티티 리스트 저장 (배치 저장 가능)
            List<OrderDetail> savedOrderDetails = orderDetailService.createOrderDetails(orderDetailList);

            return new ResponseEntity<>(savedOrderDetails, HttpStatus.CREATED);

        } catch (Exception e) {
            logger.error("배치 주문 상세 저장 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 기존 단일 주문 상세 데이터 처리 엔드포인트 유지 가능

    @PutMapping("/api/orderDetails/{id}")
    public ResponseEntity<?> updateOrderDetail(@PathVariable Integer id, @RequestBody OrderDetailDTO orderDetailDTO) {
        try {
            OrderDetail updatedOrderDetail = orderDetailService.updateOrderDetail(id, orderDetailDTO);
            return new ResponseEntity<>(updatedOrderDetail, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("주문 상세 수정 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/orderDetails/{id}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable Integer id) {
        try {
            boolean isDeleted = orderDetailService.deleteOrderDetail(id);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 삭제 성공
            } else {
                return new ResponseEntity<>("삭제할 항목이 없습니다.", HttpStatus.NOT_FOUND); // 항목 없음
            }
        } catch (Exception e) {
            logger.error("주문 상세 삭제 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/totalSales")
    public ResponseEntity<Long> getTotalSales() {
        Long totalSales = orderDetailService.getTotalOrderQuantity();
        return ResponseEntity.ok(totalSales);
    }

}