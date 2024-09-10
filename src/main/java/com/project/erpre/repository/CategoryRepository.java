package com.project.erpre.repository;

import com.project.erpre.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    //카테고리 이름 조회
    List<Category> findByCategoryNm(String categoryNm);

    //카테고리 번호 조회
    Category findByCategoryNo(Integer categoryNo);

    //대분류
    @Query("select c from Category c where c.categoryLevel = 1")
    List<Category> findTopCategory ();

    //중분류
    @Query("select c2 from Category c2" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and c1.categoryNo = :topCategoryNo")
    List<Category> findMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo);

    //소분류
    @Query("select c3 from Category c3" +
            " join Category c2 on c3.parentCategoryNo = c2.categoryNo" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and c3.categoryLevel = 3" +
            " and c1.categoryNo = :topCategoryNo" +
            " and c2.categoryNo = :middleCategoryNo")
    List<Category> findLowCategoryByTopAndMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo,
                                                         @Param("middleCategoryNo") Integer middleCategoryNo);
}
