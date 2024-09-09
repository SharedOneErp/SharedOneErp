package com.project.erpre.service;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Employee;
import com.project.erpre.model.Order;
import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Order createOrder(Order order) {
        // 주문 저장
        return orderRepository.save(order);
    }
}
