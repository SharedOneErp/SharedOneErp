package com.project.erpre.service;
import com.project.erpre.model.Category;
import com.project.erpre.model.Product;
import com.project.erpre.model.ProductDTO;
import com.project.erpre.repository.CategoryRepository;
import com.project.erpre.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    // 1. 전체 상품 목록 조회 + 페이징 + 카테고리 조회 결합
    public Map<String, Object> getAllProductsAndCategories(int page, int size) {
        // 상품 목록 가져오기
        List<ProductDTO> products = productRepository.findAllProducts(page, size);
        System.out.println("상품 개수:" + products.size());

        long totalItems = productRepository.count();

        // 모든 카테고리 목록 가져오기
        List<Category> topCategories = categoryRepository.findTopCategory();
        List<Category> middleCategories = categoryRepository.findMiddleCategory(null);
        List<Category> lowCategories = categoryRepository.findLowCategoryByTopAndMiddleCategory(null, null);

        Map<String, Object> result = new HashMap<>();
        result.put("products", products);
        result.put("totalItems", totalItems);
        result.put("topCategories", topCategories);
        result.put("middleCategories", middleCategories);
        result.put("lowCategories", lowCategories);

        return result;
    }


    // 2. 상품 상세 조회 (최근 납품내역 5건 포함)
    public List<ProductDTO> getProductDetailsByProductCd(String productCd) {
        return productRepository.findProductDetailsByProductCd(productCd);
    }

    // 3. 상품 등록
    public ProductDTO saveOrUpdate(ProductDTO productDTO) {
        Product product = productRepository.findById(productDTO.getProductCd())
                .orElse(new Product());

        product.setProductCd(productDTO.getProductCd());
        product.setProductNm(productDTO.getProductNm());

        // 상품 등록일 - 항상 현재 시간으로 저장
        if (product.getProductInsertDate() == null) {
            product.setProductInsertDate(LocalDateTime.now());
        }

//        // UpdateDate 설정: 항상 현재 시간으로 업데이트
//        product.setProductUpdateDate(LocalDateTime.now());

        // 소분류의 CategoryNo 저장
        if (productDTO.getCategoryNo() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
            product.setCategory(category);
        }

        // 상품 저장
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
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

    // 대분류 조회
    public List<Category> getTopCategory() {
        return categoryRepository.findTopCategory();
    }

    // 중분류 조회
    public List<Category> getMiddleCategory(Integer topCategoryId) {
        if (topCategoryId == null) {
            return categoryRepository.findMiddleCategory(0); // 전체 중분류 조회
        }
        return categoryRepository.findMiddleCategory(topCategoryId);
    }

    // 소분류 조회
    public List<Category> getLowCategory(Integer topCategoryId, Integer middleCategoryId) {
        if (topCategoryId == null || middleCategoryId == null) {
            return categoryRepository.findAll(); // 전체 소분류 조회
        }
        return categoryRepository.findLowCategoryByTopAndMiddleCategory(topCategoryId, middleCategoryId);
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
                .build();
    }
}



