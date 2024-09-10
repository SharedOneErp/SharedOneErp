package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam("name") String name) {
        return customerService.searchCustomers(name);
    }
}
