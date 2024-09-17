package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QOrderDetail is a Querydsl query type for OrderDetail
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QOrderDetail extends EntityPathBase<OrderDetail> {

    private static final long serialVersionUID = 1039275136L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QOrderDetail orderDetail = new QOrderDetail("orderDetail");

    public final QOrder order;

    public final DateTimePath<java.sql.Timestamp> orderDDeleteDate = createDateTime("orderDDeleteDate", java.sql.Timestamp.class);

    public final StringPath orderDDeleteYn = createString("orderDDeleteYn");

    public final DateTimePath<java.sql.Timestamp> orderDDeliveryRequestDate = createDateTime("orderDDeliveryRequestDate", java.sql.Timestamp.class);

    public final DateTimePath<java.time.LocalDateTime> orderDInsertDate = createDateTime("orderDInsertDate", java.time.LocalDateTime.class);

    public final NumberPath<java.math.BigDecimal> orderDPrice = createNumber("orderDPrice", java.math.BigDecimal.class);

    public final NumberPath<Integer> orderDQty = createNumber("orderDQty", Integer.class);

    public final NumberPath<java.math.BigDecimal> orderDTotalPrice = createNumber("orderDTotalPrice", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> orderDUpdateDate = createDateTime("orderDUpdateDate", java.time.LocalDateTime.class);

    public final NumberPath<Integer> orderNo = createNumber("orderNo", Integer.class);

    public final QProduct product;

    public QOrderDetail(String variable) {
        this(OrderDetail.class, forVariable(variable), INITS);
    }

    public QOrderDetail(Path<? extends OrderDetail> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QOrderDetail(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QOrderDetail(PathMetadata metadata, PathInits inits) {
        this(OrderDetail.class, metadata, inits);
    }

    public QOrderDetail(Class<? extends OrderDetail> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.order = inits.isInitialized("order") ? new QOrder(forProperty("order"), inits.get("order")) : null;
        this.product = inits.isInitialized("product") ? new QProduct(forProperty("product"), inits.get("product")) : null;
    }

}

