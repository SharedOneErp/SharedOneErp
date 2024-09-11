package com.project.erpre.service;

import com.project.erpre.model.OrderDetail;
import com.project.erpre.model.OrderDetailDTO;
import com.project.erpre.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    // OrderDetailDTO -> OrderDetail 엔티티로 변환하는 메서드
    private OrderDetail convertToEntity(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = OrderDetail.builder()
                .orderNo(orderDetailDTO.getOrderNo())
                .orderDPrice(orderDetailDTO.getOrderDPrice())
                .orderDQty(orderDetailDTO.getOrderDQty())
                .orderDTotalPrice(orderDetailDTO.getOrderDTotalPrice())
                .orderDDeliveryRequestDate(orderDetailDTO.getOrderDDeliveryRequestDate())
                .orderDInsertDate(orderDetailDTO.getOrderDInsertDate())
                .orderDUpdateDate(orderDetailDTO.getOrderDUpdateDate())
                .orderDDeleteYn(orderDetailDTO.getOrderDDeleteYn())
                .orderDDeleteDate(orderDetailDTO.getOrderDDeleteDate())
                .build();

        // Order 엔티티와 Product 엔티티는 별도로 조회해야 합니다.
        // 예시:
        // orderDetail.setOrder(orderRepository.findById(orderDetailDTO.getOrderHNo()).orElseThrow());
        // orderDetail.setProduct(productRepository.findById(orderDetailDTO.getProductCd()).orElseThrow());

        return orderDetail;
    }

    // OrderDetail 엔티티 -> OrderDetailDTO로 변환하는 메서드
    private OrderDetailDTO convertToDTO(OrderDetail orderDetail) {
        return OrderDetailDTO.builder()
                .orderNo(orderDetail.getOrderNo())
                .orderHNo(orderDetail.getOrder().getOrderNo())
                .productCd(orderDetail.getProduct().getProductCd())
                .orderDPrice(orderDetail.getOrderDPrice())
                .orderDQty(orderDetail.getOrderDQty())
                .orderDTotalPrice(orderDetail.getOrderDTotalPrice())
                .orderDDeliveryRequestDate(orderDetail.getOrderDDeliveryRequestDate())
                .orderDInsertDate(orderDetail.getOrderDInsertDate())
                .orderDUpdateDate(orderDetail.getOrderDUpdateDate())
                .orderDDeleteYn(orderDetail.getOrderDDeleteYn())
                .orderDDeleteDate(orderDetail.getOrderDDeleteDate())
                .build();
    }

    // 주문 상세 생성
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    // 주문 상세 조회 (ID로)
    public Optional<OrderDetail> getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id);
    }

    // 모든 주문 상세 조회
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    // 주문 상세 수정
    public OrderDetail updateOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    // 주문 상세 삭제
    public void deleteOrderDetail(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
