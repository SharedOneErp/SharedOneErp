package com.project.erpre.repository;

import com.project.erpre.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

   List<OrderDetail> findByOrderOrderNo(Integer orderNo);

}
