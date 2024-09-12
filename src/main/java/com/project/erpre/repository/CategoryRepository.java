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
    @Query("select c from Category c where c.categoryLevel = 1 and c.categoryDeleteYn = 'n' ")
    List<Category> findTopCategory ();

    //중분류
    @Query("select c2 from Category c2" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and c1.categoryNo = :topCategoryNo" +
            " and c2.categoryDeleteYn = 'n'")
    List<Category> findMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo);

    //소분류
    @Query("select c3 from Category c3" +
            " join Category c2 on c3.parentCategoryNo = c2.categoryNo" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and c3.categoryLevel = 3" +
            " and c1.categoryNo = :topCategoryNo" +
            " and c2.categoryNo = :middleCategoryNo" +
            " and c3.categoryDeleteYn = 'n' ")
    List<Category> findLowCategoryByTopAndMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo,
                                                         @Param("middleCategoryNo") Integer middleCategoryNo);


    // topCategory, middleCategory, lowCategory 이름으로 카테고리 조회
    @Query("SELECT c3 FROM Category c3 " +
            "JOIN Category c2 ON c3.parentCategoryNo = c2.categoryNo " +
            "JOIN Category c1 ON c2.parentCategoryNo = c1.categoryNo " +
            "WHERE c1.categoryNm = :topCategory " +
            "AND c2.categoryNm = :middleCategory " +
            "AND c3.categoryNm = :lowCategory " +
            "AND c3.categoryDeleteYn = 'n' ")
    Category findCategoryByNames(@Param("topCategory") String topCategory,
                                 @Param("middleCategory") String middleCategory,
                                 @Param("lowCategory") String lowCategory);

}
