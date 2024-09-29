// src/main/react/components/price/Price.js
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/Price.css'; // 개별 CSS 파일 임포트
import { format, differenceInDays } from 'date-fns'; // date-fns에서 날짜 포맷과 차이를 계산하는 함수 import
import CustomerSearchModal from '../common/CustomerSearchModal'; // 고객사 검색 모달 임포트
import ProductSearchModal from '../common/ProductSearchModal'; // 상품 검색 모달 임포트
import Pagination from '../common/Pagination'; // 페이지네이션 컴포넌트 임포트
import { useHooksList } from './PriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅
import PriceRow from './PriceRow'; // 분리한 PriceRow 컴포넌트 임포트

// 컴포넌트(고객사별 상품 가격 관리)
function Price() {

    // 🔴 고객사검색, 상품 검색
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({ customerName: '고객사 선택', customerNo: '' });
    const [selectedProduct, setSelectedProduct] = useState({ productNm: '상품 선택', productCd: '', productPrice: 0 });

    // 🔴 고객사 선택 시 모달을 닫고 버튼에 값 설정
    const handleCustomerSelect = (customer) => {
        console.log("🔴 customer.customerName : " + customer.customerName);
        setSelectedCustomer({
            customerName: customer.customerName, // 선택한 고객 이름
            customerNo: customer.customerNo      // 선택한 고객 번호
        });
        setCustomerModalOpen(false);
    };
    1
    // 🔴 상품 선택 시 모달을 닫고 버튼에 값 설정
    const handleProductSelect = (product) => {
        setSelectedProduct({
            productNm: product.productNm,  // 선택된 상품 이름
            productCd: product.productCd,   // 선택된 상품 코드
            productPrice: product.productPrice   // 선택된 상품 가격
        });
        setProductModalOpen(false);
    };

    // 🔴 등록일시 정렬 함수
    const handleSortClick = (field) => {
        const newOrder = sortField === field ? (sortOrder === 'desc' ? 'asc' : 'desc') : 'asc'; // 정렬 필드가 현재 필드와 일치하면 토글, 일치하지 않으면 오름차순부터 시작
        setSortField(field); // 정렬 필드 설정
        setSortOrder(newOrder); // 새로운 정렬 순서 설정
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

        updateDeleteYn,            // 삭제/복원 버튼 클릭 함수
        handleDelete,
        handleRestore,
        handleDeleteSelected,    // 선택 삭제

        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        fetchData,
    } = useHooksList();          // 커스텀 훅 사용

    // 🟡 UI 및 상태에 따라 렌더링
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
                                <label className="label_floating">고객사 입력</label>
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
                                <label className="label_floating">상품명, 상품코드 입력</label>
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
                            <button className="box color" onClick={handleAdd} disabled={isAdding}><i className="bi bi-plus-circle"></i> 추가하기</button>
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
                                                checked={selectAll}
                                                disabled={isAdding || !!editingId}
                                            />
                                            <i className="chkbox_icon">
                                                <i className="bi bi-check-lg"></i>
                                            </i>
                                        </label>
                                    </th>
                                    <th>번호</th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'customer.customerName' ? 'active' : ''}`}>
                                            <span>고객사</span>
                                            <button className="btn_order" onClick={() => handleSortClick('customer.customerName')}>
                                                <i className={`bi ${sortField === 'customer.customerName' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'product.productNm' ? 'active' : ''}`}>
                                            <span>상품</span>
                                            <button className="btn_order" onClick={() => handleSortClick('product.productNm')}>
                                                <i className={`bi ${sortField === 'product.productNm' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceCustomer' ? 'active' : ''}`}>
                                            <span>가격(원)</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceCustomer')}>
                                                <i className={`bi ${sortField === 'priceCustomer' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceStartDate' ? 'active' : ''}`}>
                                            <span>적용시작일</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceStartDate')}>
                                                <i className={`bi ${sortField === 'priceStartDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceEndDate' ? 'active' : ''}`}>
                                            <span>적용종료일</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceEndDate')}>
                                                <i className={`bi ${sortField === 'priceEndDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceInsertDate' ? 'active' : ''}`}>
                                            <span>등록일시</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceInsertDate')}>
                                                <i className={`bi ${sortField === 'priceInsertDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceUpdateDate' ? 'active' : ''}`}>
                                            <span>수정일시</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceUpdateDate')}>
                                                <i className={`bi ${sortField === 'priceUpdateDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortField === 'priceDeleteDate' ? 'active' : ''}`}>
                                            <span>삭제일시</span>
                                            <button className="btn_order" onClick={() => handleSortClick('priceDeleteDate')}>
                                                <i className={`bi ${sortField === 'priceDeleteDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    {/* 수정/삭제 버튼 */}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 추가 상태일 때 새로운 입력 행 추가 */}
                                {isAdding && (
                                    <PriceRow
                                        isEditMode={false} // 등록 모드
                                        priceData={newPriceData}
                                        selectedCustomer={selectedCustomer}
                                        selectedProduct={selectedProduct}
                                        handleInputChange={handleInputChange}
                                        onSave={handleAddSave}
                                        onCancel={handleAddCancel}
                                        setCustomerModalOpen={setCustomerModalOpen}
                                        setProductModalOpen={setProductModalOpen}
                                        setSelectedCustomer={setSelectedCustomer}
                                        setSelectedProduct={setSelectedProduct}
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
                                ) : (
                                    priceList.length > 0 ? (
                                        priceList.map((m_price, index) => (
                                            editingId === m_price.priceNo ? (
                                                <PriceRow
                                                    key={m_price.priceNo}
                                                    isEditMode={true} // 수정 모드
                                                    priceData={editedPriceData}
                                                    selectedCustomer={selectedCustomer}
                                                    selectedProduct={selectedProduct}
                                                    handleInputChange={handleInputChange}
                                                    onSave={handleSaveEdit}
                                                    onCancel={handleCancelEdit}
                                                    setCustomerModalOpen={setCustomerModalOpen}
                                                    setProductModalOpen={setProductModalOpen}
                                                    setSelectedCustomer={setSelectedCustomer}
                                                    setSelectedProduct={setSelectedProduct}
                                                    currentPage={currentPage}
                                                    itemsPerPage={itemsPerPage}
                                                    index={index}
                                                    priceInsertDate={m_price.priceInsertDate}
                                                    priceUpdateDate={m_price.priceUpdateDate}
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
                                                        {/* 삭제된 상태에 따라 조건부 렌더링 */}
                                                        {m_price.priceDeleteYn !== 'Y' ? (
                                                            <label className="chkbox_label">
                                                                <input
                                                                    type="checkbox"
                                                                    className="chkbox"
                                                                    checked={selectedItems.includes(m_price.priceNo)}
                                                                    onChange={() => handleCheckboxChange(m_price.priceNo)}
                                                                    disabled={isAdding || !!editingId}
                                                                />
                                                                <i className="chkbox_icon">
                                                                    <i className="bi bi-check-lg"></i>
                                                                </i>
                                                            </label>
                                                        ) : (
                                                            <span className="label_del">삭제</span>
                                                        )}
                                                    </td>
                                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td>{m_price.customerName}</td>
                                                    <td>
                                                        <p>{m_price.productNm}</p>
                                                        <p style={{ fontSize: '14px', color: '#999', marginTop: '2px' }}>{m_price.categoryPath}</p>
                                                    </td>
                                                    <td><b>{m_price.priceCustomer.toLocaleString()}</b>원</td>
                                                    <td><div className='date_wrap'><i className="bi bi-calendar-check"></i>{format(m_price.priceStartDate, 'yyyy-MM-dd')}</div></td> {/* 적용시작일 */}
                                                    <td>
                                                        <div className='date_wrap'>
                                                            <i className="bi bi-calendar-check"></i>
                                                            {format(m_price.priceEndDate, 'yyyy-MM-dd')} {/* 적용종료일 */}
                                                        </div>
                                                        <span className='diffdays'> (총 {differenceInDays(new Date(m_price.priceEndDate), new Date(m_price.priceStartDate)) + 1}일)</span> {/* 적용기간 표시 */}
                                                    </td>
                                                    <td>{format(m_price.priceInsertDate, 'yy-MM-dd HH:mm')}</td>
                                                    <td>{m_price.priceUpdateDate ? format(m_price.priceUpdateDate, 'yy-MM-dd HH:mm') : '-'}</td>
                                                    <td>{m_price.priceDeleteDate ? format(m_price.priceDeleteDate, 'yy-MM-dd HH:mm') : '-'}</td>
                                                    <td>
                                                        <div className='btn_group'>
                                                            {m_price.priceDeleteYn === 'Y' ? (
                                                                <button className="box icon hover_text restore" onClick={() => handleRestore(m_price.priceNo)}>
                                                                    <i className="bi bi-arrow-clockwise"></i>{/* 복원 */}
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button className="box icon hover_text edit" onClick={() => handleEdit(m_price.priceNo)}>
                                                                        <i className="bi bi-pencil-square"></i>{/* 수정 */}
                                                                    </button>
                                                                    <button className="box icon hover_text del" onClick={() => handleDelete(m_price.priceNo)}>
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
                                                <div className="no_data"><i className="bi bi-exclamation-triangle"></i>조회된 결과가 없습니다.</div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 컴포넌트 사용 */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        isLoading={isLoading}
                        pageInputValue={pageInputValue}
                        handlePage={handlePage}
                        handleItemsPerPageChange={handleItemsPerPageChange}
                        handlePageInputChange={handlePageInputChange}
                        handleDeleteSelected={handleDeleteSelected} // 선택 삭제 함수
                        selectedItems={selectedItems} // 선택된 항목 배열 전달
                        showFilters={true}
                    />

                </div>
            </main>
            {/* 고객사 검색 모달 */}
            {isCustomerModalOpen && (
                <CustomerSearchModal
                    onClose={() => setCustomerModalOpen(false)}
                    onCustomerSelect={handleCustomerSelect}
                />
            )}
            {/* 상품 검색 모달 */}
            {isProductModalOpen && (
                <ProductSearchModal
                    onClose={() => setProductModalOpen(false)}
                    onProductSelect={handleProductSelect}
                />
            )}
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Price />
    </BrowserRouter>
);

