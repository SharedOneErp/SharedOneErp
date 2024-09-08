package com.project.erpre.controller;

import com.project.erpre.model.Product;
import com.project.erpre.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class ProductController {

    @Autowired
    private ProductService productService;

    // 검색 API
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String productCd,
            @RequestParam(required = false) Integer categoryNo,
            @RequestParam(required = false) String productNm
    ) {
        return productService.searchProducts(productCd, categoryNo, productNm);
    }
}
