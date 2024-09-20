package com.project.erpre.repository;

import com.project.erpre.model.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepositoryCustom {

    // 1. 전체 상품 목록 + 페이징 + 상태 조회
    List<ProductDTO> findAllProducts(int page, int size, String status);

    // 0920 예원 추가 (상품코드, 상품명, 대분류, 중분류, 소분류, 상태별 상품목록 페이징 적용하여 가져오기)
    Page<ProductDTO> findProductsFilter(Pageable pageable, String status,
                                        Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo,
                                        String productCd, String productNm);

    // 2. 상품 상세정보 조회 (최근 납품내역 5건 포함)
    List<ProductDTO> findProductDetailsByProductCd(String productCd);

}
