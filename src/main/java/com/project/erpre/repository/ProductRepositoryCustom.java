package com.project.erpre.repository;

import com.project.erpre.model.ProductDTO;

import java.util.List;

public interface ProductRepositoryCustom {
    // 상품 상세정보 조회 (최근 납품내역 5건 포함)
    List<ProductDTO> findProductDetailsByProductCd(String productCd);

}
