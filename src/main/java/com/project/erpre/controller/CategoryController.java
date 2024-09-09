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
    @GetMapping
    public List<Category> getAllCategory() {
        return categoryService.getAllCategory();
    }

    //특정 카테고리
    @GetMapping("/{categoryNo}")
    public Optional<Category> getCategoryById(@PathVariable Long categoryNo) {
        return categoryService.getCategoryById(categoryNo);
    }

    //카테고리 저장
    @PostMapping
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
    @DeleteMapping
    public void deleteCategory(@PathVariable Long categoryNo) {
        categoryService.deleteCategory(categoryNo);
    }
}
