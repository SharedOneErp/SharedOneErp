package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCustomer is a Querydsl query type for Customer
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCustomer extends EntityPathBase<Customer> {

    private static final long serialVersionUID = 1802204221L;

    public static final QCustomer customer = new QCustomer("customer");

    public final StringPath customerAddr = createString("customerAddr");

    public final StringPath customerBusinessRegNo = createString("customerBusinessRegNo");

    public final StringPath customerCountryCode = createString("customerCountryCode");

    public final DateTimePath<java.sql.Timestamp> customerDeleteDate = createDateTime("customerDeleteDate", java.sql.Timestamp.class);

    public final StringPath customerDeleteYn = createString("customerDeleteYn");

    public final StringPath customerEtaxInvoiceYn = createString("customerEtaxInvoiceYn");

    public final StringPath customerFaxNo = createString("customerFaxNo");

    public final DateTimePath<java.sql.Timestamp> customerInsertDate = createDateTime("customerInsertDate", java.sql.Timestamp.class);

    public final StringPath customerManagerEmail = createString("customerManagerEmail");

    public final StringPath customerManagerName = createString("customerManagerName");

    public final StringPath customerManagerTel = createString("customerManagerTel");

    public final StringPath customerName = createString("customerName");

    public final NumberPath<Integer> customerNo = createNumber("customerNo", Integer.class);

    public final StringPath customerRepresentativeName = createString("customerRepresentativeName");

    public final StringPath customerTel = createString("customerTel");

    public final DateTimePath<java.sql.Timestamp> customerTransactionEndDate = createDateTime("customerTransactionEndDate", java.sql.Timestamp.class);

    public final DateTimePath<java.sql.Timestamp> customerTransactionStartDate = createDateTime("customerTransactionStartDate", java.sql.Timestamp.class);

    public final StringPath customerType = createString("customerType");

    public final DateTimePath<java.sql.Timestamp> customerUpdateDate = createDateTime("customerUpdateDate", java.sql.Timestamp.class);

    public final ListPath<Order, QOrder> orderHeads = this.<Order, QOrder>createList("orderHeads", Order.class, QOrder.class, PathInits.DIRECT2);

    public final ListPath<Price, QPrice> prices = this.<Price, QPrice>createList("prices", Price.class, QPrice.class, PathInits.DIRECT2);

    public QCustomer(String variable) {
        super(Customer.class, forVariable(variable));
    }

    public QCustomer(Path<? extends Customer> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCustomer(PathMetadata metadata) {
        super(Customer.class, metadata);
    }

}

