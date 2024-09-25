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
    public List<CategoryDTO> getCategoryList(Integer one, Integer two, Integer three) {
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");
        
        BooleanBuilder builder = new BooleanBuilder();

        if (one != null || two != null || three != null) {
            builder.and(categoryFilterCondition(one, two, three));
        }
        
        return queryFactory.select(Projections.fields(CategoryDTO.class,
                        category.categoryNm.as("lowCategory"),
                        middleCategory.categoryNm.as("middleCategory"),
                        topCategory.categoryNm.as("topCategory"),
                        category.categoryNo.as("three"),
                        middleCategory.categoryNo.as("two"),
                        topCategory.categoryNo.as("one"),
                        category.categoryLevel.as("lowCategoryLevel"),
                        middleCategory.categoryLevel.as("middleCategoryLevel"),
                        topCategory.categoryLevel.as("topCategoryLevel")))
                .from(category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .where(builder)
                .orderBy(topCategory.categoryNm.asc())
                .fetch();
    }
    
    private BooleanBuilder categoryFilterCondition(Integer one, Integer two, Integer three) {
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        BooleanBuilder condition = new BooleanBuilder();

        if (three != null) {
            condition.and(category.categoryNo.eq(three));
        }
        if (two != null) {
            condition.and(middleCategory.categoryNo.eq(two));
        }
        if (one != null) {
            condition.and(topCategory.categoryNo.eq(one));
        }

        return condition;
    }
}
