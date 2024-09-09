package com.project.erpre.service;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchProducts(String productCd, Category category, String productNm) {
        if (category == null) {
            return productRepository.findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCase(productCd, productNm);
        } else {
            return productRepository.findByProductCdContainingIgnoreCaseAndCategoryAndProductNmContainingIgnoreCase(productCd, category, productNm);
        }
    }
}
