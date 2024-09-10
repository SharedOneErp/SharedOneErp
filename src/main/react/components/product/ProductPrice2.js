// src/components/product/ProductPrice.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 파일 임포트
import { formatDate } from '../../util/dateUtils'; // 날짜 포맷 함수
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택 스타일 임포트
import axios from 'axios'; // HTTP 요청을 위한 라이브러리
import ProductPriceModal from './ProductPriceModal'; // 상품 검색 모달 컴포넌트
import { useHooksList } from './ProductPriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅

function ProductPrice() {

    const {
        priceList,               // [1] 가격 리스트 상태
        selectedCustomer,        // [2] 선택된 고객사
        setSelectedCustomer,     // [3] 고객사 설정 함수
        selectedProduct,         // [4] 선택된 상품
        setSelectedProduct,      // [5] 상품 설정 함수
        isModalOpen,             // [6] 모달 열림 상태
        editIndex,               // [7] 수정 중인 항목 인덱스
        setEditIndex,            // [8] 수정 중인 항목 인덱스 설정 함수
        itemsPerPage,            // [9] 페이지당 항목 수
        setItemsPerPage,         // [10] 페이지당 항목 수 설정 함수
        currentPage,             // [11] 현재 페이지
        setCurrentPage,          // [12] 현재 페이지 설정 함수
        sortField,               // [13] 정렬 필드
        sortOrder,               // [14] 정렬 순서
        startDate,               // [15] 시작 날짜
        setStartDate,            // [16] 시작 날짜 설정 함수
        endDate,                 // [17] 종료 날짜
        setEndDate,              // [18] 종료 날짜 설정 함수
        paginatedList,           // [19] 페이지네이션 처리된 리스트
        totalPages,              // [20] 총 페이지 수
        handleAddPrice,          // [21] 가격 항목 추가 함수
        handleChange,            // [22] 폼 데이터 변경 함수
        handleDelete,            // [23] 항목 삭제 함수
        handleEdit,              // [24] 수정 모드로 변경하는 함수
        handleSave,              // [25] 수정 완료 후 저장 함수
        openModal,               // [26] 모달 열기 함수
        closeModal,              // [27] 모달 닫기 함수
        handleProductSelect,     // [28] 상품 선택 시 호출되는 함수
        handleItemsPerPageChange,// [29] 페이지당 항목 수 변경 함수
        handleSort,              // [30] 정렬을 위한 함수
        handlePageChange,        // [31] 페이지 변경 함수
    } = useHooksList();          // 커스텀 훅 사용

    return (
        <Layout currentMenu="productList">
            <div className="top-container">
                <h2>고객사별 상품 가격 관리</h2>
                {/* 검색 영역 */}
                <div className="search-section">
                    <div>
                        <label>고객사 선택: </label>
                        <input
                            type="text"
                            placeholder="고객사 입력"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)} // 고객사 선택
                        />
                    </div>

                    <div>
                        <label>상품 선택: </label>
                        <button type="button" onClick={openModal}>
                            {selectedProduct || '상품 검색'} {/* 선택된 상품 또는 "상품 검색" 표시 */}
                        </button>
                    </div>

                    <div>
                        <label>시작 날짜: </label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>

                    <div>
                        <label>종료 날짜: </label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>

                    <button onClick={() => setCurrentPage(1)}>검색</button> {/* 검색 버튼 */}
                </div>

                <form>
                    {/* 테이블 헤더 */}
                    <div className="table-header">
                        <div onClick={() => handleSort('customer')}>고객사</div>
                        <div onClick={() => handleSort('product')}>상품</div>
                        <div>가격</div>
                        <div onClick={() => handleSort('startDate')}>시작 날짜</div>
                        <div onClick={() => handleSort('endDate')}>종료 날짜</div>
                        <div>등록일시</div>
                        <div>수정일시</div>
                    </div>

                    {/* 테이블 내용 */}
                    {paginatedList.map((priceItem, index) => (
                        <div key={priceItem.id} className="price-row">
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        value={priceItem.customer}
                                        onChange={(e) => handleChange(index, 'customer', e.target.value)}
                                    />
                                ) : (
                                    priceItem.customer
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        value={priceItem.product}
                                        onChange={(e) => handleChange(index, 'product', e.target.value)}
                                    />
                                ) : (
                                    priceItem.product
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="number"
                                        value={priceItem.price}
                                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                                    />
                                ) : (
                                    priceItem.price
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <DatePicker
                                        selected={new Date(priceItem.startDate)}
                                        onChange={(date) => handleChange(index, 'startDate', date)}
                                    />
                                ) : (
                                    new Date(priceItem.startDate).toLocaleDateString()
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <DatePicker
                                        selected={new Date(priceItem.endDate)}
                                        onChange={(date) => handleChange(index, 'endDate', date)}
                                    />
                                ) : (
                                    new Date(priceItem.endDate).toLocaleDateString()
                                )}
                            </div>
                            <div>{new Date(priceItem.createdAt).toLocaleString()}</div>
                            <div>{new Date(priceItem.updatedAt).toLocaleString()}</div>
                            <div>
                                {editIndex === index ? (
                                    <button type="button" onClick={handleSave}>
                                        저장
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => handleEdit(index)}>
                                        수정
                                    </button>
                                )}
                                <button type="button" onClick={() => handleDelete(index)}>
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddPrice}>
                        추가
                    </button>
                </form>

                <div>
                    <label>보기: </label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* 페이지네이션 */}
                <div>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            disabled={currentPage === i + 1} // 현재 페이지 비활성화
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* 상품 검색 모달 */}
                <ProductPriceModal isOpen={isModalOpen} onClose={closeModal} onSelect={handleProductSelect} />
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ProductPrice />
    </BrowserRouter>
);
