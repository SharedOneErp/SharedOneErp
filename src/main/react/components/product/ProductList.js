import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 파일 임포트
import '../../../resources/static/css/common/Layout.css';
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
        searchTerm,
        setSearchTerm,
        handleTopCategoryChange,
        addFilteredMiddleCategories,
        addFilteredLowCategories,
        fullTopCategories,
        filteredEditMiddleCategories,
        filteredEditLowCategories,
        handleFilterTopCategoryChangeForEdit,
        handleFilterMiddleCategoryChangeForEdit,
        handleFilterLowCategoryChangeForEdit,
        handleStatusChange,
        selectedStatus,
    } = useHooksList(); // 커스텀 훅 사용

    return (
        <Layout currentMenu="productList">
            <main className="main-content menu_price">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">전체 상품 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 1️⃣ 카테고리 */}
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
                                    onChange={handleFilterMiddleCategoryChange}
                                    disabled={!filterTopCategory}>
                                <option value="">중분류</option>
                                {filteredMiddleCategories
                                    .map((category, index) => (
                                        <option key={index} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>
                            <select className="approval-select" value={filterLowCategory}
                                    onChange={handleFilterLowCategoryChange}
                                    disabled={!filterMiddleCategory}>
                                <option value="">소분류</option>
                                {filteredLowCategories
                                    .map((category, index) => (
                                        <option key={index} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>

                            {/* 2️⃣ 검색어 입력 */}
                            <div className={`search_box ${searchTerm ? 'has_text' : ''}`}>
                                <label className={`label_floating ${searchTerm ? 'active' : ''}`}>상품명, 상품코드</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {searchTerm && (
                                    <button
                                        className="btn-del"
                                        onClick={() => setSearchTerm('')} // 검색어 초기화
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {/* 3️⃣ 상태 선택 */}
                            <div className="radio_box">
                                <span>상태</span>
                                <input
                                    type="radio"
                                    id="all"
                                    name="status"
                                    checked={selectedStatus === "all"}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="all">전체</label>
                                <input
                                    type="radio"
                                    id="active"
                                    name="status"
                                    checked={selectedStatus === "active"}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="active">정상</label>
                                <input
                                    type="radio"
                                    id="deleted"
                                    name="status"
                                    checked={selectedStatus === "deleted"}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="deleted">삭제</label>
                            </div>
                        </div>
                        <div className="right">
                            <button className="box color" onClick={() => setIsAdding(true)}><i
                                className="bi bi-plus-circle"></i> 추가하기
                            </button>
                        </div>
                    </div>

                    <div className="table_wrap">
                        <table>
                            <thead>
                            <tr>
                                {/* 전체 선택 체크박스 */}
                                <th>
                                    <label className="chkbox_label">
                                        <input
                                            type="checkbox" className="chkbox"
                                            onChange={(e) => handleAllSelectProducts(e.target.checked)}
                                        />
                                        <i className="chkbox_icon">
                                            <i className="bi bi-check-lg"></i>
                                        </i>
                                    </label>
                                </th>
                                <th>번호</th>
                                <th>상품명</th>
                                <th>대분류</th>
                                <th>중분류</th>
                                <th>소분류</th>
                                <th>등록일시</th>
                                <th>수정일시</th>
                                <th>삭제일시</th>
                                {/* 수정/삭제 버튼 */}
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
                                                handleTopCategoryChange(e);
                                            }}
                                        >
                                            <option value="">대분류</option>
                                            {fullTopCategories.map((category, index) => (
                                                <option key={index}
                                                        value={category.categoryNo}>{category.categoryNm}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            name="middleCategory"
                                            value={selectedMiddleCategory}
                                            onChange={(e) => {
                                                handleMiddleCategoryChange(e);
                                            }}
                                            disabled={!selectedTopCategory}
                                        >
                                            <option value="">중분류</option>
                                            {addFilteredMiddleCategories.map((category, index) => (
                                                <option key={index}
                                                        value={category.categoryNo}>{category.categoryNm}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            name="lowCategory"
                                            value={selectedLowCategory}
                                            onChange={(e) => {
                                                handleLowCategoryChange(e);
                                            }}
                                            disabled={!selectedMiddleCategory}
                                        >
                                            <option value="">소분류</option>
                                            {addFilteredLowCategories.map((category, index) => (
                                                <option key={index}
                                                        value={category.categoryNo}>{category.categoryNm}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <button className="product-edit-button" onClick={handleAddNewProduct}>확인
                                        </button>
                                        <button className="product-edit-button" onClick={handleCancelAdd}>취소</button>
                                    </td>
                                </tr>
                            )}

                            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    <tr key={product.productCd}
                                        className={`${selectedProducts.includes(product.productCd) ? 'selected' : ''} ${editMode === product.productCd ? 'edit-mode-active' : ''}`}>
                                        <td><input type="checkbox"
                                                   onChange={() => handleSelectProduct(product.productCd)}
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
                                                <select
                                                    name="topCategoryNo"
                                                    value={editableProduct.topCategoryNo || ''}
                                                    onChange={handleFilterTopCategoryChangeForEdit}
                                                >
                                                    <option value="">대분류</option>
                                                    {fullTopCategories.map((category, index) => (
                                                        <option key={index}
                                                                value={category.categoryNo}>{category.categoryNm}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                product.topCategoryNo ? getCategoryNameByNo(product.topCategoryNo) : '-'
                                            )}
                                        </td>
                                        <td>
                                            {editMode === product.productCd ? (
                                                <select
                                                    name="middleCategoryNo"
                                                    value={editableProduct.middleCategoryNo || ''}
                                                    onChange={handleFilterMiddleCategoryChangeForEdit}
                                                    disabled={!editableProduct.topCategoryNo}
                                                >
                                                    <option value="">중분류</option>
                                                    {filteredEditMiddleCategories.map((category, index) => (
                                                        <option key={index}
                                                                value={category.categoryNo}>{category.categoryNm}</option>
                                                    ))}
                                                </select>

                                            ) : (
                                                product.middleCategoryNo ? getCategoryNameByNo(product.middleCategoryNo) : '-'
                                            )}
                                        </td>
                                        <td>
                                            {editMode === product.productCd ? (
                                                <select
                                                    name="lowCategoryNo"
                                                    value={editableProduct.lowCategoryNo || ''}
                                                    onChange={handleFilterLowCategoryChangeForEdit}
                                                    disabled={!editableProduct.middleCategoryNo}
                                                >
                                                    <option value="">소분류</option>
                                                    {filteredEditLowCategories.map((category, index) => (
                                                        <option key={index}
                                                                value={category.categoryNo}>{category.categoryNm}</option>
                                                    ))}
                                                </select>

                                            ) : (
                                                product.lowCategoryNo ? getCategoryNameByNo(product.lowCategoryNo) : '-'
                                            )}
                                        </td>
                                        <td>{product.productInsertDate ? formatDate(product.productInsertDate) : '-'}</td>
                                        <td>{product.productUpdateDate ? formatDate(product.productUpdateDate) : '-'}</td>
                                        <td>{product.productDeleteDate ? formatDate(product.productDeleteDate) : '-'}</td>
                                        <td>
                                            {editMode === product.productCd ? (
                                                <>
                                                    <button className="product-confirm-button"
                                                            onClick={handleConfirmClick}>확인
                                                    </button>
                                                    <button className="filter-button" onClick={handleCancelEdit}>취소
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button className="product-edit-button"
                                                            onClick={() => handleOpenModal(product.productCd)}>상세
                                                    </button>
                                                    <button className="product-edit-button"
                                                            onClick={() => handleEditClick(product)}>수정
                                                    </button>
                                                    <button className="filter-button"
                                                            onClick={() => handleDeleteSelected(product.productCd)}>삭제
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
                            <button className="filter-button" onClick={() => handleDeleteSelected()}>삭제</button>
                        </div>
                    </div>
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
