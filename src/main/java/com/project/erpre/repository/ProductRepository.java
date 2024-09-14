package com.project.erpre.repository;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    // 전체 상품 목록 조회 + 페이지네이션
    @Query("SELECT new com.project.erpre.model.ProductDTO(" +
            "p.productCd, p.productNm, p.productInsertDate, p.productUpdateDate, " +
            "c3.categoryNo, c1.categoryNm, c2.categoryNm, c3.categoryNm) " +
            "FROM Product p " +
            "JOIN p.category c3 " +
            "JOIN c3.parentCategory c2 " +
            "JOIN c2.parentCategory c1 " +
            "ORDER BY p.productCd ASC")
    Page<ProductDTO> getAllProducts(Pageable pageable);

    // 상품 상세 조회 (최근 납품일 최대 5건 조회)
    @Query("SELECT new com.project.erpre.model.ProductDTO( " +
            "p.productCd, p.productNm, p.productInsertDate, p.productUpdateDate, " +
            "e.employeeName, c.customerName, od.orderDDeliveryRequestDate, od.orderDQty, od.orderDTotalPrice, " +
            "c1.categoryNm, c2.categoryNm, c3.categoryNm) " +
            "FROM Product p " +
            "JOIN p.category c3 " +
            "JOIN c3.parentCategory c2 " +
            "JOIN c2.parentCategory c1 " +
            "JOIN OrderDetail od ON p.productCd = od.product.productCd " +
            "JOIN od.order o " +
            "JOIN o.employee e " +
            "JOIN o.customer c " +
            "WHERE p.productCd IN :productCd " +
            "ORDER BY od.orderDDeliveryRequestDate DESC ")
    Page<ProductDTO> getProductDetailsByProductCd(@Param("productCd") String productCd, Pageable pageable);

    // 선택한상품 삭제
    void deleteByProductCdIn(List<String> productCds);

    // category_no가 null인 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(
            String productCd, String productNm);

    // category_no가 null이 아닌 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(
            String productCd, Category category, String productNm);


    @Query("SELECT p FROM Product p WHERE p.productCd LIKE %:productCd% AND p.productNm LIKE %:productNm% AND (" +
            "(p.category.categoryNo = :lowCategory) OR " +
            "(p.category.parentCategoryNo = :middleCategory AND p.category.categoryNo IS NULL) OR " +
            "(p.category.parentCategoryNo IS NULL AND :topCategory IS NOT NULL AND :middleCategory IS NULL AND :lowCategory IS NULL))")
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCaseAndCategory(@Param("productCd") String productCd, @Param("productNm") String productNm, @Param("topCategory") Integer topCategory, @Param("middleCategory") Integer middleCategory, @Param("lowCategory") Integer lowCategory);

}


