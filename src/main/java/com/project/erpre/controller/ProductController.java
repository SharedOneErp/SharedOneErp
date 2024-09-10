package com.project.erpre.controller;

import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.service.ProductService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class ProductController {

    @Autowired
    private ProductService productService;

    // 전체 상품 목록 조회 API
    @GetMapping("/productList")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    // 상품 상세 조회 API
    @GetMapping("/productDetail/{productCd}")
    public List<ProductDTO> getProductDetailsByProductCd(@PathVariable String productCd) {
        return productService.getProductDetailsByProductCd(productCd);
    }

    // 선택한 상품 삭제 API
    @DeleteMapping("/productDelete")
    public List<Product> deleteProducts(@RequestBody List<String> productCds) {
        return productService.deleteProducts(productCds);
    }

    // 검색 API
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String productCd,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String productNm
    ) {
        return productService.searchProducts(productCd, category, productNm);
    }
}
