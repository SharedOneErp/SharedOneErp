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

    // 특정 제품(Product)의 가격 정보 조회
    List<Price> findByProduct_ProductCd(String productCd);

    // 특정 고객(Customer)의 가격 정보 조회
    List<Price> findByCustomer_CustomerNo(Integer customerNo);

    // 🔴 날짜 범위에 따라 가격 정보를 조회하는 쿼리
    @Query("SELECT p FROM Price p WHERE p.priceStartDate >= :startDate AND p.priceEndDate <= :endDate")
    List<Price> findPricesByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);

    // 🔴 가격 정보 조회 (필터링, 페이징, 정렬 지원)
    @Query("SELECT p FROM Price p WHERE "
            + "(:customerNo IS NULL OR p.customer.customerNo = :customerNo) AND "
            + "(:productCd IS NULL OR p.product.productCd = :productCd) AND "
            + "(:startDate IS NULL OR p.priceStartDate >= TO_DATE(:startDate, 'YYYY-MM-DD')) AND "
            + "(:endDate IS NULL OR p.priceEndDate <= TO_DATE(:endDate, 'YYYY-MM-DD')) AND "
            + "(:targetDate IS NULL OR (p.priceStartDate <= TO_DATE(:targetDate, 'YYYY-MM-DD') AND p.priceEndDate >= TO_DATE(:targetDate, 'YYYY-MM-DD'))) AND "
            + "(:searchText IS NULL OR LOWER(p.customer.customerName) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(p.product.productNm) LIKE LOWER(CONCAT('%', :searchText, '%'))) AND "
            + "(COALESCE(:selectedStatus, 'all') = 'all' OR "
            + "(COALESCE(:selectedStatus, 'all') = 'deleted' AND p.priceDeleteYn = 'Y') OR "
            + "(COALESCE(:selectedStatus, 'all') = 'active' AND p.priceDeleteYn = 'N'))")
    Page<Price> findPricesWithFilters(@Param("customerNo") Integer customerNo,
                                      @Param("productCd") String productCd,
                                      @Param("startDate") String startDate,
                                      @Param("endDate") String endDate,
                                      @Param("targetDate") String targetDate,
                                      @Param("searchText") String searchText,
                                      @Param("selectedStatus") String selectedStatus,  // 상태 필터
                                      PageRequest pageRequest);

}