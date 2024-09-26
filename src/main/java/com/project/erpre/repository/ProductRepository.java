package com.project.erpre.repository;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, ProductRepositoryCustom, QuerydslPredicateExecutor<Product> {

    // 1. 품번으로 상품을 찾아오는 메서드
    List<Product> findByProductCdIn(List<String> productCds);

    // 2. 상태에 따른 상품 수를 구하는 메서드
    @Query("SELECT COUNT(p) FROM Product p WHERE p.productDeleteYn = :status")
    long countByStatus(@Param("status") String status);

    // 3. 상품 코드의 중복 여부를 확인하는 메서드
    boolean existsByProductCd(String productCd);




    @Query("SELECT p FROM Product p WHERE " +
            "(p.productCd LIKE %:productCd%) AND " +
            "(p.productNm LIKE %:productNm%) AND " +
            "(:topCategory IS NULL OR p.category.parentCategoryNo IS NULL AND :middleCategory IS NULL AND :lowCategory IS NULL OR " +
            "(p.category.parentCategoryNo IS NULL AND :topCategory IS NOT NULL AND :middleCategory IS NULL AND :lowCategory IS NULL) OR " +
            "(p.category.parentCategoryNo = :middleCategory AND p.category.categoryNo IS NULL) OR " +
            "(p.category.parentCategoryNo = :middleCategory AND p.category.categoryNo = :lowCategory))")
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCaseAndCategory(
            @Param("productCd") String productCd,
            @Param("productNm") String productNm,
            @Param("topCategory") Integer topCategory,
            @Param("middleCategory") Integer middleCategory,
            @Param("lowCategory") Integer lowCategory);

    @Query("SELECT COUNT(p) FROM Product p")
    long countAllProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.productInsertDate >= CURRENT_DATE - 3")
    long countRecentProducts();
}


