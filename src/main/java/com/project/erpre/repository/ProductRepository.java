package com.project.erpre.repository;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    // 전체 상품 목록 조회
    @Query("SELECT p, " +
            "c1.categoryNm AS topCategory, " +
            "c2.categoryNm AS middleCategory, " +
            "c3.categoryNm AS lowCategory " +
            "FROM Product p " +
            "JOIN p.category c3 " +
            "JOIN c3.parentCategory c2 " +
            "JOIN c2.parentCategory c1 " +
            "ORDER BY p.productCd ASC")
    List<Object[]> getAllProducts();

    // 선택한 상품 삭제
    void deleteByProductCdIn(List<String> productCds);

    // category_no가 null인 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(
            String productCd, String productNm);

    // category_no가 null이 아닌 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(
            String productCd, Category category, String productNm);
}
