package com.project.erpre.service;

import com.project.erpre.model.Category;
import com.project.erpre.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    //전체 카테고리
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    //특정 카테고리
    public Optional<Category> getCategoryById(Long categoryNo) {
        return categoryRepository.findById(categoryNo);
    }

    //카테고리 저장
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    //카테고리 삭제
    public void deleteCategory(Long categoryNo) {
        categoryRepository.deleteById(categoryNo);
    }


    public List<Category> getTopCategory() {
        return categoryRepository.findTopCategory();
    }

    public List<Category> getMiddleCategory(Long topCategoryId) {
        return categoryRepository.findMiddleCategory(topCategoryId);
    }

    public List<Category> getLowCategory(Long topCategoryId, Long middleCategoryId) {
        return categoryRepository.findLowCategoryByTopAndMiddleCategory(topCategoryId, middleCategoryId);
    }
}
