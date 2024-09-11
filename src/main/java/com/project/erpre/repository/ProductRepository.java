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

//    // 선택 상품 수정
//    @Transactional
//    @Modifying
//    @Query("UPDATE Product p " +
//            "SET p.productNm = :productNm, " +
//            "p.category = (" +
//            "SELECT c3 FROM Category c3 " +
//            "JOIN c3.parentCategory c2 " +
//            "JOIN c2.parentCategory c1 " +
//            "WHERE c1.categoryNm = :topCategory " +
//            "AND c2.categoryNm = :middleCategory " +
//            "AND c3.categoryNm = :lowCategory) " +
//            "WHERE p.productCd = :productCd")
//    void updateProductWithCategories(@Param("productCd") String productCd,
//                                     @Param("productNm") String productNm,
//                                     @Param("topCategory") String topCategory,
//                                     @Param("middleCategory") String middleCategory,
//                                     @Param("lowCategory") String lowCategory);

    // 선택 상품 수정 (서비스 레이어에서 처리)
    @Transactional
    @Modifying
    @Query("UPDATE Product p SET p.productNm = :productNm, p.category = :category WHERE p.productCd = :productCd")
    void updateProductWithCategories(@Param("productCd") String productCd,
                                     @Param("productNm") String productNm,
                                     @Param("category") Category category);


    // 선택한상품 삭제
    void deleteByProductCdIn(List<String> productCds);



    // category_no가 null인 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(
            String productCd, String productNm);

    // category_no가 null이 아닌 경우를 처리하는 메서드
    List<Product> findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(
            String productCd, Category category, String productNm);

}
