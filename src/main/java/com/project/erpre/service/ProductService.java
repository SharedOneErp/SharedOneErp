package com.project.erpre.service;
import com.project.erpre.model.Category;
import com.project.erpre.model.CategoryDTO;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.repository.CategoryRepository;
import com.project.erpre.repository.ProductRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    // 1. 상품 목록 조회 + 필터링 + 정렬 + 페이징
    public Page<ProductDTO> getProductsList(int page, int size, String status,
                                            Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo,
                                            String productCd, String productNm, String sortColumn, String sortDirection) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.productsList(pageable, status, topCategoryNo, middleCategoryNo, lowCategoryNo, productCd, productNm, sortColumn, sortDirection);
    }

    // 0920 예원 추가 (상품코드, 상품명, 대분류, 중분류, 소분류, 상태별 상품목록 페이징 적용하여 가져오기)
    public Page<ProductDTO> getProductsFilter(int page, int size, String status,
                                              Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo,
                                              String productCd, String productNm, Integer customerNo) {
        Pageable pageable = PageRequest.of(page, size);  // 페이지네이션 정보 생성
        return productRepository.findProductsFilter(pageable, status, topCategoryNo, middleCategoryNo, lowCategoryNo, productCd, productNm, customerNo);
    }

    // 2. 상품 상세 조회 (최근 납품내역 5건 포함)
    public List<ProductDTO> getProductDetailsByProductCd(String productCd) {
        return productRepository.findProductDetailsByProductCd(productCd);
    }

    // 3. 상품 등록
    public ProductDTO addProduct(ProductDTO productDTO) {

        // 상품 코드 중복 확인
        boolean productCdExists = productRepository.existsByProductCd(productDTO.getProductCd());

        if (productCdExists) {
            throw new IllegalArgumentException("이미 존재하는 상품 코드입니다.");
        }

        // 새로운 상품 생성
        Product product = new Product();

        // 상품 정보 설정
        product.setProductCd(productDTO.getProductCd());
        product.setProductNm(productDTO.getProductNm());
        product.setProductPrice(productDTO.getProductPrice());

        // 상품 등록일시 - 현재 시간으로 설정
        product.setProductInsertDate(LocalDateTime.now());

        // 소분류 CategoryNo 저장
        if (productDTO.getCategoryNo() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
            product.setCategory(category);
        }

        // 상품 저장
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    // 4. 상품 수정
    public ProductDTO updateProduct(ProductDTO productDTO) {

        // 기존 상품 가져오기
        Product product = productRepository.findById(productDTO.getProductCd())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        // 상품 정보 업데이트
        product.setProductNm(productDTO.getProductNm());
        product.setProductPrice(productDTO.getProductPrice());

        // 수정일시 업데이트
        product.setProductUpdateDate(LocalDateTime.now());

        // 소분류 CategoryNo 저장
        if (productDTO.getCategoryNo() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
            product.setCategory(category);
        }

        // 상품 저장
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    // 5. 선택한 상품 삭제
    @Transactional
    public void deleteProducts(List<String> productCds) {
        List<Product> products = productRepository.findByProductCdIn(productCds);

        if (products.isEmpty()) {
            throw new IllegalArgumentException("삭제할 상품이 존재하지 않습니다.");
        }

        for (Product product : products) {
            product.setProductDeleteYn("Y");
            product.setProductDeleteDate(Timestamp.valueOf(LocalDateTime.now()));
        }

        productRepository.saveAll(products);
    }

    // 6. 선택한 상품 복원
    @Transactional
    public void restoreProducts(List<String> productCd) {
        List<Product> products = productRepository.findByProductCdIn(productCd);

        if (products.isEmpty()) {
            throw new RuntimeException("복원할 상품이 없습니다.");
        }

        for (Product product : products) {
            product.setProductDeleteYn("N");
            product.setProductDeleteDate(null);

        }
            productRepository.saveAll(products);

    }

    // 7. 카테고리 조회
    public List<CategoryDTO> getCategoryList(Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo) {
        return categoryRepository.getCategoryList(topCategoryNo, middleCategoryNo, lowCategoryNo);
    }



    // 대분류 조회
    public List<Category> getTopCategory() {
        return categoryRepository.findTopCategory();
    }

    public List<Product> searchProducts(String productCd, String productNm, Integer topCategory, Integer middleCategory, Integer lowCategory) {
        // 포괄적인 쿼리 메서드를 사용하여 모든 검색 조건을 처리합니다.
        return productRepository.findByProductCdContainingIgnoreCaseAndProductNmContainingIgnoreCaseAndCategory(
                productCd != null ? productCd : "", // 상품 코드가 null일 경우 빈 문자열로 대체
                productNm != null ? productNm : "", // 상품명이 null일 경우 빈 문자열로 대체
                topCategory,
                middleCategory,
                lowCategory
        );
    }

    // 주로 쓰기 작업(저장, 수정, 삭제 작업)이나 비즈니스 로직 처리에 사용
    // DTO -> 엔티티 변환 메서드
    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setProductCd(productDTO.getProductCd());
        product.setProductNm(productDTO.getProductNm());
        product.setProductInsertDate(productDTO.getProductInsertDate());
        product.setProductUpdateDate(productDTO.getProductUpdateDate());
        product.setProductDeleteYn(productDTO.getProductDeleteYn());
        product.setProductDeleteDate(productDTO.getProductDeleteDate());

        // Category 조회 및 설정
        Integer categoryNo = productDTO.getCategoryNo();
        if (categoryNo != null) {
            Category category = categoryRepository.findById(categoryNo)
                    .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
            product.setCategory(category);
        }

        return product;
    }

    // 엔티티 -> DTO 변환 메서드
    public static ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .productCd(product.getProductCd())
                .productNm(product.getProductNm())
                .categoryNo(product.getCategory().getCategoryNo())
                .productInsertDate(product.getProductInsertDate())
                .productUpdateDate(product.getProductUpdateDate())
                .productDeleteYn(product.getProductDeleteYn())
                .productDeleteDate(product.getProductDeleteDate())
                .productPrice(product.getProductPrice())
                .build();
    }

    public long getTotalProductCount() {
        return productRepository.countAllProducts();
    }

    public long getRecentProductCount() {
        return productRepository.countRecentProducts();
    }



}



