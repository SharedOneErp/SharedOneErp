package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QProduct is a Querydsl query type for Product
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QProduct extends EntityPathBase<Product> {

    private static final long serialVersionUID = -686534480L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QProduct product = new QProduct("product");

    public final QCategory category;

    public final ListPath<OrderDetail, QOrderDetail> orderDetails = this.<OrderDetail, QOrderDetail>createList("orderDetails", OrderDetail.class, QOrderDetail.class, PathInits.DIRECT2);

    public final ListPath<Price, QPrice> prices = this.<Price, QPrice>createList("prices", Price.class, QPrice.class, PathInits.DIRECT2);

    public final StringPath productCd = createString("productCd");

    public final DateTimePath<java.sql.Timestamp> productDeleteDate = createDateTime("productDeleteDate", java.sql.Timestamp.class);

    public final StringPath productDeleteYn = createString("productDeleteYn");

    public final DateTimePath<java.time.LocalDateTime> productInsertDate = createDateTime("productInsertDate", java.time.LocalDateTime.class);

    public final StringPath productNm = createString("productNm");

    public final NumberPath<java.math.BigDecimal> productPrice = createNumber("productPrice", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> productUpdateDate = createDateTime("productUpdateDate", java.time.LocalDateTime.class);

    public QProduct(String variable) {
        this(Product.class, forVariable(variable), INITS);
    }

    public QProduct(Path<? extends Product> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QProduct(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QProduct(PathMetadata metadata, PathInits inits) {
        this(Product.class, metadata, inits);
    }

    public QProduct(Class<? extends Product> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new QCategory(forProperty("category"), inits.get("category")) : null;
    }

}

