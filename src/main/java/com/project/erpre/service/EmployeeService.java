package com.project.erpre.service;

import com.project.erpre.model.Employee;
import com.project.erpre.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // 전체 직원 목록을 조회하는 메소드
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
