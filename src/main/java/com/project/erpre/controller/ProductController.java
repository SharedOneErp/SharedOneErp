package com.project.erpre.controller;

import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // 선택한 상품 수정 API
    @PutMapping("/update")
    public ResponseEntity<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
        try {
            // 상품 업데이트 로직 처리
            productService.updateProductWithCategories(
                    productDTO.getProductCd(),
                    productDTO.getProductNm(),
                    productDTO.getTopCategory(),
                    productDTO.getMiddleCategory(),
                    productDTO.getLowCategory()
            );

            // 업데이트된 상품 정보를 다시 가져와서 반환
            ProductDTO updatedProduct = productService.getProductDetailsByProductCd(productDTO.getProductCd()).get(0); // 단일 상품 반환으로 가정
            return ResponseEntity.ok(updatedProduct); // JSON 형식으로 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 선택한 상품 삭제 API
    @DeleteMapping("/productDelete")
    public List<Product> deleteProducts(@RequestBody List<String> productCds) {
        return productService.deleteProducts(productCds);
    }


}
