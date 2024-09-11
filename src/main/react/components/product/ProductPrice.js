// src/components/product/ProductPrice.js
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 파일 임포트
import {formatDate} from '../../util/dateUtils'; // 날짜 포맷 함수
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택 스타일 임포트
// import ProductPriceModal from './ProductPriceModal'; // 상품 검색 모달 컴포넌트
import {useHooksList} from './ProductPriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅

// 컴포넌트(고객사별 상품 가격 관리)
function ProductPrice() {

    const {
        priceList,               // [1] 가격 리스트 상태
        itemsPerPage,            // [9] 페이지당 항목 수
        handleItemsPerPageChange,// [29] 페이지당 항목 수 변경 함수
        loading,
        handlePageChange,
        totalPages,
        currentPage,
    } = useHooksList();          // 커스텀 훅 사용

    return (
        <Layout currentMenu="productPrice">
            <div className="menu_product_price">
                <div className="menu_title">고객사별 상품 가격 관리</div>
                <div className="menu_content">
                    <div className="search_wrap">
                    </div>
                    <div className="list_count_wrap">
                        <div className="left_content"><span>총 100건</span></div>
                        <div className="right_content">
                            <span>페이지당 </span>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                <option value={2}>2</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                    <div className="table_wrap">
                        <table>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>고객사</th>
                                <th>상품</th>
                                <th>가격</th>
                                <th>적용기간</th>
                                <th>등록일시</th>
                                <th>수정일시</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* 로딩 중일 때 로딩 이미지 표시 */}
                            {loading ? (
                                <tr>
                                    <td colSpan="7"> {/* 7개의 열을 합쳐 로딩 애니메이션 중앙 배치 */}
                                        <div className="loading">
                                            <span></span> {/* 첫 번째 원 */}
                                            <span></span> {/* 두 번째 원 */}
                                            <span></span> {/* 세 번째 원 */}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                priceList.map((m_price, index) => (
                                    <tr key={m_price.priceNo}>
                                        {/* 번호 (index는 0부터 시작하므로 1을 더해줌) */}
                                        <td>{index + 1}</td>
                                        {/* 고객 이름 */}
                                        <td>{m_price.customerName}</td>
                                        {/* 제품 이름 + 카테고리 */}
                                        <td>
                                            <p>{m_price.productNm}</p>
                                            <p>({m_price.categoryNm})</p>
                                        </td>
                                        {/* 고객별 가격 */}
                                        <td>{m_price.priceCustomer.toLocaleString()}</td>
                                        {/* 적용 기간 */}
                                        <td>{formatDate(m_price.priceStartDate)} ~ {formatDate(m_price.priceEndDate)}</td>
                                        {/* 등록일시 */}
                                        <td>{formatDate(m_price.priceInsertDate)}</td>
                                        {/* 수정일시 */}
                                        <td>{formatDate(m_price.priceUpdateDate)}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 버튼들 */}
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <button
                                key={pageIndex + 1}
                                onClick={() => handlePageChange(pageIndex + 1)}
                                className={currentPage === pageIndex + 1 ? 'active' : ''}
                            >
                                {pageIndex + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ProductPrice/>
    </BrowserRouter>
);

