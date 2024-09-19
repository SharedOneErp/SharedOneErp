package com.project.erpre.repository;

import com.project.erpre.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    //고객 이름 검색
    List<Customer> findByCustomerNameContainingIgnoreCase(String customerName);
    //전체 고객사, 삭제된 고객사 목록 조회
    List<Customer> findByCustomerDeleteYn(String deleteYn);

}
