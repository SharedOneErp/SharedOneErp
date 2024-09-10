package com.project.erpre.repository;

import com.project.erpre.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> findByCustomerNameContainingIgnoreCase(String customerName);
}