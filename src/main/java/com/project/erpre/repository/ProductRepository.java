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
public interface ProductRepository extends JpaRepository<Product, String>, ProductRepositoryCustom {

    // 선택한 상품 삭제
    void deleteByProductCdIn(List<String> productCds);






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
}


