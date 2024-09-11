// src/components/product/ProductPrice.js
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 파일 임포트
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택 스타일 임포트
// import ProductPriceModal from './ProductPriceModal'; // 상품 검색 모달 컴포넌트
import {useHooksList} from './ProductPriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅
import {add,format} from 'date-fns';

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
                        <div className="left_content"><span className="title_cnt">총 100건</span></div>
                        <div className="right_content">
                            {/* 추가 버튼 추가 */}
                            <button/>
                            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                <option value={2}>2건씩 보기</option>
                                <option value={10}>10건씩 보기</option>
                                <option value={20}>20건씩 보기</option>
                                <option value={50}>50건씩 보기</option>
                                <option value={100}>100건씩 보기</option>
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
                                        {/* 번호: (현재 페이지 - 1) * 페이지 당 항목 수 + index + 1 */}
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        {/* 고객 이름 */}
                                        <td>{m_price.customerName}</td>
                                        {/* 제품 이름 + 카테고리 */}
                                        <td>
                                            <p>{m_price.productNm}</p>
                                            <p>({m_price.categoryNm})</p>
                                        </td>
                                        {/* 고객별 가격 */}
                                        <td>{m_price.priceCustomer.toLocaleString()}원</td>
                                        {/* 적용 기간 */}
                                        <td>{format(m_price.priceStartDate,'yyyy-MM-dd')} ~ {format(m_price.priceEndDate,'yyyy-MM-dd')}</td>
                                        {/* 등록일시 */}
                                        <td>{format(m_price.priceInsertDate,'yyyy-MM-dd HH:mm')}</td>
                                        {/* 수정일시: 수정일시가 없으면 '-' 표시 */}
                                        <td>{m_price.priceUpdateDate ? format(m_price.priceUpdateDate,'yyyy-MM-dd HH:mm') : '-'}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 버튼들 */}
                    <div className="pagination">

                        {/* '처음' 버튼 */}
                        {currentPage > 1 && (
                            <button className="first" onClick={() => handlePageChange(1)}>
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                        )}

                        {/* '이전' 버튼 */}
                        {currentPage > 1 && (
                            <button className="left" onClick={() => handlePageChange(currentPage - 1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        )}

                        {/* 페이지 번호 블록 계산 (1~5, 6~10 방식) */}
                        {Array.from({length: Math.min(5, totalPages)}, (_, index) => {
                            const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
                            const page = startPage + index;
                            return (
                                page <= totalPages && (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={currentPage === page ? 'active' : ''}
                                    >
                                        {page}
                                    </button>
                                )
                            );
                        })}

                        {/* '다음' 버튼 */}
                        {currentPage < totalPages && (
                            <button className="right" onClick={() => handlePageChange(currentPage + 1)}><i className="bi bi-chevron-right"></i></button>
                        )}

                        {/* '끝' 버튼 */}
                        {currentPage < totalPages && (
                            <button className="last" onClick={() => handlePageChange(totalPages)}>
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        )}
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

