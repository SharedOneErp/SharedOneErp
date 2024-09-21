package com.project.erpre.service;

import com.project.erpre.repository.CustomerRepository;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.OrderRepository;
import com.project.erpre.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderReportService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private CustomerRepository customerRepository;
}
