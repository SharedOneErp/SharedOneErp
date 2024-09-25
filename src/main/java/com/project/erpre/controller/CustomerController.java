package com.project.erpre.controller;

import com.project.erpre.model.Customer;
import com.project.erpre.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
//@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class CustomerController {

    private static final Logger logger = LoggerFactory.getLogger(CustomerController.class); // Logger 선언

    @Autowired
    private CustomerService customerService;

    // 전체 고객 목록 조회
    @GetMapping("/getList")
    public List<Customer> getList() {
        logger.info("전체 고객 목록 조회");
        return customerService.getList();
    }

    // 전체 고객사, 삭제된 고객사 목록 조회
    @GetMapping("/getListByDeleteYn") //경로 수정 (중복 제거)
    public ResponseEntity<List<Customer>> getCustomers(@RequestParam(required = false) String deleteYn) {
        List<Customer> customers = customerService.getCustomersByDeleteYn(deleteYn);
        return ResponseEntity.ok(customers);
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

    // 고객 삭제
    @DeleteMapping("/delete/{customerNo}")
    public void deleteCustomer(@PathVariable Integer customerNo) {
        logger.info("고객 삭제: customerNo=" + customerNo);
        customerService.deleteCustomer(customerNo);
    }

    //고객 이름 검색
    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam("name") String name) {
        return customerService.searchCustomers(name);
    }

    // 메인 - 총 고객사 수
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCustomer() {
        Long count = customerService.getTotalCustomer();
        return ResponseEntity.ok(count);
    }

    // 메인 - 최근 신규 고객(등록일시가 오늘부터 3일전 까지)
    @GetMapping("/recent")
    public ResponseEntity<List<Customer>> getRecentCustomer() {
        List<Customer> recentCustomer = customerService.getRecentCustomer();
        return ResponseEntity.ok(recentCustomer);
    }

    // 메인 - 계약 갱신 예정(거래종료일시가 오늘 기준 3일 남은 것)
    @GetMapping("/renewals")
    public ResponseEntity<List<Customer>> getRenewalCustomer() {
        List<Customer> renewalCustomer = customerService.getRenewalCustomer();
        return ResponseEntity.ok(renewalCustomer);
    }

    //유효성검사
    @PostMapping("/checkDuplicate")
    public ResponseEntity<Map<String, Boolean>> checkDuplicate(@RequestBody Map<String, String> requestData) {
        String customerName = requestData.get("customerName");
        String customerBusinessRegNo = requestData.get("customerBusinessRegNo");

        boolean isDuplicateName = customerService.isDuplicateCustomerName(customerName);
        boolean isDuplicateBusinessRegNo = customerService.isDuplicateBusinessRegNo(customerBusinessRegNo);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isDuplicateName", isDuplicateName);
        response.put("isDuplicateBusinessRegNo", isDuplicateBusinessRegNo);

        return ResponseEntity.ok(response);
    }
}
