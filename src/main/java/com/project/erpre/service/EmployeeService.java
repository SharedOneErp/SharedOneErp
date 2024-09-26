package com.project.erpre.service;

import com.project.erpre.model.Employee;
import com.project.erpre.model.EmployeeDTO;
import com.project.erpre.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    //재직자만
    public Page<Employee> getPageEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page -1 , size);
        return employeeRepository.findByEmployeeDeleteYn("N", pageable);
    }

    //퇴직자까지
    public Page<Employee> getAllPageEmployees(int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return employeeRepository.findAll(pageable); // 필터 없이 전체 조회
    }

    //퇴직자조회
    public Page<Employee> getPageEmployeesY(int page, int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return employeeRepository.findByEmployeeDeleteYn("Y", pageable);
    }

//    public Page<Employee> getPageEmployees(int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return employeeRepository.findAll(pageable);
//    }

    //delete_yn만 바꾸기(논리적삭제)
    public void deleteLogicalEmployees(List<String> ids) {
        for (String id : ids) {
            Employee employee = employeeRepository.findById(id).orElse(null);
            if (employee != null) {
                employee.setEmployeeDeleteYn("Y");
                employee.setEmployeeDeleteDate(new Timestamp(System.currentTimeMillis()));
                employeeRepository.save(employee);  // update로 N -> Y로 바꿈
            }
        }
    }

    //신규직원 등록
    public void registerEmployee(EmployeeDTO employeeDTO) {
        Employee employee = Employee.builder()
                .employeeId(employeeDTO.getEmployeeId())
                .employeePw(employeeDTO.getEmployeePw())
                .employeeName(employeeDTO.getEmployeeName())
                .employeeEmail(employeeDTO.getEmployeeEmail())
                .employeeTel(employeeDTO.getEmployeeTel())
                .employeeRole(employeeDTO.getEmployeeRole())
                .employeeDeleteYn("N")  // 기본값 설정
                .employeeInsertDate(new Timestamp(System.currentTimeMillis()))
                .build();

        employeeRepository.save(employee);
    }

    //수정모달에서 직원정보 수정
    public void updateEmployee(String employeeId, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee != null) {
            employee.setEmployeePw(employeeDTO.getEmployeePw());
            employee.setEmployeeName(employeeDTO.getEmployeeName());
            employee.setEmployeeEmail(employeeDTO.getEmployeeEmail());
            employee.setEmployeeTel(employeeDTO.getEmployeeTel());
            employee.setEmployeeRole(employeeDTO.getEmployeeRole());
            employee.setEmployeeUpdateDate(new Timestamp(System.currentTimeMillis()));  // 수정일자 업데이트
            employeeRepository.save(employee);  // 수정된 정보 저장
        }
    }

    //수정모달에서 직원삭제
    public void deleteLogicalEmployee(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee != null) {
            employee.setEmployeeDeleteYn("Y");
            employee.setEmployeeDeleteDate(new Timestamp(System.currentTimeMillis()));  // 삭제일자 업데이트
            employeeRepository.save(employee);  // 논리적 삭제 저장
        }
    }

    // 중복 ID체크
    public boolean existsByEmployeeId(String employeeId) {
        return employeeRepository.existsById(employeeId);
    }


    // 전체 직원 수 가져오기
    public long getTotalEmployeeCount() {
        return employeeRepository.count();
    }

    // 최근 한달간 채용된 직원 수 가져오기
    public long getRecentHiresCount(int days) {
        return employeeRepository.countRecentHires(days);
    }

    // 최근 한달간 은퇴한 직원수 가져오기
    public long countDeletedEmployeesLast30Days() {
        return employeeRepository.countDeletedEmployeesLast30Days();
    }

}