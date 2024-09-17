package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QEmployee is a Querydsl query type for Employee
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QEmployee extends EntityPathBase<Employee> {

    private static final long serialVersionUID = -1905468659L;

    public static final QEmployee employee = new QEmployee("employee");

    public final DateTimePath<java.sql.Timestamp> employeeDeleteDate = createDateTime("employeeDeleteDate", java.sql.Timestamp.class);

    public final StringPath employeeDeleteYn = createString("employeeDeleteYn");

    public final StringPath employeeEmail = createString("employeeEmail");

    public final StringPath employeeId = createString("employeeId");

    public final DateTimePath<java.sql.Timestamp> employeeInsertDate = createDateTime("employeeInsertDate", java.sql.Timestamp.class);

    public final StringPath employeeName = createString("employeeName");

    public final StringPath employeePw = createString("employeePw");

    public final StringPath employeeRole = createString("employeeRole");

    public final StringPath employeeTel = createString("employeeTel");

    public final DateTimePath<java.sql.Timestamp> employeeUpdateDate = createDateTime("employeeUpdateDate", java.sql.Timestamp.class);

    public final ListPath<Order, QOrder> order = this.<Order, QOrder>createList("order", Order.class, QOrder.class, PathInits.DIRECT2);

    public QEmployee(String variable) {
        super(Employee.class, forVariable(variable));
    }

    public QEmployee(Path<? extends Employee> path) {
        super(path.getType(), path.getMetadata());
    }

    public QEmployee(PathMetadata metadata) {
        super(Employee.class, metadata);
    }

}

