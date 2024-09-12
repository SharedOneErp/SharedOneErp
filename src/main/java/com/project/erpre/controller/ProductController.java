package com.project.erpre.controller;

import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class ProductController {

    @Autowired
    private ProductService productService;

    // 상품 등록 API
    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.saveOrUpdate(productDTO);
        return ResponseEntity.ok(savedProduct);
    }

    // 상품 수정 API
    @PutMapping("/update")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
            ProductDTO updatedProduct = productService.saveOrUpdate(productDTO);
            return ResponseEntity.ok(updatedProduct);
    }


    // 전체 상품 목록 조회 API
    @GetMapping("/productList")
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page - 1, size);
            Page<ProductDTO> productPage = productService.getAllProducts(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productPage.getContent());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // 상품 상세 조회 API
    @GetMapping("/productDetail/{productCd}")
    public ResponseEntity<List<ProductDTO>> getProductDetailsByProductCd(@PathVariable String productCd) {
        try {
            List<ProductDTO> productDetails = productService.getProductDetailsByProductCd(productCd);
            if (productDetails.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(productDetails); // JSON 형식으로 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 선택한 상품 삭제 API
    @DeleteMapping("/productDelete")
    public ResponseEntity<List<Product>> deleteProducts(@RequestBody List<String> productCds) {
        try {
            List<Product> deletedProducts = productService.deleteProducts(productCds);
            if (deletedProducts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(deletedProducts); // 삭제된 상품 목록 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
