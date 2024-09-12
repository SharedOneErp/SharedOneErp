package com.project.erpre.service;

import com.project.erpre.model.Employee;
import com.project.erpre.model.EmployeeDTO;
import com.project.erpre.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // EmployeeDTO -> Employee 엔티티로 변환하는 메서드
    private Employee convertToEntity(EmployeeDTO employeeDTO) {
        Employee employee = new Employee();
        employee.setEmployeeId(employeeDTO.getEmployeeId());
        employee.setEmployeePw(employeeDTO.getEmployeePw());
        employee.setEmployeeName(employeeDTO.getEmployeeName());
        employee.setEmployeeEmail(employeeDTO.getEmployeeEmail());
        employee.setEmployeeTel(employeeDTO.getEmployeeTel());
        employee.setEmployeeRole(employeeDTO.getEmployeeRole());
        employee.setEmployeeInsertDate(employeeDTO.getEmployeeInsertDate());
        employee.setEmployeeUpdateDate(employeeDTO.getEmployeeUpdateDate());
        employee.setEmployeeDeleteYn(employeeDTO.getEmployeeDeleteYn());
        employee.setEmployeeDeleteDate(employeeDTO.getEmployeeDeleteDate());
        return employee;
    }

    // Employee 엔티티 -> EmployeeDTO로 변환하는 메서드
    private EmployeeDTO convertToDTO(Employee employee) {
        return EmployeeDTO.builder()
                .employeeId(employee.getEmployeeId())
                .employeePw(employee.getEmployeePw())
                .employeeName(employee.getEmployeeName())
                .employeeEmail(employee.getEmployeeEmail())
                .employeeTel(employee.getEmployeeTel())
                .employeeRole(employee.getEmployeeRole())
                .employeeInsertDate(employee.getEmployeeInsertDate())
                .employeeUpdateDate(employee.getEmployeeUpdateDate())
                .employeeDeleteYn(employee.getEmployeeDeleteYn())
                .employeeDeleteDate(employee.getEmployeeDeleteDate())
                .build();
    }

    // 전체 직원 목록을 조회하는 메소드
//    public List<Employee> getAllEmployees() {
//        return employeeRepository.findAll();
//    }

    public Page<Employee> getPageEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return employeeRepository.findAll(pageable);
    }
//    public Page<Employee> getPageEmployees(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return employeeRepository.findAll(pageable);
//    }

    public void deleteEmployees(List<String> id) {
        employeeRepository.deleteAllById(id);  // JPA에서 제공하는 delete 메서드
    }
}