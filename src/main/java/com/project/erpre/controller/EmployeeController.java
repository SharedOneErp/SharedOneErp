package com.project.erpre.controller;

import com.project.erpre.model.Employee;
import com.project.erpre.model.EmployeeDTO;
import com.project.erpre.repository.EmployeeRepository;
import com.project.erpre.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    // 로그인 엔드포인트
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

    // 로그아웃 엔드포인트
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return ResponseEntity.ok().build(); // 성공적으로 로그아웃
    }

    // 현재 로그인한 직원 정보 조회
    @GetMapping("/employee")
    public ResponseEntity<Employee> getEmployee(HttpSession session) {
        Employee employee = (Employee) session.getAttribute("employee");
        if (employee != null) {
            return ResponseEntity.ok(employee);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // 전체 직원 목록 조회
//    @GetMapping("/employeeList")
//    public ResponseEntity<List<Employee>> getAllEmployees() {
//        List<Employee> employeeList = employeeService.getAllEmployees();
//        return ResponseEntity.ok(employeeList);
//    }

    //페이징해서 재직중인 직원 목록 보여주기
    @GetMapping("/employeeList")
    public ResponseEntity<Page<Employee>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Employee> employeePage = employeeService.getPageEmployees(page, size);
        return ResponseEntity.ok(employeePage);
    }

    //페이징해서 퇴직자만
    @GetMapping("/employeeListY")
    public ResponseEntity<Page<Employee>> getAllEmployeesY(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Employee> employeePage = employeeService.getPageEmployeesY(page, size);
        return ResponseEntity.ok(employeePage);
    }

    //직원목록화면에서 체크된 직원 logical 삭제
    @PostMapping("/deleteEmployees")
    public ResponseEntity<?> deleteEmployees(@RequestBody List<String> ids) {
        employeeService.deleteLogicalEmployees(ids);
        return ResponseEntity.ok("Employees deleted successfully");
    }

    //퇴직자까지 보기
    @GetMapping("/allEmployees")
    public ResponseEntity<Page<Employee>> getAllEmployeesWithResigned(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Employee> employeePage = employeeService.getAllPageEmployees(page, size);
        return ResponseEntity.ok(employeePage);
    }

    //모달에서 신규직원 등록
    @PostMapping("/registerEmployee")
    public ResponseEntity<String> registerEmployee(@RequestBody EmployeeDTO employeeDTO) {
        employeeService.registerEmployee(employeeDTO);
        return ResponseEntity.ok("직원이 성공적으로 등록되었습니다.");
    }

    // 직원 정보 수정
    @PutMapping("/updateEmployee/{employeeId}")
    public ResponseEntity<String> updateEmployee(@PathVariable String employeeId, @RequestBody EmployeeDTO employeeDTO) {
        employeeService.updateEmployee(employeeId, employeeDTO);
        return ResponseEntity.ok("직원 정보가 성공적으로 수정되었습니다.");
    }

    // 수정모달에서 직원 삭제
    @PutMapping("/deleteEmployee/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable String employeeId) {
        employeeService.deleteLogicalEmployee(employeeId);
        return ResponseEntity.ok("직원이 논리적으로 삭제되었습니다.");
    }
}