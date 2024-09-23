import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, useSearchParams } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import { useHooksList } from './OrderHooks'; // 상태 및 로직을 처리하는 훅
import '../../../resources/static/css/sales/Order.css';



function Order() {

    const [role, setRole] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isDenied, setIsDenied] = useState(false);


    const fetchEmployee = async () => {
        try {
            const response = await fetch('/api/employee', {
                credentials: "include", // 세션 포함
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('사용자 정보를 가져오는 데 실패했습니다.');
                return null;
            }
        } catch (error) {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empData = await fetchEmployee();
                if (empData) {
                    setRole(empData.employeeRole);
                }
            } catch (err) {
                alert('해당 페이지에 접근 권한이 없습니다.');
                window.location.href = '/main';
            } finally {
            }
        };
        fetchData();
    }, []);


    const updateOrderStatus = async (orderNo, status, message) => {

        const userConfirmed = confirm(message);
        if (!userConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/order/updateStatus/${orderNo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderHStatus: status }),
            });
            if (response.ok) {
                alert('주문 상태가 업데이트되었습니다.');
            } else {
                throw new Error('주문 상태 업데이트 실패');
            }
        } catch (error) {
            alert('주문 상태를 업데이트하는 중 오류 발생');
        }
    };

    const handleApproveOrder = async () => {
        try {
            await updateOrderStatus(orderNo, 'approved', '해당 주문을 승인하시겠습니까? 이 결정은 되돌릴 수 없습니다.');
            setIsApproved(true); // 승인 상태로 변경
        } catch (error) {
            alert('주문 승인 중 오류 발생');
        }
    };

    const handleDeniedOrder = async () => {
        try {
            await updateOrderStatus(orderNo, 'denied', '해당 주문을 반려하시겠습니까? 이 결정은 되돌릴 수 없습니다.');
            setIsDenied(true); // 반려 상태로 변경
        } catch (error) {
            alert('주문 반려 중 오류 발생');
        }
    };


    // 🔴 커스텀 훅을 통해 상태와 함수 불러오기
    const {
        // 주문 모드 관련 상태
        isCreateMode,  // 현재 주문이 등록 모드인지 확인
        isEditMode,    // 현재 주문이 수정 모드인지 확인
        isDetailView,  // 현재 주문이 상세보기 모드인지 확인

        // 주문 번호 관련 상태
        orderNo,       // 현재 주문 번호


        // 주문 관련 데이터 및 상태
        products,           // 상품 리스트
        customerData,       // 고객사 정보
        orderDetails,       // 주문 상세 정보
        orderHTotalPrice,   // 주문 총액
        orderHInsertDate,   // 주문 등록일
        deliveryDate,       // 납품 요청일
        employee,           // 담당자 정보 (로그인한 사용자 정보)

        // 모달 관련 상태 및 함수
        showModal,              // 상품 검색 모달 상태
        customerModalOpen,      // 고객사 검색 모달 상태
        openModal,              // 상품 검색 모달 열기
        closeModal,             // 상품 검색 모달 닫기
        openCustomerModal,      // 고객사 검색 모달 열기
        closeCustomerModal,     // 고객사 검색 모달 닫기
        handleCustomerSelect,   // 고객사 선택 처리 함수

        // 검색 관련 상태 및 함수
        searchQuery,            // 검색어 상태 (상품명 검색어)
        setSearchQuery,         // 검색어 상태 설정 함수
        searchCode,             // 상품 코드 검색어 상태
        setSearchCode,          // 상품 코드 검색어 상태 설정 함수
        handleSearch,           // 상품 검색 처리 함수
        customerSearch,         // 고객사 검색 처리 함수
        searchResults,          // 상품 검색 결과
        customerSearchResults,  // 고객사 검색 결과

        // 상품 및 주문 상세 데이터 변경 함수
        handleProductChange,    // 상품 데이터 변경 처리 함수 (등록 시)
        handleProductEdit,      // 상품 수정 데이터 변경 처리 함수 (수정 시)
        addProductRow,          // 상품 행 추가 함수
        removeProductRow,       // 상품 행 제거 함수
        removeProducteditRow,   // 상품 수정 행 제거 함수
        handleProductSelect,    // 상품 선택 처리 함수 (등록 시)
        handleProductSelectEdit,// 상품 수정 시 선택 처리 함수

        // 페이지네이션 관련 상태 및 함수
        currentPageProduct,         // 상품 모달의 현재 페이지 상태
        setCurrentPageProduct,      // 상품 모달의 현재 페이지 상태 설정 함수
        handlePageChangeProduct,    // 상품 모달의 페이지 변경 처리 함수
        currentPageCustomer,        // 고객사 모달의 현재 페이지 상태
        setCurrentPageCustomer,     // 고객사 모달의 현재 페이지 상태 설정 함수
        handlePageChangeCustomer,   // 고객사 모달의 페이지 변경 처리 함수
        paginatedSearchResults,     // 페이지네이션된 상품 검색 결과
        paginatedCustomerSearchResults, // 페이지네이션된 고객사 검색 결과
        totalProductPages,          // 상품 검색 결과의 총 페이지 수
        totalCustomerPages,         // 고객사 검색 결과의 총 페이지 수

        // 주문 생성 및 수정 함수
        handleSubmit,   // 주문 생성 처리 함수
        handleEdit,     // 주문 수정 처리 함수

        // 날짜 관련 함수
        formatDateForInput,  // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수

        // 카테고리 선택 관련 상태 및 함수
        selectedCategory,      // 선택된 카테고리 (대분류, 중분류, 소분류)
        setSelectedCategory,   // 카테고리 선택 상태 설정 함수
        handleTopChange,       // 대분류 카테고리 변경 처리 함수
        handleMiddleChange,    // 중분류 카테고리 변경 처리 함수
        categories,            // 카테고리 데이터 (대분류, 중분류, 소분류)

        displayItems,
        editProductRow,
        displayItemEdit,
    } = useHooksList();



    return (
        <Layout currentMenu="order">
            <main className="main-content menu_order">
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">{isCreateMode ? '주문 등록' : isEditMode ? '주문 수정' : '주문 상세보기'}</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            <div className="form-row">
                                {orderNo && (
                                    <div className="form-group">
                                        <label>주문번호</label>
                                        <input type="text" value={orderNo} readOnly className="box readonly" />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>고객사</label>
                                    <input type="hidden" className="box" name="customerNo" value={customerData.customerNo} readOnly />
                                    {/*위는 주문 생성 , 아래는 수정과 변경*/}
                                    <input type="text" className="box" name="customerName" value={customerData.customerName || ''}
                                        placeholder="고객사 선택" readOnly />
                                    <button
                                        className="search-button"
                                        onClick={openCustomerModal}
                                        style={{ display: !isEditMode && !isCreateMode ? 'none' : 'block' }}
                                    >
                                        <i className="bi bi-search"></i>
                                    </button>

                                </div>

                                {!isCreateMode && (
                                    <>
                                        <div className="form-group">
                                            <label>물품 총액</label>
                                            <span className="orderHtotal-price"> {orderHTotalPrice.toLocaleString()}원</span>
                                        </div>
                                        <div className="form-group">
                                            <label>주문 등록일</label>
                                            <input type="date" value={formatDateForInput(orderHInsertDate) || ''} readOnly
                                                className="readonly box" />

                                        </div>
                                    </>
                                )}

                                <div className="form-group">
                                    {/*위는 주문 생성 , 아래는 수정과 변경*/}
                                    <label>납품요청일</label>
                                    <input type="date" className="delivery-date box" defaultValue={formatDateForInput(orderDetails[0]?.orderDDeliveryRequestDate)} readOnly={isDetailView} />
                                </div>

                                <div className="form-group">
                                    <label>담당자</label>
                                    <span className="employee-id" style={{ display: 'none' }}>{employee ? (
                                        <>
                                            {employee.employeeId}
                                        </>
                                    ) : (
                                        'LOADING'
                                    )}</span>
                                    <span className="employee-name">{employee ? (
                                        <>
                                            {employee.employeeName}
                                        </>
                                    ) : (
                                        'LOADING'
                                    )}


                                    </span>
                                </div>
                                <div className="form-group">
                                    <label>주소</label>
                                    <input type="text" className="box" name="customerAddrx" value={customerData.customerAddr || ''}
                                        placeholder="고객사 선택" readOnly />
                                </div>

                                <div className="form-group">
                                    <label>연락처</label>
                                    <input type="text" className="box" name="customerTel" value={customerData.customerTel || ''}
                                        placeholder="고객사 선택" readOnly />
                                </div>

                                <div className="form-group">
                                    <label>대표명</label>
                                    <input type="text" className="box" name="customerRepresentativeName"
                                        value={customerData.customerRepresentativeName || ''}
                                        placeholder="고객사 선택" readOnly />
                                </div>

                                <div
                                    className="form-group"
                                    style={{ display: isCreateMode ? 'none' : 'block' }}
                                >
                                    <label>주문 상태</label>
                                    <span style={{ display: 'none' }} className="order-status"></span>
                                </div>
                            </div>

                        </div>
                        <div className="right">
                            {/* 제품 추가 버튼 - 생성 모드 또는 수정 모드에서만 표시 */}
                            {(isCreateMode || isEditMode) && (
                                <button className="box color" onClick={isCreateMode ? addProductRow : editProductRow}><i className="bi bi-plus-circle"></i> 추가하기</button>
                            )}
                        </div>
                    </div>
                    <div className="table_wrap">
                        {/*상세 수정 생성 Mode별 SPA 구현*/}
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th>상품번호</th>
                                    <th>상품명</th>
                                    <th>단가</th>
                                    <th>수량</th>
                                    <th>총 금액</th>
                                    {(isCreateMode || isEditMode) && <th style={{ width: '100px' }}>삭제</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {/* 하나의 데이터 소스를 조건에 맞게 사용 */}
                                {(isCreateMode ? products : isEditMode ? displayItemEdit : displayItems || []).map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <input
                                                type="text"
                                                className="box"
                                                value={isCreateMode
                                                    ? item?.name || ''
                                                    : isEditMode || isDetailView
                                                        ? item?.productNm || ''
                                                        : ''}
                                                readOnly={!isEditMode && !isCreateMode}
                                                placeholder="상품 선택"
                                                onChange={(e) => {
                                                    if (isCreateMode) {
                                                        handleProductChange(index, 'name', e.target.value);
                                                    } else {
                                                        handleProductEdit(index, 'productNm', e.target.value);
                                                    }
                                                }}
                                            />
                                            {(isCreateMode || isEditMode) && (
                                                <button className="search-button" onClick={() => openModal(index)}>
                                                    <i className="bi bi-search"></i>
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="box"
                                                value={isCreateMode ? (item?.price || '') : isEditMode ? item?.orderDPrice : item?.orderDPrice || ''}
                                                readOnly={!isEditMode && !isCreateMode}
                                                placeholder="단가 입력"
                                                onChange={(e) => {
                                                    if (isCreateMode) {
                                                        handleProductChange(index, 'price', Number(e.target.value));
                                                    } else if (isEditMode) {
                                                        handleProductEdit(index, 'orderDPrice', Number(e.target.value));
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="box"
                                                value={isCreateMode ? (item?.quantity || 0) : isEditMode ? item?.orderDQty : item?.orderDQty || 0}
                                                readOnly={!isEditMode && !isCreateMode}
                                                placeholder="수량 입력"
                                                onChange={(e) => {
                                                    if (isCreateMode) {
                                                        handleProductChange(index, 'quantity', Number(e.target.value));
                                                    } else if (isEditMode) {
                                                        handleProductEdit(index, 'orderDQty', Number(e.target.value));
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>{((isCreateMode ? (item?.price || 0) * (item?.quantity || 0) : item?.orderDPrice * item?.orderDQty) || 0).toLocaleString()}</td>
                                        {(isCreateMode || isEditMode) && (
                                            <td style={{ width: '100px' }}>
                                                <button className="box icon del" onClick={() => {
                                                    if (isCreateMode) {
                                                        console.log("createmode")
                                                        removeProductRow(index);
                                                    } else if (isEditMode) {
                                                        console.log("editmode")
                                                        removeProducteditRow(index);
                                                    }
                                                }}>
                                                    <i className="bi bi-trash"></i>{/* 삭제 */}
                                                </button>
                                            </td>
                                        )}
                                        {/* 숨겨진 상품 코드 */}
                                        <td style={{ display: 'none' }}>
                                            <input
                                                type="text"
                                                value={isCreateMode ? item?.code : isEditMode ? item?.productCd : item?.productCd || ''}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="total-amount">
                        {isCreateMode ? (
                            <>
                                <label>총 금액: </label>
                                <span>{(products.reduce((sum, product) => sum + product.price * product.quantity, 0)).toLocaleString()}원</span>
                            </>
                        ) : (
                            <span></span>
                        )}
                    </div>
                    <div className="order-buttons">
                        {isCreateMode && <button className="box color" onClick={handleSubmit}><i className="bi bi-floppy"></i> 주문 등록</button>}
                        {/*추 후 배포시에는 role!=='admin'으로 변경할 것*/}
                        {isEditMode && role ==='admin' &&(<button className="box color" onClick={() => handleEdit(orderNo)}><i className="bi bi-floppy"></i> 주문 수정</button>)}
                        {isDetailView && role === 'admin' && !isApproved && !isDenied && (
                            <>
                                <button className="box color" onClick={handleApproveOrder}>
                                    결재승인
                                </button>
                                <button className="box" onClick={handleDeniedOrder}>
                                    반려요청
                                </button>
                            </>
                        )}
                        {/*추 후 배포시에는 role!=='admin'으로 변경할 것*/}
                        {isDetailView && role === 'admin' &&(
                            <button className="box color" onClick={() => window.location.href = `/order?no=${orderNo}&mode=edit`}>수정</button>)}
                    </div>
                </div>
            </main>

            {/* 고객사 검색 모달 */}
            {
                customerModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>고객사 검색</h4>
                                <button className="close-modal" onClick={closeCustomerModal}>&times;</button>
                            </div>

                            <div className="search-fields">
                                <input
                                    type="text"
                                    placeholder="검색하실 고객사를 입력하세요"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="search-modal" onClick={customerSearch}>검색</button>
                            </div>

                            <div className="search-results">
                                {customerSearchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                            <tr>
                                                <th>고객사</th>
                                                <th>주소</th>
                                                <th>연락처</th>
                                                <th>대표명</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedCustomerSearchResults.map((result) => (
                                                <tr key={result.customerNo}
                                                    onClick={() => handleCustomerSelect(result)}>
                                                    <td>{result.customerName}</td>
                                                    <td>{result.customerAddr}</td>
                                                    <td>{result.customerTel}</td>
                                                    <td>{result.customerRepresentativeName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                                {/* 페이지네이션 */}
                                <div className="pagination">
                                    {Array.from({ length: totalCustomerPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChangeCustomer(number)}
                                            className={number === currentPageCustomer ? 'active' : ''}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 상품 검색 모달 */}
            {
                showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>상품 검색</h4>
                                <button className="close-modal" onClick={closeModal}>&times;</button>
                            </div>

                            <div className="category-selectors">
                                <select value={selectedCategory.top} onChange={handleTopChange}>
                                    <option value="">대분류</option>
                                    {categories.topCategories.map(category => (
                                        <option key={category.categoryNo}
                                            value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>

                                <select value={selectedCategory.middle} onChange={handleMiddleChange}
                                    disabled={!selectedCategory.top}>
                                    <option value="">중분류</option>
                                    {categories.middleCategories.map(category => (
                                        <option key={category.categoryNo}
                                            value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>

                                <select value={selectedCategory.low} onChange={(e) => setSelectedCategory({
                                    ...selectedCategory,
                                    low: e.target.value
                                })} disabled={!selectedCategory.middle}>
                                    <option value="">소분류</option>
                                    {categories.lowCategories.map(category => (
                                        <option key={category.categoryNo}
                                            value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="search-fields">
                                <input
                                    type="text"
                                    placeholder="상품명"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="상품코드"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value)}
                                />
                                <button className="search-modal" onClick={handleSearch}>검색</button>
                            </div>


                            {/* 검색 결과 */}
                            <div className="search-results">
                                {searchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                            <tr>
                                                <th>상품코드</th>
                                                <th>카테고리</th>
                                                <th>상품명</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSearchResults.map((result, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => isEditMode ? handleProductSelectEdit(result) : handleProductSelect(result)}
                                                >
                                                    <td>{result.productCd}</td>
                                                    <td>{result.category.categoryNo}</td>
                                                    <td>{result.productNm}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                                {/* 페이지네이션 */}
                                <div className="pagination">
                                    {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChangeProduct(number)}
                                            className={number === currentPageProduct ? 'active' : ''}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </Layout >
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Order />
    </BrowserRouter>
);