package com.project.erpre.repository;

import com.project.erpre.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    //고객 이름 검색
    List<Customer> findByCustomerNameContainingIgnoreCase(String customerName);
    //전체 고객사, 삭제된 고객사 목록 조회
    List<Customer> findByCustomerDeleteYn(String deleteYn);

    // 메인 - 총 고객사 수
    Long countByCustomerDeleteYn(String deleteYn);
    // 메인 - 최근 신규 고객 (등록일시가 오늘부터 3일 전까지)
    List<Customer> findByCustomerInsertDateAfterAndCustomerDeleteYn(Timestamp date, String deleteYn);
    // 메인 - 계약 갱신 예정 (transactionEndDate가 오늘 기준 3일 남은 것)
    List<Customer> findByCustomerTransactionEndDateBetweenAndCustomerDeleteYn(Timestamp startDate, Timestamp endDate, String deleteYn);

    //유효성검사
    boolean existsByCustomerName(String customerName);
    boolean existsByCustomerBusinessRegNo(String customerBusinessRegNo);
}
