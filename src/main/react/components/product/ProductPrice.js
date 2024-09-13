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
import {add, format} from 'date-fns';

// 컴포넌트(고객사별 상품 가격 관리)
function ProductPrice() {

    const {
        priceList,               // 가격 리스트 상태 (고객사별 상품 가격 데이터를 담고 있는 배열)
        itemsPerPage,            // 페이지당 항목 수 (사용자가 선택한 한 페이지에 표시할 데이터 개수)
        handleItemsPerPageChange,// 페이지당 항목 수 변경 함수 (사용자가 페이지당 몇 개의 항목을 볼지 선택하는 함수)
        loading,                 // 로딩 상태 (데이터를 불러오는 중일 때 true로 설정)
        handlePageChange,        // 페이지 변경 함수 (사용자가 페이지를 이동할 때 호출하는 함수)
        totalPages,              // 총 페이지 수 (전체 데이터에서 페이지당 항목 수로 나눈 페이지 개수)
        currentPage,             // 현재 페이지 (사용자가 현재 보고 있는 페이지 번호)
        isAdding,                // 추가 상태 (추가 버튼을 눌러 새로운 입력 행을 보여줄지 여부를 나타내는 상태)
        setIsAdding,
        newPriceData,
        handleInputChange,
        handleAddNewPrice,
        handleCancelAdd,
        editingId,
        editedPriceData,
    } = useHooksList();          // 커스텀 훅 사용

    return (
        <Layout currentMenu="productPrice">
            <main className="main-content menu_price">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">고객사별 상품 가격 관리</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                    </div>
                    <div className="list_count_wrap">
                        <div className="left_content"><span className="title_cnt">총 100건</span></div>
                        <div className="right_content">
                            <button className="btn_add" onClick={() => setIsAdding(true)}><i className="bi bi-plus-circle"></i> 추가하기</button>
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
                                <th></th>
                                {/* 수정/삭제 버튼 열 추가 */}
                            </tr>
                            </thead>
                            <tbody>
                            {/* 추가 상태일 때 새로운 입력 행 추가 */}
                            {isAdding && (
                                <tr>
                                    <td></td>
                                    <td><input type="text" name="customerName" value={newPriceData.customerName} onChange={handleInputChange}/></td>
                                    <td><input type="text" name="productNm" value={newPriceData.productNm} onChange={handleInputChange}/></td>
                                    <td><input type="number" name="priceCustomer" value={newPriceData.priceCustomer} onChange={handleInputChange}/></td>
                                    <td>
                                        <DatePicker
                                            selected={newPriceData.priceStartDate}
                                            onChange={(date) => handleDateChange('priceStartDate', date)}
                                            dateFormat="yyyy-MM-dd"
                                        /> ~
                                        <DatePicker
                                            selected={newPriceData.priceEndDate}
                                            onChange={(date) => handleDateChange('priceEndDate', date)}
                                            dateFormat="yyyy-MM-dd"
                                        />
                                    </td>
                                    <td>-</td>
                                    {/* 등록일시 */}
                                    <td>-</td>
                                    {/* 수정일시 */}
                                    <td>
                                        <button onClick={handleAddNewPrice}>등록</button>
                                        <button onClick={handleCancelAdd}>취소</button>
                                    </td>
                                </tr>
                            )}
                            {/* 기존 가격 리스트 -> 로딩 중일 때 로딩 이미지 표시 */}
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
                                        <td>{format(m_price.priceStartDate, 'yyyy-MM-dd')} ~ {format(m_price.priceEndDate, 'yyyy-MM-dd')}</td>
                                        {/* 등록일시 */}
                                        <td>{format(m_price.priceInsertDate, 'yyyy-MM-dd HH:mm')}</td>
                                        {/* 수정일시: 수정일시가 없으면 '-' 표시 */}
                                        <td>{m_price.priceUpdateDate ? format(m_price.priceUpdateDate, 'yyyy-MM-dd HH:mm') : '-'}</td>
                                        <td>
                                            {editingId === m_price.priceNo ? (
                                                <>
                                                    <button onClick={handleSaveEdit}>저장</button>
                                                    <button onClick={handleCancelEdit}>취소</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleEdit(m_price.priceNo)}>수정</button>
                                                    <button onClick={() => handleDelete(m_price.priceNo)}>삭제</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 버튼들 */}
                    <div className="pagination">

                        <div className="pagination-left"> {/* 좌측 정렬을 위한 래퍼 */}
                            <input
                                type="number"
                                className="input-box"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                min={1}    // 최소값 설정
                                max={100}  // 최대값 설정
                                step={1}   // 1씩 증가/감소 가능
                            />건씩 보기
                        </div>

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
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ProductPrice/>
    </BrowserRouter>
);

