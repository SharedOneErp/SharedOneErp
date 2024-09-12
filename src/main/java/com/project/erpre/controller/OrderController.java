package com.project.erpre.controller;

import com.project.erpre.model.*;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.service.OrderService;
import com.project.erpre.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // 검색 API
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String productCd,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String productNm
    ) {
        return productService.searchProducts(productCd, category, productNm);
    }

    //주문상세조회
    @GetMapping
    public ResponseEntity<?> searchOrder(@RequestParam Integer no) {
        try {
            // orderNo로 주문을 조회
            OrderDTO orderDTO = orderService.getOrderHeaderById(no);
            if (orderDTO == null) {
                return new ResponseEntity<>("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(orderDTO, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("주문 조회 중 오류 발생: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}