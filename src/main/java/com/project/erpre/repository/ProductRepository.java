package com.project.erpre.repository;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
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
    @Query("SELECT new com.project.erpre.model.ProductDTO(" +
            "p.productCd, p.productNm, p.productInsertDate, p.productUpdateDate, " +
            "c3.categoryNo, c1.categoryNm, c2.categoryNm, c3.categoryNm) " +
            "FROM Product p " +
            "JOIN p.category c3 " +
            "JOIN c3.parentCategory c2 " +
            "JOIN c2.parentCategory c1 " +
            "ORDER BY p.productCd ASC")
    List<ProductDTO> getAllProducts();

    // 선택한 상품 삭제
    void deleteByProductCdIn(List<String> productCds);

    // category_no가 null인 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(
            String productCd, String productNm);

    // category_no가 null이 아닌 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(
            String productCd, Category category, String productNm);
}
