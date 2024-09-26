package com.project.erpre.controller;

import com.project.erpre.model.CategoryDTO;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.repository.ProductRepositoryImpl;
import com.project.erpre.service.CategoryService;
import com.project.erpre.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    // 1. 상품 목록 조회 + 필터링 + 정렬 + 페이징 API
    @GetMapping("/productList")
    public ResponseEntity<Page<ProductDTO>> getProductsAndCategories(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all", required = false) String status,
            @RequestParam(required = false) Integer topCategoryNo,
            @RequestParam(required = false) Integer middleCategoryNo,
            @RequestParam(required = false) Integer lowCategoryNo,
            @RequestParam(required = false) String productCd,
            @RequestParam(required = false) String productNm,
            @RequestParam(required = false, defaultValue = "productCd") String sortColumn,
            @RequestParam(required = false, defaultValue = "asc") String sortDirection
    ) {
        try {
            Page<ProductDTO> result = productService.getProductsList(page - 1, size, status, topCategoryNo, middleCategoryNo, lowCategoryNo, productCd, productNm, sortColumn, sortDirection);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 🔴 0920 예원 추가 (상품코드, 상품명, 대분류, 중분류, 소분류, 상태별 상품목록 페이징 적용하여 가져오기)
    @GetMapping("/productsFilter")
    public ResponseEntity<Page<ProductDTO>> getProductsFilter(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer topCategoryNo,  // 대분류 필터
            @RequestParam(required = false) Integer middleCategoryNo,  // 중분류 필터
            @RequestParam(required = false) Integer lowCategoryNo,  // 소분류 필터
            @RequestParam(defaultValue = "all", required = false) String status,
            @RequestParam(required = false) String productCd,  // 상품 코드 필터
            @RequestParam(required = false) String productNm,   // 상품명 필터
            @RequestParam(required = false) Integer customerNo   // 주문 등록 시 선택한 고객사
    ) {
        try {

            logger.info("\uD83D\uDD34 customerNo : "+customerNo);
            Page<ProductDTO> result = productService.getProductsFilter(page - 1, size, status, topCategoryNo, middleCategoryNo, lowCategoryNo, productCd, productNm, customerNo);
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
        try {
            ProductDTO savedProduct = productService.addProduct(productDTO);
            return ResponseEntity.ok(savedProduct);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 4. 상품 수정 API
    @PutMapping("/update")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    // 5. 선택한 상품 삭제 API
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteProducts(@RequestBody List<String> productCds) {
        if (productCds == null || productCds.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            productService.deleteProducts(productCds);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();  // 잘못된 요청
        } catch (Exception e) {
            e.printStackTrace();  // 에러 로그 기록
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 6. 선택한 상품 복원 API
    @PutMapping("/restore")
    public ResponseEntity<Void> restoreProducts(@RequestBody List<String> productCds) {
        try {
            productService.restoreProducts(productCds);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 7. 카테고리 조회 API
    @GetMapping("/category")
    public ResponseEntity<List<CategoryDTO>> getCategoryList(
            @RequestParam(required = false) Integer topCategoryNo,
            @RequestParam(required = false) Integer middleCategoryNo,
            @RequestParam(required = false) Integer lowCategoryNo
    ) {
        try {
            List<CategoryDTO> categories = productService.getCategoryList(topCategoryNo, middleCategoryNo, lowCategoryNo);

            if (categories.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/productCounts")
    public ResponseEntity<Map<String, Long>> getProductCounts() {
        try {
            long totalProductCount = productService.getTotalProductCount();
            long recentProductCount = productService.getRecentProductCount();
            Map<String, Long> productCounts = new HashMap<>();
            productCounts.put("totalProductCount", totalProductCount);
            productCounts.put("recentProductCount", recentProductCount);
            return ResponseEntity.ok(productCounts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}

