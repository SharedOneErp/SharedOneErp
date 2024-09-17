package com.project.erpre.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCategory is a Querydsl query type for Category
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCategory extends EntityPathBase<Category> {

    private static final long serialVersionUID = 1246540125L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCategory category = new QCategory("category");

    public final DateTimePath<java.sql.Timestamp> categoryDeleteDate = createDateTime("categoryDeleteDate", java.sql.Timestamp.class);

    public final StringPath categoryDeleteYn = createString("categoryDeleteYn");

    public final DateTimePath<java.sql.Timestamp> categoryInsertDate = createDateTime("categoryInsertDate", java.sql.Timestamp.class);

    public final NumberPath<Integer> categoryLevel = createNumber("categoryLevel", Integer.class);

    public final StringPath categoryNm = createString("categoryNm");

    public final NumberPath<Integer> categoryNo = createNumber("categoryNo", Integer.class);

    public final DateTimePath<java.sql.Timestamp> categoryUpdateDate = createDateTime("categoryUpdateDate", java.sql.Timestamp.class);

    public final QCategory parentCategory;

    public final NumberPath<Integer> parentCategoryNo = createNumber("parentCategoryNo", Integer.class);

    public final ListPath<Product, QProduct> products = this.<Product, QProduct>createList("products", Product.class, QProduct.class, PathInits.DIRECT2);

    public final ListPath<Category, QCategory> subCategories = this.<Category, QCategory>createList("subCategories", Category.class, QCategory.class, PathInits.DIRECT2);

    public QCategory(String variable) {
        this(Category.class, forVariable(variable), INITS);
    }

    public QCategory(Path<? extends Category> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCategory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCategory(PathMetadata metadata, PathInits inits) {
        this(Category.class, metadata, inits);
    }

    public QCategory(Class<? extends Category> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.parentCategory = inits.isInitialized("parentCategory") ? new QCategory(forProperty("parentCategory"), inits.get("parentCategory")) : null;
    }

}

