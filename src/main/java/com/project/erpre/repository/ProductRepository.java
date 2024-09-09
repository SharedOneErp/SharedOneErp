package com.project.erpre.repository;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    // 전체 상품 목록 조회
    List<Product> findAll();

    // category_no가 null인 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(
            String productCd, String productNm);

    // category_no가 null이 아닌 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(
            String productCd, Category category, String productNm);
}
