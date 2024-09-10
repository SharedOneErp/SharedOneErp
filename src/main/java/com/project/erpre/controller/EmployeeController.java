package com.project.erpre.controller;

import com.project.erpre.model.Employee;
import com.project.erpre.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpSession session) {
        String employeeId = loginRequest.get("employeeId");
        String employeePw = loginRequest.get("employeePw");
        Employee employee = employeeRepository.findByEmployeeIdAndEmployeePw(employeeId, employeePw).orElse(null);

        if (employee != null) {
            session.setAttribute("employee", employee);

            // 로그인 성공 시 사용자 정보와 함께 응답
            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("employee", employee); // 사용자 정보 포함

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return ResponseEntity.ok().build(); // 성공적으로 로그아웃
    }

    @GetMapping("/employee")
    public ResponseEntity<Employee> getEmployee(HttpSession session) {
        Employee employee = (Employee) session.getAttribute("employee");
        if (employee != null) {
            return ResponseEntity.ok(employee);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}



