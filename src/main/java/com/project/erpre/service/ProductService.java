package com.project.erpre.service;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 전체 상품 목록 조회
    public List<Object[]> getAllProducts() {

        return productRepository.getAllProducts();
    }

    // 선택한 상품 삭제
    @Transactional
    public List<Product> deleteProducts(List<String> productCds) {
        if (productCds == null || productCds.isEmpty()) {
            throw new IllegalArgumentException("상품 코드 목록이 비어 있습니다.");
        }
        productRepository.deleteByProductCdIn(productCds);
        return productRepository.findAll();
    }

    public List<Product> searchProducts(String productCd, Category category, String productNm) {
        if (category == null) {
            return productRepository.findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(productCd, productNm);
        } else {
            return productRepository.findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(productCd, category, productNm);
        }
    }
}
