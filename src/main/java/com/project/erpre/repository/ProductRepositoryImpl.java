package com.project.erpre.repository;

import com.project.erpre.model.*;
import com.querydsl.core.types.Projections;
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

    // 1. 전체 상품 목록 조회
    @Override
    public List<ProductDTO> findAllProducts(int page, int size) {
        return queryFactory
                .select(Projections.constructor(ProductDTO.class,
                        product.productCd,
                        product.productNm,
                        product.productInsertDate,
                        product.productUpdateDate,
                        category.categoryNm, // 소분류 이름
                        category.parentCategory.categoryNm, // 중분류 이름
                        category.parentCategory.parentCategory.categoryNm // 대분류 이름
                ))
                .from(product)
                .leftJoin(product.category, category)
                .offset(page * size)
                .limit(size)
                .fetch();
    }

    // 2. 상품 상세정보 조회 (최근 납품내역 5건 포함)
    @Override
    public List<ProductDTO> findProductDetailsByProductCd(String productCd) {
        return queryFactory
                .select(Projections.constructor(ProductDTO.class, // 데이터베이스 쿼리 결과를 Java 클래스로 변환
                        product.productCd,
                        product.productNm,
                        product.productInsertDate,
                        product.productUpdateDate,
                        employee.employeeName,
                        customer.customerName,
                        orderDetail.orderDDeliveryRequestDate,
                        orderDetail.orderDQty,
                        orderDetail.orderDTotalPrice,
                        category.categoryNm,
                        category.parentCategory.categoryNm,
                        category.parentCategory.parentCategory.categoryNm
                ))
                .from(product)
                .leftJoin(product.category, category)
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
