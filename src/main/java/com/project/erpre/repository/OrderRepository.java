package com.project.erpre.repository;

import com.project.erpre.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
//crud 메서드 생성 가능

    // 주문 상태 별 주문 목록 조회
    List<Order> findByOrderHStatus (String orderHStatus);

    //고객사 이름별 주문 등록 조회
    List <Order> findByCustomerCustomerNameContaining (String name);

    //날짜로 주문 목록 조회
    List<Order> findByOrderHInsertDateContaining(String orderHInsertDate);




}