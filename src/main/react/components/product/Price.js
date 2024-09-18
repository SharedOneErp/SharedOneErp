// src/main/react/components/product/Price.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/Price.css'; // 개별 CSS 파일 임포트
// import PriceModal from './PriceModal'; // 상품 검색 모달 컴포넌트
import { useHooksList } from './PriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅
import { add, format } from 'date-fns';
import CustomerSearchModal from '../common/CustomerSearchModal'; // 고객사 검색 모달 임포트
import ProductSearchModal from '../common/ProductSearchModal'; // 상품 검색 모달 임포트

// 컴포넌트(고객사별 상품 가격 관리)
function Price() {

    // 🔴 고객사검색, 상품 검색
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('고객사 선택');
    const [selectedProduct, setSelectedProduct] = useState('상품 선택');

    // 고객사 선택 시 모달을 닫고 버튼에 값 설정
    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer.customerName);
        setCustomerModalOpen(false);
    };

    // 상품 선택 시 모달을 닫고 버튼에 값 설정
    const handleProductSelect = (product) => {
        setSelectedProduct(product.productNm);
        setProductModalOpen(false);
    };

    // 🔴 커스텀 훅을 통해 상태와 함수 불러오기
    const {
        priceList,               // 가격 리스트 상태 (고객사별 상품 가격 데이터를 담고 있는 배열)
        isLoading,               // 로딩 상태 (데이터를 불러오는 중일 때 true로 설정)

        totalItems,              // 전체 항목 수 상태
        itemsPerPage,            // 페이지당 항목 수 (사용자가 선택한 한 페이지에 표시할 데이터 개수)
        handleItemsPerPageChange,// 페이지당 항목 수 변경 함수 (사용자가 페이지당 몇 개의 항목을 볼지 선택하는 함수)

        handlePage,         // 페이지 변경 함수 (사용자가 페이지를 이동할 때 호출하는 함수)
        totalPages,              // 총 페이지 수 (전체 데이터에서 페이지당 항목 수로 나눈 페이지 개수)
        currentPage,             // 현재 페이지 (사용자가 현재 보고 있는 페이지 번호)

        pageInputValue,          // 페이지 입력 필드의 값
        handlePageInputChange,   // 페이지 입력값 변경 함수 (입력된 페이지 번호를 변경하는 함수)

        customerSearchText,              // 검색어 상태(고객사)
        setCustomerSearchText,
        handleCustomerSearchTextChange,
        productSearchText,              // 검색어 상태(상품)
        setProductSearchText,
        handleProductSearchTextChange,

        startDate,               // 시작 날짜 상태
        setStartDate,
        handleStartDateChange,
        endDate,                 // 종료 날짜 상태
        setEndDate,
        handleEndDateChange,
        targetDate,              // 적용 대상 날짜 상태
        setTargetDate,
        handleTargetDateChange,
        handleSearchDel,         // 공통 검색어/검색날짜 삭제 함수

        isCurrentPriceChecked,
        setIsCurrentPriceChecked,
        selectedStatus,          // 선택된 상태 (전체/정상/삭제)
        handleStatusChange,      // 상태 변경 함수 (전체/정상/삭제 상태 변경)

        selectedItems,           // 선택된 항목 ID 배열
        selectAll,               // 전체 선택 여부 상태
        handleCheckboxChange,    // 개별 체크박스 선택/해제 함수
        handleSelectAllChange,   // 전체 선택/해제 체크박스 클릭 함수

        isAdding,                // 추가 상태 (새로운 항목 추가 버튼 클릭 여부)
        newPriceData,            // 새로운 가격 데이터를 담는 상태
        setIsAdding,             // 추가 상태 변경 함수 (추가하기 버튼 클릭 시 추가 상태 전환)
        handleInputChange,       // 입력값 변경 함수 (사용자가 입력한 값이 상태에 반영됨)
        handleAdd,
        handleAddSave,       // 새로운 가격을 추가하는 함수 (저장 버튼 클릭)
        handleAddCancel,         // 추가 상태 취소 함수 (취소 버튼 클릭)

        handleEdit,              // 수정 버튼 클릭 함수 (수정 모드로 전환)
        editingId,               // 수정 중인 항목 ID (현재 수정 중인 항목의 ID)
        editedPriceData,         // 수정 중인 항목 데이터를 담는 상태
        handleSaveEdit,          // 수정 저장 함수 (수정된 데이터를 저장하는 함수)
        handleCancelEdit,        // 수정 취소 함수 (수정 모드를 취소)

        handleDelete,            // 삭제 버튼 클릭 함수 (항목을 삭제하는 함수)
    } = useHooksList();          // 커스텀 훅 사용

    // 🔴 PriceRow 컴포넌트를 상위 컴포넌트 내부에 정의
    const PriceRow = ({ isEditMode, priceData, onSave, onCancel, handleInputChange }) => {
        return (
            <tr className='tr_input'>
                <td>-</td> {/* 체크박스 칸 */}
                <td>-</td> {/* 번호 */}
                <td>
                    {/* 고객사 검색 버튼 */}
                    <button
                        className="box btn_search wp100"
                        onClick={() => setCustomerModalOpen(true)}>
                        {selectedCustomer}
                        <i className="bi bi-search"></i>
                    </button>
                    {/* hidden input 필드 */}
                    <input
                        type="hidden"
                        name="selectedCustomerNo"
                        value={selectedCustomer ? selectedCustomer.customerNo : ''}
                    />
                    {/* 고객사 검색 모달 */}
                    {isCustomerModalOpen && (
                        <CustomerSearchModal
                            onClose={() => setCustomerModalOpen(false)}
                            onCustomerSelect={handleCustomerSelect}
                        />
                    )}
                </td>
                <td>
                    {/* 상품 검색 버튼 */}
                    <button
                        className="box btn_search wp100"
                        onClick={() => setProductModalOpen(true)}>
                        {selectedProduct}
                        <i className="bi bi-search"></i>
                    </button>
                    {/* hidden input 필드 */}
                    <input
                        type="hidden"
                        name="selectedProductCd"
                        value={selectedProduct ? selectedProduct.ProductCd : ''}
                    />
                    {/* 상품 검색 모달 */}
                    {isProductModalOpen && (
                        <ProductSearchModal
                            onClose={() => setProductModalOpen(false)}
                            onProductSelect={handleProductSelect}
                        />
                    )}
                </td>
                <td>
                    <input
                        type="number"
                        className="box wp100"
                        placeholder="가격 입력"
                        value={priceData.priceCustomer}
                        name="priceCustomer"
                        onChange={handleInputChange}
                    />
                </td>
                <td>
                    <div className='period_box'>
                        <input
                            type="date"
                            className="box"
                            placeholder="시작일"
                            value={priceData.priceStartDate || ''}
                            name="priceStartDate"
                            onChange={handleInputChange}
                        />
                        ~
                        <input
                            type="date"
                            className="box"
                            placeholder="종료일"
                            value={priceData.priceEndDate || ''}
                            name="priceEndDate"
                            onChange={handleInputChange}
                        />
                    </div>
                </td>
                <td>-</td> {/* 등록일시 */}
                <td>-</td> {/* 수정일시 */}
                <td>-</td> {/* 삭제일시 */}
                <td>
                    <div className='btn_group'>
                        {isEditMode ? (
                            <>
                                <button className="box small color_border" onClick={onSave}>수정</button>
                                <button className="box small" onClick={onCancel}>취소</button>
                            </>
                        ) : (
                            <>
                                <button className="box small color_border" onClick={onSave}>추가</button>
                                <button className="box small" onClick={onCancel}>취소</button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    // 🔴 UI 및 상태에 따라 렌더링
    return (
        <Layout currentMenu="productPrice">
            <main className="main-content menu_price">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">고객사별 상품 가격 관리</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 1️⃣ 오늘 적용되는 가격만 보기 (체크박스) */}
                            <div className="checkbox_box">
                                <input
                                    type="checkbox"
                                    id="currentPrice"
                                    name="status"
                                    checked={isCurrentPriceChecked} // 체크박스 상태
                                    onChange={(e) => setIsCurrentPriceChecked(e.target.checked)} // 체크 상태 업데이트
                                />
                                <label htmlFor="currentPrice"><i className="bi bi-check-lg"></i> 오늘</label>
                            </div>
                            {/* 2️⃣ 적용 대상일(ex. 내일 적용되는 가격들만 보기) */}
                            <div className={`date_box ${targetDate ? 'has_text' : ''}`}>
                                <label>적용 대상일</label>
                                <input
                                    type="date"
                                    max="9999-12-31"
                                    value={targetDate || ''}
                                    onChange={(e) => handleTargetDateChange(e.target.value)}
                                />
                                {/* 날짜 삭제 버튼 */}
                                {targetDate && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setTargetDate)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {/* 3️⃣ 검색어 입력 */}
                            <div className={`search_box ${customerSearchText ? 'has_text' : ''}`}>
                                <label className={`label_floating ${customerSearchText ? 'active' : ''}`}>고객사</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    value={customerSearchText}
                                    onChange={handleCustomerSearchTextChange}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {customerSearchText && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setCustomerSearchText)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <div className={`search_box ${productSearchText ? 'has_text' : ''}`}>
                            <label className={`label_floating ${customerSearchText ? 'active' : ''}`}>상품명, 상품코드</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    value={productSearchText}
                                    onChange={handleProductSearchTextChange}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {productSearchText && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setProductSearchText)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {/* 4️⃣ 적용 기간 입력(ex. 25년 1월 1일부터 적용되는 가격들만 보기) */}
                            <div className={`date_box ${startDate ? 'has_text' : ''}`}>
                                <label>적용 시작일</label>
                                <input
                                    type="date"
                                    max="9999-12-31"
                                    value={startDate || ''}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                />
                                {/* 날짜 삭제 버튼 */}
                                {startDate && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setStartDate)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <div className={`date_box ${endDate ? 'has_text' : ''}`}>
                                <label>적용 종료일</label>
                                <input
                                    type="date"
                                    max="9999-12-31"
                                    value={endDate || ''}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                />
                                {/* 날짜 삭제 버튼 */}
                                {endDate && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setEndDate)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            {/* 5️⃣ 상태 선택 */}
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
                            <button className="box color" onClick={handleAdd}><i className="bi bi-plus-circle"></i> 추가하기</button>
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
                                                onChange={handleSelectAllChange}
                                            />
                                            <i className="chkbox_icon">
                                                <i className="bi bi-check-lg"></i>
                                            </i>
                                        </label>
                                    </th>
                                    <th>번호</th>
                                    <th>고객사</th>
                                    <th>상품</th>
                                    <th>가격</th>
                                    <th>적용기간</th>
                                    <th>등록일시</th>
                                    <th>수정일시</th>
                                    <th>삭제일시</th>
                                    {/* 수정/삭제 버튼 */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 추가 상태일 때 새로운 입력 행 추가 */}
                                {isAdding && (
                                    <PriceRow
                                        isEditMode={false} // 등록 모드🔴
                                        priceData={newPriceData} // 새로운 데이터
                                        onSave={handleAddSave} // 저장 함수
                                        onCancel={handleAddCancel} // 취소 함수
                                        handleInputChange={handleInputChange} // 입력값 변경 함수
                                    />
                                )}
                                {/* 로딩 중일 때 로딩 이미지 표시 */}
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="10"> {/* 로딩 애니메이션 중앙 배치 */}
                                            <div className="loading">
                                                <span></span> {/* 첫 번째 원 */}
                                                <span></span> {/* 두 번째 원 */}
                                                <span></span> {/* 세 번째 원 */}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    priceList.length > 0 ? (
                                        priceList.map((m_price, index) => (
                                            editingId === m_price.priceNo ? (
                                                <PriceRow
                                                    key={m_price.priceNo}
                                                    isEditMode={true} // 수정 모드🔴
                                                    priceData={editedPriceData} // 수정 중인 데이터
                                                    onSave={handleSaveEdit} // 수정 저장 함수
                                                    onCancel={handleCancelEdit} // 수정 취소 함수
                                                    handleInputChange={handleInputChange} // 입력값 변경 함수
                                                />
                                            ) : (
                                                // 수정 모드가 아닐 경우 기존 데이터를 보여줌
                                                <tr key={m_price.priceNo}
                                                    className={
                                                        selectedItems.includes(m_price.priceNo)
                                                            ? ('selected_row')  // 선택된 행
                                                            : ''
                                                    }
                                                >
                                                    <td>
                                                        <label className="chkbox_label">
                                                            <input
                                                                type="checkbox"
                                                                className="chkbox"
                                                                checked={selectedItems.includes(m_price.priceNo)}
                                                                onChange={() => handleCheckboxChange(m_price.priceNo)}
                                                            />
                                                            <i className="chkbox_icon">
                                                                <i className="bi bi-check-lg"></i>
                                                            </i>
                                                        </label>
                                                    </td>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{m_price.customerName}</td>
                                                    <td>
                                                        <p>{m_price.productNm}</p>
                                                        <p style={{ fontSize: '14px', color: '#999', marginTop: '2px' }}>{m_price.categoryNm}</p>
                                                    </td>
                                                    <td><b>{m_price.priceCustomer.toLocaleString()}</b>원</td>
                                                    <td>{`${format(m_price.priceStartDate, 'yyyy-MM-dd')} ~ ${format(m_price.priceEndDate, 'yyyy-MM-dd')}`}</td>
                                                    <td>{format(m_price.priceInsertDate, 'yy-MM-dd HH:mm')}</td>
                                                    <td>{m_price.priceUpdateDate ? format(m_price.priceUpdateDate, 'yy-MM-dd HH:mm') : '-'}</td>
                                                    <td>{m_price.priceDeleteDate ? format(m_price.priceDeleteDate, 'yy-MM-dd HH:mm') : '-'}</td>
                                                    <td>
                                                        <div className='btn_group'>
                                                            <button className="box icon" onClick={() => handleEdit(m_price.priceNo)}>
                                                                <i className="bi bi-pencil-square"></i>{/* 수정 */}
                                                            </button>
                                                            <button className="box icon" onClick={() => handleDelete(m_price.priceNo)}>
                                                                <i className="bi bi-trash3"></i>{/* 삭제 */}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10">
                                                <div className="no_data"><i className="bi bi-exclamation-triangle"></i>조회된 결과가 없습니다.</div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 버튼들 */}
                    <div className="pagination-container">

                        <div className="pagination-sub left"> {/* 좌측 정렬을 위한 래퍼 */}
                            <input
                                type="text"
                                id="itemsPerPage"
                                className="box"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                min={1}    // 최소값 설정
                                max={100}  // 최대값 설정
                                step={1}   // 1씩 증가/감소 가능
                            />
                            <label htmlFor="itemsPerPage">건씩 보기 / <b>{isLoading ? '-' : totalItems}</b>건</label>
                        </div>

                        {/* 가운데: 페이지네이션 */}
                        <div className="pagination">

                            {/* '처음' 버튼 */}
                            {currentPage > 1 && (
                                <button className="box icon first" onClick={() => handlePage(1)}>
                                    <i className="bi bi-chevron-double-left"></i>
                                </button>
                            )}

                            {/* '이전' 버튼 */}
                            {currentPage > 1 && (
                                <button className="box icon left" onClick={() => handlePage(currentPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            )}

                            {/* 페이지 번호 블록 계산 (1~5, 6~10 방식) */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                                const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
                                const page = startPage + index;
                                return (
                                    page <= totalPages && (
                                        <button
                                            key={page}
                                            onClick={() => handlePage(page)}
                                            className={currentPage === page ? 'box active' : 'box'}
                                        >
                                            {page}
                                        </button>
                                    )
                                );
                            })}

                            {/* '다음' 버튼 */}
                            {currentPage < totalPages && (
                                <button className="box icon right" onClick={() => handlePage(currentPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            )}

                            {/* '끝' 버튼 */}
                            {currentPage < totalPages && (
                                <button className="box icon last" onClick={() => handlePage(totalPages)}>
                                    <i className="bi bi-chevron-double-right"></i>
                                </button>
                            )}
                        </div>

                        {/* 오른쪽: 페이지 번호 입력 */}
                        <div className="pagination-sub right">
                            <input
                                type="text"
                                id="pageInput"
                                className="box"
                                value={pageInputValue} /* 상태로 관리되는 입력값 */
                                onChange={handlePageInputChange}
                                min={1}    // 최소값 설정
                                max={totalPages}
                                step={1}   // 1씩 증가/감소 가능
                            />
                            <label htmlFor="pageInput">/ <b>{totalPages}</b>페이지</label>
                        </div>

                    </div>

                </div>
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Price />
    </BrowserRouter>
);

