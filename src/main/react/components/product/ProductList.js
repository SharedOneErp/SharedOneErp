import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 파일 임포트
import '../../../resources/static/css/common/Layout.css';
import {useProductHooks} from "./useProductHooks"; // 상품 관리에 필요한 상태 및 로직을 처리하는 훅
import {formatDate} from '../../util/dateUtils';
import ProductDetailModal from './ProductDetailModal';
import Pagination from '../common/Pagination';
import ProductRow from './ProductRow';


function ProductList() {

    const {
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        isAddMode,
        setIsAddMode,
        newProductData,
        handleAddNewProduct,
        handleInputChange,
        handleCancelAdd,
        isEditMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleCancelEdit,
        handleDeleteSelected,
        filterLowCategory,
        filterMiddleCategory,
        filterTopCategory,
        handleFilterLowCategoryChange,
        handleFilterMiddleCategoryChange,
        handleFilterTopCategoryChange,
        selectedLowCategory,
        selectedMiddleCategory,
        selectedTopCategory,
        topCategories,
        handleLowCategoryChange,
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        selectedProductCd,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        addFilteredMiddleCategories,
        addFilteredLowCategories,
        filteredEditMiddleCategories,
        filteredEditLowCategories,
        handleFilterTopCategoryChangeForEdit,
        handleFilterMiddleCategoryChangeForEdit,
        handleFilterLowCategoryChangeForEdit,
        handleStatusChange,
        selectedStatus,
        isLoading,
        handleRestore,
        handlePageInputChange,
        handleSort,
        sortColumn,
        sortDirection,
        handleAddMiddleCategoryChange,
        handleAddTopCategoryChange,
        pageInputValue,
        middleCategories,
        lowCategories,
        addMiddleCategories,
        addLowCategories,
    } = useProductHooks(); // 커스텀 훅 사용


    return (
        <Layout
            currentMenu="productList">
            <main className="main-content menu_product">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">전체 상품 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 1️⃣ 카테고리 */}
                            <select className="box" value={filterTopCategory}
                                    onChange={handleFilterTopCategoryChange}>
                                <option value="">대분류</option>
                                {topCategories
                                    .filter((category) => category.categoryNm !== '대분류')
                                    .map((category) => (
                                    <option key={category.categoryNo} value={category.categoryNo}>
                                        {category.categoryNm}
                                    </option>
                                    ))}
                            </select>
                            <select className="box" value={filterMiddleCategory}
                                    onChange={handleFilterMiddleCategoryChange}
                                    disabled={!filterTopCategory}>
                                <option value="">중분류</option>
                                {middleCategories
                                    .map((category, index) => (
                                        <option key={category.categoryNo} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>
                            <select className="box" value={filterLowCategory}
                                    onChange={handleFilterLowCategoryChange}
                                    disabled={!filterTopCategory || !filterMiddleCategory}>
                                <option value="">소분류</option>
                                {lowCategories
                                    .map((category, index) => (
                                        <option key={category.categoryNo} value={category.categoryNo}>
                                            {category.categoryNm}
                                        </option>
                                    ))}
                            </select>

                            {/* 2️⃣ 검색어 입력 */}
                            <div className={`search_box ${searchTerm ? 'has_text' : ''}`}>
                                <label className={`label_floating ${searchTerm ? 'active' : ''}`}>상품코드, 상품명</label>
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
                            <button className="box color" onClick={() => setIsAddMode(true)}><i
                                className="bi bi-plus-circle"></i> 추가하기
                            </button>
                        </div>
                    </div>

                    <div className={`table_wrap ${isAddMode ? 'uniform-width' : ''}`}>
                        <table>
                            <thead>
                            <tr>
                                {/* 전체 선택 체크박스 */}
                                <th>
                                    <label className="chkbox_label">
                                        <input
                                            type="checkbox" className="chkbox"
                                            id="all-select_checkbox"
                                            onChange={(e) => handleAllSelectProducts(e.target.checked)}
                                        />
                                        <i className="chkbox_icon">
                                            <i className="bi bi-check-lg"></i>
                                        </i>
                                    </label>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'topCategory' ? 'active' : ''}`}>
                                        <span>대분류</span>
                                        <button className="btn_order" onClick={() => handleSort('topCategory')}>
                                            <i className={`bi ${sortColumn === 'topCategory' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'middleCategory' ? 'active' : ''}`}>
                                        <span>중분류</span>
                                        <button className="btn_order" onClick={() => handleSort('middleCategory')}>
                                            <i className={`bi ${sortColumn === 'middleCategory' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'lowCategory' ? 'active' : ''}`}>
                                        <span>소분류</span>
                                        <button className="btn_order" onClick={() => handleSort('lowCategory')}>
                                            <i className={`bi ${sortColumn === 'lowCategory' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productCd' ? 'active' : ''}`}>
                                        <span>상품코드</span>
                                        <button className="btn_order" onClick={() => handleSort('productCd')}>
                                            <i className={`bi ${sortColumn === 'productCd' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productNm' ? 'active' : ''}`}>
                                        <span>상품명</span>
                                        <button className="btn_order" onClick={() => handleSort('productNm')}>
                                            <i className={`bi ${sortColumn === 'productNm' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productPrice' ? 'active' : ''}`}>
                                        <span>기준가(원)</span>
                                        <button className="btn_order" onClick={() => handleSort('productPrice')}>
                                            <i className={`bi ${sortColumn === 'productPrice' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productInsertDate' ? 'active' : ''}`}>
                                        <span>등록일시</span>
                                        <button className="btn_order" onClick={() => handleSort('productInsertDate')}>
                                            <i className={`bi ${sortColumn === 'productInsertDate' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productUpdateDate' ? 'active' : ''}`}>
                                        <span>수정일시</span>
                                        <button className="btn-order" onClick={() => handleSort('productUpdateDate')}>
                                            <i className={`bi ${sortColumn === 'productUpdateDate' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`order_wrap ${sortColumn === 'productDeleteDate' ? 'active' : ''}`}>
                                        <span>삭제일시</span>
                                        <button className="btn-order" onClick={() => handleSort('productDeleteDate')}>
                                            <i className={`bi ${sortColumn === 'productDeleteDate' ? (sortDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                        </button>
                                    </div>
                                </th>
                                {/* 수정/삭제 버튼 */}
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* 추가 상태일 때 새로운 입력 행 추가 */}
                            {isAddMode && (
                                <ProductRow
                                    isEditMode={false}
                                    productData={newProductData}
                                    topCategory={selectedTopCategory}
                                    topCategories={topCategories}
                                    midCategory={selectedMiddleCategory}
                                    midCategories={addFilteredMiddleCategories}
                                    lowCategory={selectedLowCategory}
                                    lowCategories={addFilteredLowCategories}
                                    handleInputChange={handleInputChange}
                                    onTopChange={handleAddTopCategoryChange} // 대분류 선택 시 호출
                                    onMidChange={handleAddMiddleCategoryChange} // 중분류 필터링
                                    onLowChange={handleLowCategoryChange} // 소분류 필터링
                                    onSave={handleAddNewProduct}
                                    onCancel={handleCancelAdd}
                                />
                            )}
                            {/* 로딩 중일 때 로딩 이미지 표시 */}
                            {isLoading ? (
                                <tr className="tr_empty">
                                    <td colSpan="10"> {/* 로딩 애니메이션 중앙 배치 */}
                                        <div className="loading">
                                            <span></span> {/* 첫 번째 원 */}
                                            <span></span> {/* 두 번째 원 */}
                                            <span></span> {/* 세 번째 원 */}
                                        </div>
                                    </td>
                                </tr>
                            ) : Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                                filteredProducts.map((product, index) => (
                                    isEditMode === product.productCd ? (
                                        <ProductRow
                                            key={product.productCd}
                                            isEditMode={true}
                                            productData={editableProduct}
                                            topCategory={editableProduct.topCategoryNo || ''}
                                            topCategories={topCategories}
                                            midCategory={editableProduct.middleCategoryNo || ''}
                                            midCategories={filteredEditMiddleCategories}
                                            lowCategory={editableProduct.lowCategoryNo || ''}
                                            lowCategories={filteredEditLowCategories}
                                            handleInputChange={handleInputChange}
                                            onTopChange={handleFilterTopCategoryChangeForEdit}
                                            onMidChange={handleFilterMiddleCategoryChangeForEdit}
                                            onLowChange={handleFilterLowCategoryChangeForEdit}
                                            onSave={handleConfirmClick}
                                            onCancel={handleCancelEdit}
                                        />
                                    ) : (
                                        // 기본 모드
                                        <tr
                                            key={product.productCd}
                                            className={
                                                selectedProducts.includes(product.productCd)
                                                    ? ('selected_row')
                                                    : ''
                                            }
                                        >
                                            <td>
                                                {product.productDeleteYn !== 'Y' ? (
                                                    <label className="chkbox_label">
                                                        {/* 삭제된 상태가 아닌 경우에만 체크박스 표시 */}
                                                        <input
                                                            type="checkbox"
                                                            className="chkbox"
                                                            checked={selectedProducts.includes(product.productCd)}
                                                            onChange={() => handleSelectProduct(product.productCd)}
                                                            disabled={isAddMode || !!isEditMode}
                                                        />
                                                        <i className="chkbox_icon">
                                                            <i className="bi bi-check-lg"></i>
                                                        </i>
                                                    </label>
                                                ) : (
                                                    <span className='label_del'>삭제</span>
                                                )}
                                            </td>
                                            <td><span class="label_level level-1">{product.topCategory ? product.topCategory : '-'}</span></td>
                                            <td><span class="label_level level-2">{product.middleCategory ? product.middleCategory : '-'}</span></td>
                                            <td><span class="label_level level-3">{product.lowCategory ? product.lowCategory : '-'}</span></td>
                                            <td>{product.productCd}</td>
                                            <td>{product.productNm}</td>
                                            <td>{product.productPrice ? product.productPrice.toLocaleString() : '-'}</td>
                                            <td>{product.productInsertDate ? formatDate(product.productInsertDate) : '-'}</td>
                                            <td>{product.productUpdateDate ? formatDate(product.productUpdateDate) : '-'}</td>
                                            <td>{product.productDeleteDate ? formatDate(product.productDeleteDate) : '-'}</td>
                                            <td>
                                                <div className='btn_group'>
                                                    {product.productDeleteYn === 'Y' ? (
                                                        <button className="box icon hover_text restore"
                                                                onClick={() => handleRestore(product.productCd)}>
                                                            <i className="bi bi-arrow-clockwise"></i>{/* 복원 */}
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button className="box icon hover_text detail"
                                                                    onClick={() => handleOpenModal(product.productCd)}>
                                                                <i className="bi bi-file-earmark-text"></i>
                                                            </button>
                                                            <button className="box icon hover_text edit"
                                                                    onClick={() => handleEditClick(product)}>
                                                                <i className="bi bi-pencil-square"></i>{/* 수정 */}
                                                            </button>
                                                            <button className="box icon hover_text del"
                                                                    onClick={() => handleDeleteSelected(product.productCd)}>
                                                                <i className="bi bi-trash"></i>{/* 삭제 */}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr className="tr_empty">
                                    <td colSpan="10">
                                        <div className="no_data"><i className="bi bi-exclamation-triangle"></i>조회된 결과가
                                            없습니다.
                                        </div>
                                    </td>
                                </tr>

                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 컴포넌트*/}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        isLoading={isLoading}
                        pageInputValue={pageInputValue}
                        handlePage={handlePageChange}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageInputChange={handlePageInputChange}
                        handleDeleteSelected={handleDeleteSelected}
                        selectedItems={selectedProducts}
                        showFilters={true}
                    />
                </div>
                {/* 납품 내역 모달 */}
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
