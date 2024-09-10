package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Employee;
import com.project.erpre.model.Order;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;


    @PostMapping(value = "/api/orders" )
    public ResponseEntity<?> createOrder( Order order) {
        try {
            // Customer와 Employee를 ID로 조회
            if (order.getCustomer() != null && order.getCustomer().getCustomerNo() != null) {
                Customer customer = customerRepository.findById(order.getCustomer().getCustomerNo())
                        .orElseThrow(() -> new RuntimeException("고객이 존재하지 않습니다."));
                order.setCustomer(customer);
            }

            if (order.getEmployee() != null && order.getEmployee().getEmployeeId() != null) {
                Employee employee = employeeRepository.findById(order.getEmployee().getEmployeeId())
                        .orElseThrow(() -> new RuntimeException("직원이 존재하지 않습니다."));
                order.setEmployee(employee);
            }

            // Null 값 체크 후 저장
            if (order.getCustomer() == null || order.getEmployee() == null) {
                throw new RuntimeException("주문을 생성하기 위해 고객과 직원 정보를 모두 제공해야 합니다.");
            }

            // 서비스에서 처리 후 저장
            Order savedOrder = orderService.createOrder(order);
            return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}