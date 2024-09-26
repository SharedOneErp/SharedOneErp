package com.project.erpre.repository;

import com.project.erpre.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

   List<OrderDetail> findByOrderOrderNo(Integer orderNo);

   @Query("SELECT SUM(o.orderDQty) FROM OrderDetail o")
   Long sumOrderDQty(); // 모든 orderDQty의 합계를 반환하는 메서드

}
