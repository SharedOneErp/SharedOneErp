package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPrice is a Querydsl query type for Price
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPrice extends EntityPathBase<Price> {

    private static final long serialVersionUID = -1618595510L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPrice price = new QPrice("price");

    public final QCustomer customer;

    public final NumberPath<java.math.BigDecimal> priceCustomer = createNumber("priceCustomer", java.math.BigDecimal.class);

    public final DateTimePath<java.sql.Timestamp> priceDeleteDate = createDateTime("priceDeleteDate", java.sql.Timestamp.class);

    public final StringPath priceDeleteYn = createString("priceDeleteYn");

    public final DateTimePath<java.sql.Timestamp> priceEndDate = createDateTime("priceEndDate", java.sql.Timestamp.class);

    public final DateTimePath<java.sql.Timestamp> priceInsertDate = createDateTime("priceInsertDate", java.sql.Timestamp.class);

    public final NumberPath<Integer> priceNo = createNumber("priceNo", Integer.class);

    public final DateTimePath<java.sql.Timestamp> priceStartDate = createDateTime("priceStartDate", java.sql.Timestamp.class);

    public final DateTimePath<java.sql.Timestamp> priceUpdateDate = createDateTime("priceUpdateDate", java.sql.Timestamp.class);

    public final QProduct product;

    public QPrice(String variable) {
        this(Price.class, forVariable(variable), INITS);
    }

    public QPrice(Path<? extends Price> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPrice(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPrice(PathMetadata metadata, PathInits inits) {
        this(Price.class, metadata, inits);
    }

    public QPrice(Class<? extends Price> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.customer = inits.isInitialized("customer") ? new QCustomer(forProperty("customer")) : null;
        this.product = inits.isInitialized("product") ? new QProduct(forProperty("product"), inits.get("product")) : null;
    }

}

