package com.project.erpre.service;

import com.project.erpre.controller.PriceController;
import com.project.erpre.model.Category;
import com.project.erpre.model.CategoryDTO;
import com.project.erpre.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class); // Logger 선언

    @Autowired
    private CategoryRepository categoryRepository;

    //전체 카테고리
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    //특정 카테고리
    public Optional<Category> getCategoryById(Integer categoryNo) {
        return categoryRepository.findById(categoryNo);
    }

    //카테고리 저장
    public Category saveCategory(CategoryDTO categoryDTO) {
        // DTO -> Entity 변환
        Category category = new Category();
        category.setCategoryLevel(categoryDTO.getCategoryLevel());
        category.setCategoryNm(categoryDTO.getCategoryNm());

        // 엔터티 저장
        return categoryRepository.save(category);
    }

    //카테고리 삭제
    public void deleteCategory(Integer categoryNo) {
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
