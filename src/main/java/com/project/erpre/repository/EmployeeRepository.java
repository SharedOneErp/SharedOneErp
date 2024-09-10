package com.project.erpre.repository;

import com.project.erpre.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findById(String employeeId);
    Optional<Employee> findByEmployeeIdAndEmployeePw(String employeeId, String employeePw);

}