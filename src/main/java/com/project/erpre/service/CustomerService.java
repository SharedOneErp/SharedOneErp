package com.project.erpre.service;

import com.project.erpre.model.Customer;
import com.project.erpre.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> searchCustomers(String name) {
        return customerRepository.findByCustomerNameContainingIgnoreCase(name);
    }
}
