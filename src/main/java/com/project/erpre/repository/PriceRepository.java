package com.project.erpre.repository;

import com.project.erpre.model.Price;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
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

    // 🔴 특정 고객과 특정 제품의 가격 정보 조회
    List<Price> findByCustomer_CustomerNoAndProduct_ProductCd(Integer customerNo, String productCd);

    // 🔴 겹치는 가격 정보 조회
    @Query("SELECT p FROM Price p WHERE "
            + "p.customer.customerNo = :customerNo AND "
            + "p.product.productCd = :productCd AND "
            + "p.priceDeleteYn = 'N' AND " // 삭제되지 않은 데이터만 조회
            + "((:priceEndDate >= p.priceStartDate AND :priceStartDate <= p.priceEndDate) " // 구간이 겹치는 경우
            + "OR (:priceStartDate <= p.priceStartDate AND :priceEndDate >= p.priceEndDate) " // 등록된 구간이 기존 구간을 완전히 포함하는 경우
            + "OR (p.priceStartDate IS NULL OR p.priceEndDate IS NULL))")  // 기존 데이터의 시작일/종료일이 NULL인 경우도 포함
    List<Price> findOverlappingPrices(@Param("customerNo") Integer customerNo,
                                      @Param("productCd") String productCd,
                                      @Param("priceStartDate") Date priceStartDate,
                                      @Param("priceEndDate") Date priceEndDate);


    // 🔴 가격 정보 조회 (필터링, 페이징, 정렬 지원)
    @Query("SELECT p FROM Price p WHERE "
            + "(:customerNo IS NULL OR p.customer.customerNo = :customerNo) AND "
            + "(:productCd IS NULL OR p.product.productCd = :productCd) AND "
            + "(:startDate IS NULL OR p.priceStartDate >= TO_DATE(:startDate, 'YYYY-MM-DD')) AND "
            + "(:endDate IS NULL OR p.priceEndDate <= TO_DATE(:endDate, 'YYYY-MM-DD')) AND "
            + "(:targetDate IS NULL OR (p.priceStartDate <= TO_DATE(:targetDate, 'YYYY-MM-DD') AND p.priceEndDate >= TO_DATE(:targetDate, 'YYYY-MM-DD'))) AND "
            + "(:customerSearchText IS NULL OR LOWER(p.customer.customerName) LIKE LOWER(CONCAT('%', :customerSearchText, '%'))) AND "
            + "(:productSearchText IS NULL OR LOWER(p.product.productNm) LIKE LOWER(CONCAT('%', :productSearchText, '%')) OR p.product.productCd LIKE CONCAT('%', :productSearchText, '%')) AND "
            + "(COALESCE(:selectedStatus, 'all') = 'all' OR "
            + "(COALESCE(:selectedStatus, 'all') = 'deleted' AND p.priceDeleteYn = 'Y') OR "
            + "(COALESCE(:selectedStatus, 'all') = 'active' AND p.priceDeleteYn = 'N'))")
    Page<Price> findPricesWithFilters(@Param("customerNo") Integer customerNo,
                                      @Param("productCd") String productCd,
                                      @Param("startDate") String startDate,
                                      @Param("endDate") String endDate,
                                      @Param("targetDate") String targetDate,
                                      @Param("customerSearchText") String customerSearchText,
                                      @Param("productSearchText") String productSearchText,
                                      @Param("selectedStatus") String selectedStatus,  // 상태 필터
                                      PageRequest pageRequest);

}