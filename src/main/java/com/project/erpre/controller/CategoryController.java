package com.project.erpre.controller;

import com.project.erpre.model.Category;
import com.project.erpre.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://localhost:8787") // React 개발 서버 포트
public class CategoryController {

    @Autowired
    public CategoryService categoryService;

    //전체 카테고리
    @GetMapping("/all")
    public List<Category> getAllCategory() {
        return categoryService.getAllCategory();
    }

    //특정 카테고리
    @GetMapping("/{categoryNo}")
    public Optional<Category> getCategoryById(@PathVariable Long categoryNo) {
        return categoryService.getCategoryById(categoryNo);
    }

    //카테고리 저장
    @PostMapping("/save")
    public Category saveCategory(Category category) {
        return categoryService.saveCategory(category);
    }

    //카테고리 수정
    @PutMapping("/{categoryNo}")
    public Category updateCategory(@PathVariable Long categoryNo, @RequestBody Category category ) {
        category.setCategoryNo(categoryNo);
        return categoryService.saveCategory(category);
    }

    //카테고리 삭제
    @DeleteMapping("/{categoryNo}")
    public void deleteCategory(@PathVariable Long categoryNo) {
        categoryService.deleteCategory(categoryNo);
    }

    //카테고리 대분류
    @GetMapping("/top")
    public List<Category> getTopCategory() {
        return categoryService.getTopCategory();
    }

    @GetMapping("/middle/{topCategoryId}")
    public List<Category> getMiddleCategory(@PathVariable Long topCategoryId) {
        return categoryService.getMiddleCategory(topCategoryId);
    }

    @GetMapping("/low/{middleCategoryId}")
    public List<Category> getLowCategory(@PathVariable Long topCategoryId,
                                         @PathVariable Long middleCategoryId) {
        return categoryService.getLowCategory(topCategoryId, middleCategoryId);
    }

}
