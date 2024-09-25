package com.project.erpre.repository;

import com.project.erpre.model.Category;
import com.project.erpre.model.CategoryDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer>, CategoryRepositoryCustom, QuerydslPredicateExecutor<Category> {

    @Query(value = "WITH RECURSIVE CategoryTree AS (\n" +
            "    SELECT \n" +
            "        category_no AS one,\n" +
            "        CAST(NULL AS INTEGER) AS two,\n" +
            "        CAST(NULL AS INTEGER) AS three,\n" +
            "        category_no,\n" +
            "        category_nm,\n" +
            "        parent_category_no,\n" +
            "        CAST(category_nm AS VARCHAR) AS paths,\n" +
            "        1 AS category_level,\n" +
            "        category_insert_date AS top_category_insert_date,\n" +
            "        category_insert_date,\n" +
            "\t\tcategory_update_date,\n" +
            "        CAST(category_nm AS VARCHAR) AS sort_key\n" +
            "    FROM \n" +
            "        m_category\n" +
            "    WHERE \n" +
            "        category_delete_yn = 'N'\n" +
            "        AND parent_category_no IS NULL\n" +
            "\n" +
            "    UNION ALL\n" +
            "\n" +
            "    SELECT \n" +
            "        ct.one,\n" +
            "        CASE WHEN ct.category_level = 1 THEN c.category_no ELSE ct.two END AS two,\n" +
            "        CASE WHEN ct.category_level = 2 THEN c.category_no ELSE ct.three END AS three,\n" +
            "        c.category_no,\n" +
            "        c.category_nm,\n" +
            "        c.parent_category_no,\n" +
            "        CONCAT(ct.paths, ' > ', c.category_nm) AS paths,\n" +
            "        ct.category_level + 1 AS category_level,\n" +
            "        ct.top_category_insert_date,\n" +
            "        c.category_insert_date,\n" +
            "\t\tc.category_update_date,\n" +
            "        CONCAT(ct.sort_key, '-', CAST(c.category_no AS VARCHAR)) AS sort_key\n" +
            "    FROM \n" +
            "        m_category c\n" +
            "    INNER JOIN \n" +
            "        CategoryTree ct ON c.parent_category_no = ct.category_no\n" +
            "    WHERE \n" +
            "        c.category_delete_yn = 'N'\n" +
            ")\n" +
            "SELECT one, two, three, category_no, category_level, paths, category_insert_date, category_update_date\n" +
            "FROM CategoryTree\n" +
            "ORDER BY sort_key;\n", nativeQuery = true)
    List<Object[]> findCategoryPathsAsObjects();

    //카테고리 이름 조회
    List<Category> findByCategoryNmAndCategoryDeleteYn(String categoryNm, String categoryDeleteYn);

    //카테고리 번호 조회
    Category findByCategoryNo(Integer categoryNo);

    //카테고리 하위 카테고리 조회(상위 카테고리삭제 시 하위 카테고리 삭제 위함)
    List<Category> findByParentCategoryNo(Integer parentCategoryNo);

    // 🔴모든 분류
    @Query("select c from Category c where c.categoryDeleteYn = 'N' order by c.categoryNm asc")
    List<Category> findAllCategory();

    //대분류
    @Query("select c from Category c where c.categoryLevel = 1 and c.categoryDeleteYn = 'N' order by c.categoryNm asc")
    List<Category> findTopCategory();

    //중분류
    @Query("select c2 from Category c2" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and (:topCategoryNo IS NULL OR c1.categoryNo = :topCategoryNo)" +
            " and c2.categoryDeleteYn = 'N' order by c2.categoryNm asc")
    List<Category> findMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo);

    //소분류
    @Query("select c3 from Category c3" +
            " join Category c2 on c3.parentCategoryNo = c2.categoryNo" +
            " join Category c1 on c2.parentCategoryNo = c1.categoryNo" +
            " where c1.categoryLevel = 1" +
            " and c2.categoryLevel = 2" +
            " and c3.categoryLevel = 3" +
            " and (:topCategoryNo IS NULL OR c1.categoryNo = :topCategoryNo)" +
            " and (:middleCategoryNo IS NULL OR c2.categoryNo = :middleCategoryNo)" +
            " and c3.categoryDeleteYn = 'N' ")
    List<Category> findLowCategoryByTopAndMiddleCategory(@Param("topCategoryNo") Integer topCategoryNo,
                                                         @Param("middleCategoryNo") Integer middleCategoryNo);

    @Query("SELECT c3 FROM Category c3 " +
            "JOIN Category c2 ON c3.parentCategoryNo = c2.categoryNo " +
            "JOIN Category c1 ON c2.parentCategoryNo = c1.categoryNo " +
            "WHERE c1.categoryNm = :topCategory " +
            "AND (:middleCategory IS NULL OR c2.categoryNm = :middleCategory) " +
            "AND (:lowCategory IS NULL OR c3.categoryNm = :lowCategory) " +
            "AND c3.categoryDeleteYn = 'N'")
    Category findCategoryByNames2(@Param("topCategory") String topCategory,
                                  @Param("middleCategory") String middleCategory,
                                  @Param("lowCategory") String lowCategory);

    // topCategory, middleCategory, lowCategory 이름으로 카테고리 조회
    @Query("SELECT c3 FROM Category c3 " +
            "JOIN Category c2 ON c3.parentCategoryNo = c2.categoryNo " +
            "JOIN Category c1 ON c2.parentCategoryNo = c1.categoryNo " +
            "WHERE c1.categoryNm = :topCategory " +
            "AND c2.categoryNm = :middleCategory " +
            "AND c3.categoryNm = :lowCategory " +
            " and c3.categoryDeleteYn = 'N' order by c3.categoryNm asc")
    Category findCategoryByNames(@Param("topCategory") String topCategory,
                                 @Param("middleCategory") String middleCategory,
                                 @Param("lowCategory") String lowCategory);

}
/*

// 240919 예원(주석 추가한 WITH RECURSIVE 쿼리 기록)
/*
WITH RECURSIVE CategoryTree AS (
    -- 비재귀 항목: 최상위 카테고리 선택
    SELECT
        category_no AS one,  -- 대분류 번호를 one에 저장
        CAST(NULL AS INTEGER) AS two,  -- 중분류는 없으므로 NULL을 INTEGER로 명시적 캐스팅
        CAST(NULL AS INTEGER) AS three,  -- 소분류도 없으므로 NULL을 INTEGER로 명시적 캐스팅
        category_no,  -- 카테고리 번호
        category_nm,  -- 카테고리 이름
        parent_category_no,  -- 상위 카테고리 번호
        category_nm::VARCHAR AS paths,  -- 경로를 문자열로 저장
        1 AS category_level,  -- 카테고리 레벨 (대분류는 1)
        category_insert_date AS top_category_insert_date,  -- 최상위 카테고리 삽입 날짜
        category_insert_date,  -- 삽입 날짜
        LPAD(CAST(category_no AS VARCHAR), 10, '0') AS sort_key  -- 정렬을 위한 키 (번호를 문자열로 변환 후 10자리로 0 패딩)
    FROM
        m_category
    WHERE
        parent_category_no IS NULL  -- 최상위 카테고리만 선택

    UNION ALL

    -- 재귀 항목: 하위 카테고리 처리
    SELECT
        ct.one,  -- 상위의 대분류 번호를 유지
        CASE WHEN ct.category_level = 1 THEN c.category_no ELSE ct.two END AS two,  -- 대분류일 때 중분류 번호 저장
        CASE WHEN ct.category_level = 2 THEN c.category_no ELSE ct.three END AS three,  -- 중분류일 때 소분류 번호 저장
        c.category_no,  -- 현재 카테고리 번호
        c.category_nm,  -- 현재 카테고리 이름
        c.parent_category_no,  -- 현재 카테고리의 상위 카테고리 번호
        CONCAT(ct.paths, ' > ', c.category_nm) AS paths,  -- 상위 카테고리의 경로에 현재 카테고리 추가
        ct.category_level + 1 AS category_level,  -- 카테고리 레벨 증가
        ct.top_category_insert_date,  -- 최상위 카테고리 삽입 날짜 유지
        c.category_insert_date,  -- 현재 카테고리 삽입 날짜
        CONCAT(ct.sort_key, '-', LPAD(CAST(c.category_no AS VARCHAR), 10, '0')) AS sort_key  -- 상위 카테고리의 정렬 키에 현재 카테고리 키 추가
    FROM
        m_category c
    INNER JOIN
        CategoryTree ct ON c.parent_category_no = ct.category_no  -- 상위 카테고리와 하위 카테고리를 연결
)
-- 결과를 출력
SELECT one, two, three, category_no, category_level, paths, category_insert_date
FROM CategoryTree
ORDER BY sort_key;  -- 정렬 키 기준으로 정렬

 */