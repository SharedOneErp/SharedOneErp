package com.project.erpre.controller;

import com.project.erpre.model.OrderDetail;
import com.project.erpre.model.Product;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderDetailController {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping(value = "/api/orderDetails")
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        try {
            System.out.println("Received OrderDetail: " + orderDetail);

            Product product = productRepository.findById(orderDetail.getProduct().getProductCd())
                    .orElseThrow(() -> new RuntimeException("해당 제품이 존재하지 않습니다."));
            orderDetail.setProduct(product);

            OrderDetail savedOrderDetail = orderDetailRepository.save(orderDetail);
            return new ResponseEntity<>(savedOrderDetail, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
