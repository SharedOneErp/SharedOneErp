package com.project.erpre.repository;

import com.project.erpre.model.Customer;
import com.project.erpre.model.Price;
import com.project.erpre.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Price, Integer> {

    /*
    JpaRepository는 기본적으로 다음과 같은 CRUD 메서드를 제공합니다.
    ---------------------------------------
    save(S entity) : 삽입 또는 수정
    findById(ID id) : 특정 ID로 엔티티 조회
    findAll() : 모든 엔티티 조회
    deleteById(ID id) : 특정 ID로 엔티티 삭제
    delete(S entity) : 특정 엔티티 삭제
    ---------------------------------------
     */
    // 고객과 제품을 기준으로 가격 정보 조회
    List<Price> findByCustomerAndProduct(Customer customer, Product product);
}
