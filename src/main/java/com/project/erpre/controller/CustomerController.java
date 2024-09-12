package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
//@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private CustomerService customerService;


    // 전체 고객 목록 조회
    @GetMapping("/getList")
    public List<Customer> getList() {
        logger.info("전체 고객 목록 조회");
        return customerService.getList();
    }

    // 고객 정보 등록
    @PostMapping("/register")
    public Customer insertCustomer(@RequestBody Customer customer) {
        logger.info("고객 등록");
        return customerService.insertCustomer(customer);
    }

    // 고객 정보 수정
    @PutMapping("/update/{customerNo}")
    public Customer updateCustomer(@PathVariable Integer customerNo, @RequestBody Customer updatedCustomer) {
        logger.info("고객 정보 수정");
        return customerService.updateCustomer(customerNo, updatedCustomer);
    }

    // 고객 정보 삭제
    @DeleteMapping("/delete/{customerNo}")
    public void deleteCustomer(@PathVariable Integer customerNo) {
        logger.info("고객 정보 삭제");
        customerService.deleteCustomer(customerNo);
    }

    //고객 이름 검색
    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam("name") String name) {
        return customerService.searchCustomers(name);
    }

}
