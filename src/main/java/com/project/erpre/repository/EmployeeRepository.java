package com.project.erpre.repository;

import com.project.erpre.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findById(String employeeId);
    Optional<Employee> findByEmployeeIdAndEmployeePw(String employeeId, String employeePw);

        /*
    JpaRepository는 기본적으로 다음과 같은 CRUD 메서드를 제공합니다.
    ---------------------------------------
    save(S entity) : 삽입 또는 수정
    findById(ID id) : 특정 ID로 엔티티 조회
    findAll() : 모든 엔티티 조회                 ------>>>> 전체조회는 이걸씀 but 페이징을 한다면?
    deleteById(ID id) : 특정 ID로 엔티티 삭제
    delete(S entity) : 특정 엔티티 삭제
    ---------------------------------------
     */

//    Page<Employee> findAll(Pageable pageable); // 2. employee의 모든 데이터를 findall해서 페이징처리하여 반환함,, 반환타입은 페이징된 employee객체라고 생각하면 될듯?
}
