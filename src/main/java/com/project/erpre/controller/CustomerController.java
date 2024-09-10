package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
//@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private CustomerService customerService;

    // 전체 목록 조회
    @GetMapping("/getList")
    public List<Customer> getList(){
        logger.info("getList 호출");
        return customerService.getList();
    }

    // 고객 정보 삽입
    @PostMapping("/insert")
    public Customer insertCustomer(@RequestBody Customer customer) {
        logger.info("insertCustomer 호출");
        return customerService.saveOrUpdate(customer);
    }

    // 고객 정보 수정
    @PutMapping("/update")
    public Customer updateCustomer(@RequestBody Customer customer) {
        logger.info("updateCustomer 호출");
        return customerService.saveOrUpdate(customer);
    }

    // 고객 정보 삭제
    @DeleteMapping("/delete/{customerNo}")
    public void deleteCustomer(@PathVariable Integer customerNo) {
        logger.info("deleteCustomer 호출");
        customerService.deleteCustomer(customerNo);
    }

    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam("name") String name) {
        return customerService.searchCustomers(name);
    }

}
