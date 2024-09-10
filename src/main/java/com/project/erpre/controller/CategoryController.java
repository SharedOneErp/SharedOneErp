package com.project.erpre.controller;
import com.project.erpre.model.Category;
import com.project.erpre.model.CategoryDTO;
import com.project.erpre.service.CategoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class); // Logger 선언

    @Autowired
    public CategoryService categoryService;

    //전체 카테고리
    @GetMapping("/all")
    public List<Category> getAllCategory() {
        return categoryService.getAllCategory();
    }

    //특정 카테고리
    @GetMapping("/{categoryNo}")
    public Optional<Category> getCategoryById(@PathVariable Integer categoryNo) {
        return categoryService.getCategoryById(categoryNo);
    }

    //카테고리 저장
    @PostMapping("/save")
    public Category saveCategory(@RequestBody CategoryDTO categoryDTO) { // Entity는 폼 데이터나 쿼리 파라미터로 자동 바인딩되지만, DTO는 JSON 본문을 객체로 변환하기 위해 @RequestBody가 필요합니다.
        return categoryService.saveCategory(categoryDTO);
    }

    //카테고리 수정
    @PutMapping("/{categoryNo}")
    public Category updateCategory(@PathVariable Long categoryNo, @RequestBody CategoryDTO categoryDTO ) {
        categoryDTO.setCategoryNo(categoryNo);
        return categoryService.saveCategory(categoryDTO);

    }

    //카테고리 삭제
    @DeleteMapping("/{categoryNo}")
    public void deleteCategory(@PathVariable Integer categoryNo) {
        categoryService.deleteCategory(categoryNo);
    }

    //카테고리 대분류
    @GetMapping("/top")
    public List<Category> getTopCategory() {
        return categoryService.getTopCategory();
    }

    //카테고리 중분류
    @GetMapping("/middle/{topCategoryId}")
    public List<Category> getMiddleCategory(@PathVariable Integer topCategoryId) {
        return categoryService.getMiddleCategory(topCategoryId);
    }

    //카테고리 소분류
    @GetMapping("/low/{middleCategoryId}/{topCategoryId}")
    public List<Category> getLowCategory(@PathVariable Integer topCategoryId,
                                         @PathVariable Integer middleCategoryId) {
        return categoryService.getLowCategory(topCategoryId, middleCategoryId);
    }

}
