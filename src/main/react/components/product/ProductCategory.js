import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductCategory.css'; // 개별 CSS 스타일 적용
import { formatDate } from "../../util/dateUtils";
import { useHooksList } from './ProductCategoryHooks'; // 상태 및 로직을 처리하는 훅
import CategoryModal from "../common/CategoryAddModal"; // 모달 컴포넌트 임포트
import { useDebounce } from '../common/useDebounce'; // useDebounce 훅 임포트

// 컴포넌트
function ProductCategory() {


    // 🔴 커스텀 훅을 통해 상태와 함수 불러오기
    const {
        category,
        categoryName,
        selectedCategory,
        categoryLevel,
        showModal,
        getTopCategory,
        getMidCategory,
        getLowCategory,
        insertTop,
        insertMid,
        insertLow,
        selectedTopCategory,
        selectedMidCategory,
        selectedLowCategory,
        insertedTopList,
        insertedMidList,
        insertedLowList,
        hoverTop,
        hoverMid,
        hoverLow,
        handleEditButton,
        handleDeleteButton,
        handleAllSelectCategory,
        handleSelectCategory,
        handleInsert,
        handleAddButton,
        openModal,
        closeModal,
        setSelectedTopCategory,
        setSelectedMidCategory,
        setSelectedLowCategory,
        handleTopClick,
        handleMidClick,
        handleLowClick,
        handleTopHover,
    } = useHooksList();


    const [categorySearchText, setCategorySearchText] = useState(''); // 검색어
    const debouncedCategorySearchText = useDebounce(categorySearchText, 300); // 딜레이 적용

    // 🟢 검색어 변경
    const handleCategorySearchTextChange = (event) => {
        setCategorySearchText(event.target.value);
    };

    // 검색어 삭제 버튼 클릭 공통 함수
    const handleSearchDel = (setSearch) => {
        setSearch(''); // 공통적으로 상태를 ''로 설정
    };

    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_category">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">상품 카테고리 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 검색어 입력 */}
                            <div className={`search_box ${categorySearchText ? 'has_text' : ''}`}>
                                <label className={`label_floating ${categorySearchText ? 'active' : ''}`}>카테고리명</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    value={categorySearchText}
                                    onChange={handleCategorySearchTextChange}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {categorySearchText && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setCategorySearchText)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="right">
                            <button className="box color" onClick={openModal}><i class="bi bi-pencil-square"></i> 편집하기</button>
                        </div>
                    </div>
                    <div className="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>카테고리 번호</th>
                                    <th>카테고리 레벨</th>
                                    <th>상위 카테고리</th>
                                    <th>카테고리 이름</th>
                                    <th>카테고리 등록일시</th>
                                    <th>카테고리 수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((category, index) => (
                                    <tr key={category.categoryNo}
                                        className={selectedCategory.includes(category.categoryNo) ? 'selected' : ''}>
                                        <td>{category.categoryNo}</td>
                                        <td>{category.categoryLevel === 1 ? "대분류" :
                                            category.categoryLevel === 2 ? "중분류" :
                                                category.categoryLevel === 3 ? "소분류" : "ㆍ"
                                        }</td>
                                        <td>{category.parentCategoryNo ? category.parentCategoryNo : 'ㆍ'}</td>
                                        <td>{category.categoryNm}</td>
                                        <td>{formatDate(category.categoryInsertDate)}</td>
                                        <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : 'ㆍ'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* 페이지네이션 컴포넌트 사용 */}
                    {/* <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        isLoading={isLoading}
                        pageInputValue={pageInputValue}
                        handlePage={handlePage}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageInputChange={handlePageInputChange}
                    /> */}
                    <div className="pagination-container" style={{ justifyContent: 'space-between' }}>
                        <div className="pagination-sub left">
                            <input type="text" id="itemsPerPage" className="box" min="1" max="100" step="1" value="20" />
                            <label htmlFor="itemsPerPage">
                                건씩 보기 / <b>146</b>건
                            </label>
                        </div>
                        <div className="pagination">
                            <button className="box active">1</button>
                            <button className="box">2</button>
                            <button className="box">3</button>
                            <button className="box">4</button>
                            <button className="box">5</button>
                            <button className="box icon right">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                            <button className="box icon last">
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </div>
                        <div className="pagination-sub right">
                            <input type="text" id="pageInput" className="box" min="1" max="8" step="1" value="1" />
                            <label htmlFor="pageInput">
                                / <b>8</b>페이지
                            </label>
                        </div>
                    </div>

                </div>
            </main>
            {showModal && (
                <CategoryModal
                    // 필요한 props 전달
                    getTopCategory={getTopCategory}
                    getMidCategory={getMidCategory}
                    getLowCategory={getLowCategory}
                    selectedTopCategory={selectedTopCategory}
                    selectedMidCategory={selectedMidCategory}
                    selectedLowCategory={selectedLowCategory}
                    insertTop={insertTop}
                    insertMid={insertMid}
                    insertLow={insertLow}
                    handleInsert={handleInsert}
                    handleAddButton={handleAddButton}
                    handleEditButton={handleEditButton}
                    handleDeleteButton={handleDeleteButton}
                    handleTopClick={handleTopClick}
                    handleMidClick={handleMidClick}
                    handleLowClick={handleLowClick}
                    handleTopHover={handleTopHover}
                    closeModal={closeModal}
                />
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);