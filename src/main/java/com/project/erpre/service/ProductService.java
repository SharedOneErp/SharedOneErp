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

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // DTO -> 엔티티 변환 메서드
    private Product convertToEntity(ProductDTO productDTO) {
        Product product = new Product();
        product.setProductCd(productDTO.getProductCd());
        product.setProductNm(productDTO.getProductNm());
        product.setProductInsertDate(productDTO.getProductInsertDate());
        product.setProductUpdateDate(productDTO.getProductUpdateDate());
        product.setProductDeleteYn(productDTO.getProductDeleteYn());
        product.setProductDeleteDate(productDTO.getProductDeleteDate());

        // 카테고리 설정은 별도로 처리
        Category category = (Category) categoryRepository.findByCategoryNm(productDTO.getCategoryNm());
        if (category != null) {
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

    // 상품 업데이트
    @Transactional
    public void updateProductWithCategories(String productCd, String productNm, String topCategory, String middleCategory, String lowCategory) {
        // 카테고리를 조회합니다.
        Category category = categoryRepository.findCategoryByNames(topCategory, middleCategory, lowCategory);

        if (category == null) {
            throw new RuntimeException("해당 카테고리를 찾을 수 없습니다.");
        }

        // 제품을 업데이트합니다.
        productRepository.updateProductWithCategories(productCd, productNm, category);
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
