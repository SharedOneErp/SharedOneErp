package com.project.erpre.repository;

import com.project.erpre.model.*;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;

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

    // 1. 전체 상품 목록 조회 + 페이징 + 상태 필터링
    @Override
    public List<ProductDTO> findAllProducts(int page, int size, String status) {
        QCategory middleCategory = new QCategory("middleCategory");
        QCategory topCategory = new QCategory("torCategory");

        BooleanExpression statusCondition = null;
        if (!status.equals("all")) {
            statusCondition = product.productDeleteYn.eq(status.equals("active") ? "N" : "Y");
        }

        return queryFactory
                .select(Projections.fields(ProductDTO.class, // constructor -> fields로 null 값 허용하도록 수정
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
                        topCategory.categoryNo.as("topCategoryNo")
                ))
                .from(product)
                .leftJoin(product.category, category)
                .leftJoin(category.parentCategory, middleCategory)
                .leftJoin(middleCategory.parentCategory, topCategory)
                .where(statusCondition)
                .orderBy(product.productCd.asc())
                .offset((long) page * size)
                .limit(size)
                .fetch();
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
