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
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductDTO saveOrUpdate(ProductDTO productDTO) {
        Product product = productRepository.findById(productDTO.getProductCd())
                .orElse(new Product()); // 기존 제품이 없으면 새 제품 생성

        // DTO 데이터를 엔티티에 설정
        product.setProductCd(productDTO.getProductCd());
        product.setProductNm(productDTO.getProductNm());

        // InsertDate 설정: 신규 등록일 경우에만 설정
        if (product.getProductInsertDate() == null) {
            product.setProductInsertDate(LocalDateTime.now());
        }

        // UpdateDate 설정: 항상 현재 시간으로 업데이트
        product.setProductUpdateDate(LocalDateTime.now());

        // Category 설정
        if (productDTO.getCategoryNo() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryNo())
                    .orElseThrow(() -> new RuntimeException("해당 카테고리를 찾을 수 없습니다."));
            product.setCategory(category);
        }

        // 상품 저장
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

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
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .productCd(product.getProductCd())
                .productNm(product.getProductNm())
                .categoryNm(product.getCategory().getCategoryNm()) // 카테고리 이름
                .productInsertDate(product.getProductInsertDate())
                .productUpdateDate(product.getProductUpdateDate())
                .productDeleteYn(product.getProductDeleteYn())
                .productDeleteDate(product.getProductDeleteDate())
                .build();
    }

    // 전체 상품 목록 조회
    public List<ProductDTO> getAllProducts() {
        return productRepository.getAllProducts();
    }

    // 상품 상세 조회
    public List<ProductDTO> getProductDetailsByProductCd(String productCd) {
        Pageable pageable = PageRequest.of(0, 5);
        Page<ProductDTO> pageResult = productRepository.getProductDetailsByProductCd(productCd, pageable);
        return pageResult.getContent();
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
