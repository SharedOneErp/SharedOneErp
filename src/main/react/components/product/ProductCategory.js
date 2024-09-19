import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductCategory.css'; // 개별 CSS 스타일 적용
import { formatDate } from "../../util/dateUtils";
import { useHooksList } from './ProductCategoryHooks'; // 상태 및 로직을 처리하는 훅
import CategoryModal from "../common/CategoryAddModal"; // 모달 컴포넌트 임포트

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

    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_category">
                <div className="top-container">
                    <h2>상품 카테고리 관리33</h2>
                </div>

                <div className="middle-container">
                </div>

                <div className="bottom-container">
                    {/* <label>
                    <p>전체 {products.length}건 페이지 당:</p>
                    <select>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label> */}
                    <table className="approval-list">
                        <thead>
                            <tr className='table-tr'>
                                <th><input type="checkbox"
                                    onChange={(e) => handleAllSelectCategory(e.target.checked)} /></th>
                                <th>카테고리 번호</th>
                                <th>카테고리 레벨</th>
                                <th>상위 카테고리</th>
                                <th>카테고리 이름</th>
                                <th>카테고리 등록일시</th>
                                <th>카테고리 수정일시</th>
                            </tr>
                        </thead>
                        <tbody className="approval-list-content">
                            {category.map((category, index) => (
                                <tr key={category.categoryNo}
                                    className={selectedCategory.includes(category.categoryNo) ? 'selected' : ''}>
                                    <td><input type="checkbox"
                                        onChange={() => handleSelectCategory(category.categoryNo)}
                                        checked={selectedCategory.includes(category.categoryNo)} /></td>
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
                    {/* <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div> */}

                    <div className="button-container">
                        <button className="filter-button" onClick={openModal}>등록</button>
                    </div>

                </div>
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
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);