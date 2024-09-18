import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 파일 임포트
import {useHooksList} from "./ProductHooks"; // 상품 관리에 필요한 상태 및 로직을 처리하는 훅
import {formatDate} from '../../util/dateUtils';
import ProductDetailModal from './ProductDetailModal';


function ProductList() {

    const {
        products,
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        isAdding,
        setIsAdding,
        newProductData,
        handleAddNewProduct,
        handleInputChange,
        handleCancelAdd,
        editMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleCancelEdit,
        handleDeleteSelected,
        filterLowCategory,
        filterMiddleCategory,
        filterTopCategory,
        lowCategoriesRegister,
        middleCategoriesRegister,
        topCategoriesRegister,
        filteredLowCategories,
        filteredMiddleCategories,
        handleFilterLowCategoryChange,
        handleFilterMiddleCategoryChange,
        handleFilterTopCategoryChange,
        selectedLowCategory,
        selectedMiddleCategory,
        selectedTopCategory,
        lowCategories,
        middleCategories,
        topCategories,
        handleLowCategoryChange,
        handleMiddleCategoryChange,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        productDetail,
        selectedProductCd,
        paginationNumbers,
        handlePreviousPageGroup,
        handleNextPageGroup,
        filteredProducts,
        setCurrentPage,
        getCategoryNameByNo,
    } = useHooksList(); // 커스텀 훅 사용

    return (
        <Layout currentMenu="productList">
            <main className="main-content menu_order_product">
                <div className="top-container">
                    <h2>전체 상품 목록</h2>
                </div>
                <div className="middle-container">
                    <form className="search-box-container">
                        <div style={{marginBottom: "10px"}}>
                            <span style={{marginRight: "5px"}}>카테고리 </span>
                            <select className="approval-select" value={filterTopCategory}
                                    onChange={handleFilterTopCategoryChange}>
                                <option value="">대분류</option>
                                {topCategories
                                    .map((category, index) => (
                                        <option key={index} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>
                            <select className="approval-select" value={filterMiddleCategory}
                                    onChange={handleFilterMiddleCategoryChange}>
                                <option value="">중분류</option>
                                {filteredMiddleCategories
                                    .map((category, index) => (
                                        <option key={index} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>
                            <select className="approval-select" value={filterLowCategory}
                                    onChange={handleFilterLowCategoryChange}>
                                <option value="">소분류</option>
                                {filteredLowCategories
                                    .map((category, index) => (
                                        <option key={index} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div>
                            <select className="approval-select">
                                <option>상품명</option>
                                <option>상품번호</option>
                            </select>
                            <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                            <button type="submit" className="search-button">검색</button>
                        </div>
                    </form>
                </div>
                <div className="bottom-container">
                    <button className="btn-add" onClick={() => setIsAdding(true)}><i
                        className="bi bi-plus-circle"></i> 추가하기
                    </button>
                    <div>
                        <label>
                            <p>전체 {totalItems}건 페이지 당:</p>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </label>
                    </div>

                    <table className="approval-list">
                        <thead>
                        <tr>
                            <th><input type="checkbox" onChange={(e) => handleAllSelectProducts(e.target.checked)}/>
                            </th>
                            <th>상품번호</th>
                            <th>상품명</th>
                            <th>대분류</th>
                            <th>중분류</th>
                            <th>소분류</th>
                            <th>상품 등록일</th>
                            <th>상품 수정일</th>
                            <th>상세</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody className="approval-list-content">
                        {isAdding && (
                            <tr>
                                <td></td>
                                <td><input type="text" name="productCd" value={newProductData.productCd}
                                           onChange={handleInputChange}/></td>
                                <td><input type="text" name="productNm" value={newProductData.productNm}
                                           onChange={handleInputChange}/></td>
                                <td>
                                    <select
                                        name="topCategory"
                                        value={selectedTopCategory}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleMiddleCategoryChange(e); // 대분류 선택 시 중분류 고정
                                        }}
                                    >
                                        <option value="">대분류</option>
                                        {topCategoriesRegister.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="middleCategory"
                                        value={selectedMiddleCategory}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleMiddleCategoryChange(e); // 중분류 선택 시 대분류 고정
                                        }}
                                    >
                                        <option value="">중분류</option>
                                        {middleCategoriesRegister.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="lowCategory"
                                        value={selectedLowCategory}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            handleLowCategoryChange(e); // 소분류 선택 시 중분류 및 대분류 고정
                                        }}
                                    >
                                        <option value="">소분류</option>
                                        {lowCategoriesRegister.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button className="product-edit-button" onClick={handleAddNewProduct}>확인</button>
                                    <button className="product-edit-button" onClick={handleCancelAdd}>취소</button>
                                </td>
                            </tr>
                        )}

                        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                            filteredProducts.map((product, index) => (
                                <tr key={product.productCd}
                                    className={`${selectedProducts.includes(product.productCd) ? 'selected' : ''} ${editMode === product.productCd ? 'edit-mode-active' : ''}`}>
                                    <td><input type="checkbox" onChange={() => handleSelectProduct(product.productCd)}
                                               checked={selectedProducts.includes(product.productCd)}/></td>
                                    <td>{product.productCd}</td>
                                    <td>
                                        {editMode === product.productCd ? (
                                            <input type="text" name="productNm" value={editableProduct.productNm}
                                                   onChange={handleInputChange}/>
                                        ) : (
                                            product.productNm
                                        )}
                                    </td>
                                    <td>
                                        {editMode === product.productCd ? (
                                            <select name="topCategory" value={editableProduct.topCategory}
                                                    onChange={(e) => handleMiddleCategoryChange(e, true)}>
                                                {topCategoriesRegister.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            product.topCategory
                                        )}
                                    </td>
                                    <td>
                                        {editMode === product.productCd ? (
                                            <select name="middleCategory" value={editableProduct.middleCategory}
                                                    onChange={(e) => handleMiddleCategoryChange(e, true)}>
                                                {middleCategoriesRegister.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            product.middleCategory
                                        )}
                                    </td>
                                    <td>
                                        {editMode === product.productCd ? (
                                            <select name="lowCategory" value={editableProduct.lowCategory}
                                                    onChange={(e) => handleLowCategoryChange(e, true)}>
                                                {lowCategoriesRegister.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            product.lowCategory
                                        )}
                                    </td>
                                    <td>{product.productInsertDate ? formatDate(product.productInsertDate) : '-'}</td>
                                    <td>{product.productUpdateDate ? formatDate(product.productUpdateDate) : '-'}</td>
                                    <td>
                                        <button onClick={() => handleOpenModal(product.productCd)}>상세</button>
                                    </td>
                                    <td>
                                        {editMode === product.productCd ? (
                                            <>
                                                <button className="product-confirm-button"
                                                        onClick={handleConfirmClick}>확인
                                                </button>
                                                <button className="filter-button" onClick={handleCancelEdit}>취소</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="product-edit-button"
                                                        onClick={() => handleEditClick(product)}>수정
                                                </button>
                                                <button className="filter-button" onClick={handleDeleteSelected}>삭제
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10}>상품이 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={handlePreviousPageGroup}
                            disabled={paginationNumbers[0] === 1}
                        >
                            {"<"}
                        </button>

                        {paginationNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={currentPage === page ? 'active' : ''}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={handleNextPageGroup}
                            disabled={paginationNumbers[paginationNumbers.length - 1] === totalPages}
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            {">>"}
                        </button>
                    </div>
                    <div className="button-container">
                        <button className="filter-button" onClick={handleDeleteSelected}>삭제</button>
                    </div>
                </div>
                {isModalOpen && (
                    <ProductDetailModal
                        productCd={selectedProductCd}
                        onClose={handleCloseModal}
                    />
                )}
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><ProductList/></BrowserRouter>);
