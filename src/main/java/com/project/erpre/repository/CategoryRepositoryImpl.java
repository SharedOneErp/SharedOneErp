package com.project.erpre.repository;

import com.project.erpre.model.CategoryDTO;
import com.project.erpre.model.QCategory;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;

import javax.persistence.EntityManager;
import java.util.List;

public class CategoryRepositoryImpl implements CategoryRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public CategoryRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }
    
    // 카테고리 목록 조회 메서드
    @Override
    public List<CategoryDTO> getCategoryList(Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo) {
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");
        
        BooleanBuilder builder = new BooleanBuilder();

        if (topCategoryNo != null || middleCategoryNo != null || lowCategoryNo != null) {
            builder.and(categoryFilterCondition(topCategoryNo, middleCategoryNo, lowCategoryNo));
        }
        
        return queryFactory.select(Projections.fields(CategoryDTO.class,
                        category.categoryNm.as("lowCategory"),
                        middleCategory.categoryNm.as("middleCategory"),
                        topCategory.categoryNm.as("topCategory"),
                        category.categoryNo.as("lowCategoryNo"),
                        middleCategory.categoryNo.as("middleCategoryNo"),
                        topCategory.categoryNo.as("topCategoryNo")))
                .from(category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .where(builder)
                .orderBy(topCategory.categoryNm.asc())
                .fetch();
    }
    
    private BooleanBuilder categoryFilterCondition(Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo) {
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        BooleanBuilder condition = new BooleanBuilder();

        if (lowCategoryNo != null) {
            condition.and(category.categoryNo.eq(lowCategoryNo));
        }
        if (middleCategoryNo != null) {
            condition.and(middleCategory.categoryNo.eq(middleCategoryNo));
        }
        if (topCategoryNo != null) {
            condition.and(topCategory.categoryNo.eq(topCategoryNo));
        }

        return condition;
    }
}
