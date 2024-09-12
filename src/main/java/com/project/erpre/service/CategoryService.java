package com.project.erpre.service;

import com.project.erpre.controller.CategoryController;
import com.project.erpre.model.Category;
import com.project.erpre.model.CategoryDTO;
import com.project.erpre.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class); // Logger 선언

    @Autowired
    private CategoryRepository categoryRepository;

    // DTO -> Entity 변환 메서드
    private Category convertToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryLevel(categoryDTO.getCategoryLevel());
        category.setCategoryNm(categoryDTO.getCategoryNm());
        category.setParentCategoryNo(categoryDTO.getParentCategoryNo());

        return category;
    }

    // Entity -> DTO 변환 메서드
    private CategoryDTO convertToDTO(Category category) {
        return CategoryDTO.builder()
                .categoryLevel(category.getCategoryLevel())
                .categoryNm(category.getCategoryNm())
                .parentCategoryNo(category.getParentCategoryNo())
                .build();
    }

    //전체 카테고리
    public List<Category> getAllCategory() {
        //정렬
        Sort sort = Sort.by(Sort.Order.asc("categoryLevel"),
                            Sort.Order.asc("parentCategoryNo"),
                            Sort.Order.asc("categoryNo"));
        return categoryRepository.findAll(sort);
    }

    //특정 카테고리
    public Optional<Category> getCategoryById(Integer categoryNo) {
        return categoryRepository.findById(categoryNo);
    }

    //카테고리 저장
    public Category saveCategory(CategoryDTO categoryDTO) {
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
        // DTO -> Entity 변환
        Category category = new Category();
        category.setCategoryLevel(categoryDTO.getCategoryLevel() );
        category.setCategoryNm(categoryDTO.getCategoryNm() );
        category.setParentCategoryNo(categoryDTO.getParentCategoryNo() );

        logger.info("[CUSTOM_LOG] categoryDTO.getCategoryLevel() : " + categoryDTO.getCategoryLevel() );
        logger.info("[CUSTOM_LOG] categoryDTO.getCategoryNm() : " + categoryDTO.getCategoryNm() );
        logger.info("[CUSTOM_LOG] categoryDTO.getParentCategoryNo() : " + categoryDTO.getParentCategoryNo() );
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");


//        // 삽입 날짜 설정 (새로 삽입할 때만)
//        category.setCategoryInsertDate(new Timestamp(System.currentTimeMillis()));

        // 엔터티 저장
        return categoryRepository.save(category);
    }

    //카테고리 수정
    public Category updateCategory(Integer categoryNo, CategoryDTO categoryDTO) {
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");
        logger.info("[CUSTOM_LOG] CategoryService > updateCategory");

        Optional<Category> existingCategoryOptional = categoryRepository.findById(categoryNo); //수정을 위한 기존의 카테고리 엔티티 조회
        if (!existingCategoryOptional.isPresent() ) {
            throw new IllegalArgumentException("해당 카테고리가 존재하지 않습니다"); // 조회한 카테고리가 존재하지 않음을 명시해줌
        }

        // existingCategoryOptional 은 Optional로 감싸진 객체 null 허용
        // existingCategory 는 위에서 값을 추출한 실제 객체

        // DTO -> Entity 변환
        Category existingCategory = existingCategoryOptional.get();
        existingCategory.setCategoryLevel(categoryDTO.getCategoryLevel() );
        existingCategory.setCategoryNm(categoryDTO.getCategoryNm() );
        existingCategory.setParentCategoryNo(categoryDTO.getParentCategoryNo() );
        logger.info("[CUSTOM_LOG] categoryDTO.getCategoryLevel() : " + categoryDTO.getCategoryLevel() );
        logger.info("[CUSTOM_LOG] categoryDTO.getCategoryNm() : " + categoryDTO.getCategoryNm() );
        logger.info("[CUSTOM_LOG] categoryDTO.getParentCategoryNo() : " + categoryDTO.getParentCategoryNo() );
        logger.info("★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★");

        return categoryRepository.save(existingCategory);
    }


    //카테고리 삭제
    public void deleteById(Integer categoryNo) {
        categoryRepository.deleteById(categoryNo);
    }


    public List<Category> getTopCategory() {
        return categoryRepository.findTopCategory();
    }

    public List<Category> getMiddleCategory(Integer topCategoryId) {
        return categoryRepository.findMiddleCategory(topCategoryId);
    }

    public List<Category> getLowCategory(Integer topCategoryId, Integer middleCategoryId) {
        return categoryRepository.findLowCategoryByTopAndMiddleCategory(topCategoryId, middleCategoryId);
    }

}
