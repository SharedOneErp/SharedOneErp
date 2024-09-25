package com.project.erpre.repository;

import com.project.erpre.model.*;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import javax.persistence.EntityManager;

import static com.project.erpre.model.QCategory.category;
import static com.project.erpre.model.QCustomer.customer;
import static com.project.erpre.model.QEmployee.employee;
import static com.project.erpre.model.QOrder.order;
import static com.project.erpre.model.QOrderDetail.orderDetail;
import static com.project.erpre.model.QProduct.product;


public class ProductRepositoryImpl implements ProductRepositoryCustom {

    // QueryDSL 사용을 위한 JPAQueryFactory
    private final JPAQueryFactory queryFactory;

    public ProductRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    // 1. 상품 목록 조회 + 필터링 + 정렬 + 페이징
    @Override
    public Page<ProductDTO> productsList(Pageable pageable, String status, Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo, String productCd, String productNm, String sortColumn, String sortDirection) {
        QProduct product = QProduct.product;
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        BooleanBuilder builder = new BooleanBuilder();

        OrderSpecifier<?> orderSpecifier = getOrderSpecifier(sortColumn, sortDirection);

        // 상태 조건
        if (!status.equals("all")) {
            builder.and(product.productDeleteYn.eq(status.equals("active") ? "N" : "Y"));
        }

        // 카테고리 조건
        if (topCategoryNo != null || middleCategoryNo != null || lowCategoryNo != null) {
            builder.and(categoryFilterCondition(topCategoryNo, middleCategoryNo, lowCategoryNo));
        }

        // 상품 코드/상품명 조건
        if (productCd != null && !productCd.isEmpty()) {
            builder.and(product.productCd.containsIgnoreCase(productCd).or(product.productNm.containsIgnoreCase(productNm)));
        }

        // 쿼리 실행
        List<ProductDTO> results = queryFactory.select(Projections.fields(ProductDTO.class,
                        product.productCd,
                        product.productNm,
                        product.productInsertDate,
                        product.productUpdateDate,
                        product.productDeleteDate,
                        product.productDeleteYn,
                        category.categoryNm.as("lowCategory"),
                        middleCategory.categoryNm.as("middleCategory"),
                        topCategory.categoryNm.as("topCategory"),
                        category.categoryNo.as("lowCategoryNo"),
                        middleCategory.categoryNo.as("middleCategoryNo"),
                        topCategory.categoryNo.as("topCategoryNo"),
                        product.productPrice))
                .from(product)
                .leftJoin(product.category, category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .where(builder)
                .orderBy(orderSpecifier)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 총 개수 계산
        long total = queryFactory.selectFrom(product)
                .where(builder)
                .fetchCount();

        return new PageImpl<>(results, pageable, total);
    }

    // 정렬 조건 설정 메서드
    private OrderSpecifier<?> getOrderSpecifier(String sortColumn, String sortDirection) {
        QProduct product = QProduct.product;
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        OrderSpecifier<?> orderSpecifier;

        switch (sortColumn) {
            case "productCd":
                orderSpecifier = sortDirection.equals("asc") ? product.productCd.asc() : product.productCd.desc();
                break;
            case "productNm":
                orderSpecifier = sortDirection.equals("asc") ? product.productNm.asc() : product.productNm.desc();
                break;
            case "topCategory":
                orderSpecifier = sortDirection.equals("asc") ? topCategory.categoryNm.asc() : topCategory.categoryNm.desc();
                break;
            case "middleCategory":
                orderSpecifier = sortDirection.equals("asc") ? middleCategory.categoryNm.asc() : middleCategory.categoryNm.desc();
                break;
            case "lowCategory":
                orderSpecifier = sortDirection.equals("asc") ? category.categoryNm.asc() : category.categoryNm.desc();
                break;
            case "productPrice":
                orderSpecifier = sortDirection.equals("asc") ? product.productPrice.asc() : product.productPrice.desc();
                break;
            case "productInsertDate":
                orderSpecifier = sortDirection.equals("asc") ? product.productInsertDate.asc() : product.productInsertDate.desc();
                break;
            case "productUpdateDate":
                orderSpecifier = sortDirection.equals("asc") ? product.productUpdateDate.asc() : product.productUpdateDate.desc();
                break;
            case "productDeleteDate":
                orderSpecifier = sortDirection.equals("asc") ? product.productDeleteDate.asc() : product.productDeleteDate.desc();
                break;
                default:
                orderSpecifier = product.productCd.asc();
                break;
        }

        return orderSpecifier;
    }


    // 0920 예원 추가 (상품코드, 상품명, 대분류, 중분류, 소분류, 상태별 상품목록 페이징 적용하여 가져오기)
    public Page<ProductDTO> findProductsFilter(Pageable pageable, String status,
                                               Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo,
                                               String productCd, String productNm) {
        QProduct product = QProduct.product;
        QCategory category = QCategory.category;
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        // 상태 조건
        BooleanExpression statusCondition = (status.equals("all"))
                ? null
                : product.productDeleteYn.eq(status.equals("active") ? "N" : "Y");

        // 카테고리 조건
        BooleanExpression categoryCondition = categoryFilterCondition(topCategoryNo, middleCategoryNo, lowCategoryNo);

        // 상품명/상품코드 조건 (AND 조건)
        BooleanExpression productCondition = null;
        if (productCd != null && !productCd.isEmpty()) {
            productCondition = product.productCd.containsIgnoreCase(productCd);  // 상품 코드 조건
        }
        if (productNm != null && !productNm.isEmpty()) {
            productCondition = (productCondition != null)
                    ? productCondition.and(product.productNm.containsIgnoreCase(productNm))  // AND 조건
                    : product.productNm.containsIgnoreCase(productNm);  // 상품명 조건
        }

        // BooleanBuilder 사용하여 조건 추가
        BooleanBuilder builder = new BooleanBuilder();
        if (statusCondition != null) builder.and(statusCondition);
        if (categoryCondition != null) builder.and(categoryCondition);
        if (productCondition != null) builder.and(productCondition);

        List<ProductDTO> results = queryFactory.select(Projections.fields(ProductDTO.class,
                        product.productCd,
                        product.productNm,
                        product.productInsertDate,
                        product.productUpdateDate,
                        product.productDeleteDate,
                        product.productDeleteYn,
                        category.categoryNm.as("lowCategory"),
                        middleCategory.categoryNm.as("middleCategory"),
                        topCategory.categoryNm.as("topCategory"),
                        category.categoryNo.as("lowCategoryNo"),
                        middleCategory.categoryNo.as("middleCategoryNo"),
                        topCategory.categoryNo.as("topCategoryNo")))
                .from(product)
                .leftJoin(product.category, category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .where(builder)  // 조건 적용
                .offset(pageable.getOffset())  // 페이지 시작 위치
                .limit(pageable.getPageSize())  // 페이지 크기 설정
                .fetch();

        // 총 항목 수
        long total = queryFactory.selectFrom(product)
                .where(builder)
                .fetchCount();  // 조건에 맞는 총 개수

        return new PageImpl<>(results, pageable, total);  // 결과를 Page 객체로 반환
    }


    // 0920 예원 추가 2
    private BooleanExpression categoryFilterCondition(Integer topCategoryNo, Integer middleCategoryNo, Integer lowCategoryNo) {
        QCategory category = QCategory.category;

        BooleanExpression topCondition = null;
        BooleanExpression middleCondition = null;
        BooleanExpression lowCondition = null;

        // 대분류 필터 조건
        if (topCategoryNo != null) {
            topCondition = category.parentCategory.parentCategoryNo.eq(topCategoryNo);
        }

        // 중분류 필터 조건
        if (middleCategoryNo != null) {
            middleCondition = category.parentCategory.categoryNo.eq(middleCategoryNo);
        }

        // 소분류 필터 조건
        if (lowCategoryNo != null) {
            lowCondition = category.categoryNo.eq(lowCategoryNo);
        }

        // 필터 조건을 결합
        BooleanExpression result = topCondition != null ? topCondition : null;
        if (middleCondition != null) {
            result = (result != null) ? result.and(middleCondition) : middleCondition;
        }
        if (lowCondition != null) {
            result = (result != null) ? result.and(lowCondition) : lowCondition;
        }

        return result;
    }


    // 2. 상품 상세정보 조회 (최근 납품내역 5건 포함)
    @Override
    public List<ProductDTO> findProductDetailsByProductCd(String productCd) {
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("topCategory");

        return queryFactory
                .select(Projections.fields(ProductDTO.class,
                        product.productCd,
                        product.productNm,
                        product.productInsertDate,
                        product.productUpdateDate,
                        employee.employeeName,
                        customer.customerName,
                        orderDetail.orderDDeliveryRequestDate,
                        orderDetail.orderDQty,
                        orderDetail.orderDTotalPrice,
                        category.categoryNm.as("lowCategory"),
                        middleCategory.categoryNm.as("middleCategory"),
                        topCategory.categoryNm.as("topCategory")
                ))
                .from(product)
                .leftJoin(product.category, category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .leftJoin(product.orderDetails, orderDetail)
                .leftJoin(orderDetail.order, order)
                .leftJoin(order.employee, employee)
                .leftJoin(order.customer, customer)
                .where(product.productCd.eq(productCd))
                .orderBy(orderDetail.orderDDeliveryRequestDate.desc())
                .limit(5)
                .fetch();
    }

}
