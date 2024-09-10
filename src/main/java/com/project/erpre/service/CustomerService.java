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

    // 전체 고객 목록 조회
    public List<Customer> getList() {
        return customerRepository.findAll();
    }

    // 고객 정보 삽입 또는 수정
    public Customer saveOrUpdate(Customer customer) {
        return customerRepository.save(customer);
    }

    // 고객 정보 삭제
    public void deleteCustomer(Integer customerNo) {
        customerRepository.deleteById(customerNo);
    }

}
