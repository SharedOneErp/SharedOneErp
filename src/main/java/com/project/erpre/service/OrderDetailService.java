package com.project.erpre.service;

import com.project.erpre.model.Order;
import com.project.erpre.model.OrderDetail;
import com.project.erpre.model.OrderDetailDTO;
import com.project.erpre.model.Product;
import com.project.erpre.repository.OrderDetailRepository;
import com.project.erpre.repository.OrderRepository;
import com.project.erpre.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    // OrderDetailDTO -> OrderDetail 엔티티로 변환하는 메서드
    public OrderDetail convertToEntity(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = OrderDetail.builder()
                .orderNo(orderDetailDTO.getOrderNo())
                .orderDPrice(orderDetailDTO.getOrderDPrice())
                .orderDQty(orderDetailDTO.getOrderDQty())
                .orderDTotalPrice(orderDetailDTO.getOrderDTotalPrice())
                .orderDDeliveryRequestDate(orderDetailDTO.getOrderDDeliveryRequestDate())
                .orderDInsertDate(orderDetailDTO.getOrderDInsertDate())
                .orderDUpdateDate(orderDetailDTO.getOrderDUpdateDate())
                .orderDDeleteYn(Optional.ofNullable(orderDetailDTO.getOrderDDeleteYn()).orElse("N")) // 기본값 'N' 설정
                .orderDDeleteDate(orderDetailDTO.getOrderDDeleteDate())
                .build();

        // Order 엔티티와 Product 엔티티를 조회하여 설정
        orderDetail.setOrder(orderRepository.findById(orderDetailDTO.getOrderNo()).orElse(null));
        orderDetail.setProduct(productRepository.findById(orderDetailDTO.getProductCd()).orElse(null));

        return orderDetail;
    }



    // OrderDetail 엔티티 -> OrderDetailDTO로 변환하는 메서드
    public OrderDetailDTO convertToDTO(OrderDetail orderDetail) {
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

    // 여러 OrderDetail 생성 메서드 (추가된 부분)
    public List<OrderDetail> createOrderDetails(List<OrderDetail> orderDetails) {
        return orderDetailRepository.saveAll(orderDetails);  // saveAll로 리스트 저장
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
    public boolean deleteOrderDetail(Integer id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문 상세 정보를 찾을 수 없습니다."));

        // 주문 상세 삭제
        orderDetailRepository.delete(orderDetail);

        // 주문 총 금액 재계산
        Order order = orderDetail.getOrder();
        order.recalculateTotalPrice(); // 재계산 메서드 호출
        orderRepository.save(order); // 업데이트된 주문 저장

        return true; // 삭제 성공
    }



    public OrderDetail updateOrderDetail(Integer id, OrderDetailDTO orderDetailDTO) {
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("주문 상세 정보를 찾을 수 없습니다."));
        // 필요한 필드만 업데이트
        existingOrderDetail.setOrderDPrice(orderDetailDTO.getOrderDPrice());
        existingOrderDetail.setOrderDQty(orderDetailDTO.getOrderDQty());
        existingOrderDetail.setOrderDTotalPrice(orderDetailDTO.getOrderDTotalPrice());
        existingOrderDetail.setOrderDUpdateDate(LocalDateTime.now());
        existingOrderDetail.setOrderDDeliveryRequestDate(orderDetailDTO.getOrderDDeliveryRequestDate());

        // 연관된 Order와 Product 엔티티도 업데이트
        existingOrderDetail.setOrder(orderRepository.findById(orderDetailDTO.getOrderNo()).orElse(null));
        existingOrderDetail.setProduct(productRepository.findById(orderDetailDTO.getProductCd()).orElse(null));

        return orderDetailRepository.save(existingOrderDetail);
    }
    public OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) {
        // 유효성 검사 추가
        if (orderDetailDTO.getProductCd() == null) {
            throw new IllegalArgumentException("제품 코드가 필요합니다.");
        }

        OrderDetail orderDetail = convertToEntity(orderDetailDTO);
        return orderDetailRepository.save(orderDetail);
    }

    public List<OrderDetail> getOrderDetailsByOrderNo(Integer orderNo) {
        // 주문이 존재하는지 확인
        Order existingOrder = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다."));

        // 해당 주문의 상세 정보를 조회
        return orderDetailRepository.findByOrderOrderNo(orderNo);
    }

    public Long getTotalOrderQuantity() {
        return orderDetailRepository.sumOrderDQty(); // 모든 판매량을 합산한 값 반환
    }


}
