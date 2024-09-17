package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QOrder is a Querydsl query type for Order
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QOrder extends EntityPathBase<Order> {

    private static final long serialVersionUID = -1619523761L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QOrder order = new QOrder("order1");

    public final QCustomer customer;

    public final QEmployee employee;

    public final ListPath<OrderDetail, QOrderDetail> orderDetails = this.<OrderDetail, QOrderDetail>createList("orderDetails", OrderDetail.class, QOrderDetail.class, PathInits.DIRECT2);

    public final DateTimePath<java.sql.Timestamp> orderHDeleteDate = createDateTime("orderHDeleteDate", java.sql.Timestamp.class);

    public final StringPath orderHDeleteYn = createString("orderHDeleteYn");

    public final DateTimePath<java.time.LocalDateTime> orderHInsertDate = createDateTime("orderHInsertDate", java.time.LocalDateTime.class);

    public final StringPath orderHStatus = createString("orderHStatus");

    public final NumberPath<java.math.BigDecimal> orderHTotalPrice = createNumber("orderHTotalPrice", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> orderHUpdateDate = createDateTime("orderHUpdateDate", java.time.LocalDateTime.class);

    public final NumberPath<Integer> orderNo = createNumber("orderNo", Integer.class);

    public QOrder(String variable) {
        this(Order.class, forVariable(variable), INITS);
    }

    public QOrder(Path<? extends Order> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QOrder(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QOrder(PathMetadata metadata, PathInits inits) {
        this(Order.class, metadata, inits);
    }

    public QOrder(Class<? extends Order> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.customer = inits.isInitialized("customer") ? new QCustomer(forProperty("customer")) : null;
        this.employee = inits.isInitialized("employee") ? new QEmployee(forProperty("employee")) : null;
    }

}

