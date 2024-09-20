package com.project.erpre.controller;

import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.service.CategoryService;
import com.project.erpre.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    // 1. 전체 상품 목록 조회 + 페이징 + 카테고리 조회 API
    @GetMapping("/productList")
    public ResponseEntity<Map<String, Object>> getAllProductsAndCategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all",required = false) String status
    ) {
        try {
            Map<String, Object> result = productService.getAllProductsAndCategories(page - 1, size, status);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 2. 상품 상세정보 조회 API (최근 납품내역 5건 포함)
    @GetMapping("/productDetail/{productCd}")
    public ResponseEntity<List<ProductDTO>> getProductDetailsByProductCd(@PathVariable String productCd) {
        try {
            List<ProductDTO> productDetails = productService.getProductDetailsByProductCd(productCd);
            if (productDetails.isEmpty()) {
                // 데이터가 없으면 404 Not Found 응답 반환
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            // 정상적으로 데이터를 찾으면 200 OK 응답 반환
            return ResponseEntity.ok(productDetails);
        } catch (Exception e) {
            // 예외가 발생하면 500 Internal Server Error 응답 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 3. 상품 등록 API
    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.saveOrUpdate(productDTO);
        return ResponseEntity.ok(savedProduct);
    }

    // 4. 상품 수정 API
    @PutMapping("/update")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.saveOrUpdate(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. 선택한 상품 삭제 API
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProducts(@RequestBody List<String> productCds) {
        try {
            productService.deleteProducts(productCds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 6. 선택한 상품 복원 API
    @PutMapping("/restore")
    public ResponseEntity<Void> restoreProducts(@RequestBody List<String> productCds) {
        try {
            productService.restoreProducts(productCds);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

