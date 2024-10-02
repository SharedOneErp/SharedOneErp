import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, useSearchParams } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import CustomerSearchModal from '../common/CustomerSearchModal'; // 고객사 검색 모달 임포트
import ProductSearchModal from '../common/ProductSearchModal'; // 상품 검색 모달 임포트
import { useHooksList } from './OrderHooks'; // 상태 및 로직을 처리하는 훅
import '../../../resources/static/css/sales/Order.css';
import { color } from 'chart.js/helpers';



function Order() {

    // 🔴 고객사검색, 상품 검색
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({ customerName: '고객사 선택', customerNo: '' });
    const [selectedProduct, setSelectedProduct] = useState({ productNm: '상품 선택', productCd: '', productPrice: 0 });


    // 🔴🔴🔴🔴 고객사 선택 시 모달을 닫고 버튼에 값 설정
    const handleCustomerSelect = (selectedCustomer) => {
        console.log('Selected customer:', selectedCustomer);

        setCustomerData({
            customerNo: selectedCustomer.customerNo,
            customerName: selectedCustomer.customerName,
            customerAddr: selectedCustomer.customerAddr,
            customerTel: selectedCustomer.customerTel,
            customerRepresentativeName: selectedCustomer.customerRepresentativeName
        });
        setCustomerModalOpen(false);
    };

    // 🔴🔴🔴🔴 상품 선택 시 모달을 닫고 값 설정
    const handleProductSelect = (selectedProduct) => {

        if (selectedProductIndex !== null) {

            if (isEditMode || isResubmitMode) {
                const updatedOrderDetails = [...orderDetails];
                updatedOrderDetails[selectedProductIndex] = {
                    ...updatedOrderDetails[selectedProductIndex],
                    productNm: selectedProduct.productNm || '', // 제품 이름을 업데이트
                    orderDPrice: selectedProduct.priceCustomer || 0, // 가격 업데이트
                    orderDQty: selectedProduct.quantity || 0,
                    productCd: selectedProduct.productCd || '', // 상품 코드
                    priceCustomer: selectedProduct.priceCustomer || '' // 상품 가격
                };

                setOrderDetails(updatedOrderDetails);

            } else {

                const updatedProducts = [...products];
                // 선택된 상품의 필드가 null인 경우 기본값 0으로 대체
                updatedProducts[selectedProductIndex] = {
                    ...selectedProduct,
                    name: selectedProduct.productNm,
                    // price: selectedProduct.price || 0,
                    price: selectedProduct.priceCustomer || 0,
                    quantity: selectedProduct.quantity || 0,
                    code: selectedProduct.productCd // 상품 코드를 추가
                };
                setProducts(updatedProducts);

            }

        } else {
            console.error('handleProductSelect error');
        }
        setProductModalOpen(false);
    };

    // 🔴🔴🔴🔴 
    const openProductModal = (index) => {
        // 모달을 열기 전, 필요한 상태와 함수들을 먼저 실행
        setSelectedProductIndex(index); // 선택한 상품의 인덱스 설정

        // 모달 열기
        setProductModalOpen(true);
    };

    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);


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
                window.showToast('해당 페이지에 접근 권한이 없습니다.', 'error');
                setTimeout(() => {
                    window.location.href = '/main';
                }, 1000); // 1000 밀리초
            } finally {
            }
        };
        fetchData();
    }, []);


    const updateOrderStatus = async (orderNo, status, message) => {


        try {
            const response = await fetch(`/api/order/updateStatus/${orderNo}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderHStatus: status }),
            });
            if (response.ok) {
                console.log("orderstatus update success");
                return true;
            } else {
                throw new Error('주문 상태 업데이트 실패');
            }
        } catch (error) {
            console.error('주문 상태를 업데이트하는 중 오류 발생');
            return false;
        }
    };

    const handleApproveOrder = async () => {    
        try {

            window.confirmCustom("해당 주문을 승인하시겠습니까?<br>이 결정은 되돌릴 수 없습니다.").then(result => {
                if (result) {
                    const result = updateOrderStatus(orderNo, 'approved');

                    if (result) {
                        window.showToast("주문 승인이 정상적으로 완료되었습니다.");
                        window.location.reload();
                    } else {
                        throw new Error("주문 승인 중 오류 발생");
                    }
                }
            });

        } catch (error) {
            window.showToast('주문 승인이 실패했습니다. 관리자에게 문의하세요', 'error');
        }
    };

    const handleDeniedOrder = async () => {
        try {
            window.confirmCustom(`해당 주문을 반려하시겠습니까?<br>이 결정은 되돌릴 수 없습니다.`).then(result => {
                if (result) {
                    const result = updateOrderStatus(orderNo, 'denied');

                    if (result) {
                        window.showToast("주문 반려가 정상적으로 완료되었습니다.");
                        window.location.reload();
                    } else {
                        throw new Error('주문 반려 중 오류 발생');
                    }
                }
            });

        } catch (error) {
            window.showToast("주문 반려가 실패했습니다. 관리자에게 문의하세요", 'error');
        }
    };

    // 🔴 커스텀 훅을 통해 상태와 함수 불러오기
    const {
        // 주문 모드 관련 상태
        isCreateMode,  // 현재 주문이 등록 모드인지 확인
        isEditMode,    // 현재 주문이 수정 모드인지 확인
        isDetailView,  // 현재 주문이 상세보기 모드인지 확인
        isResubmitMode, // 반려 주문을 수정 모드에서 등록하는지 확인

        // 주문 번호 관련 상태
        orderNo,       // 현재 주문 번호


        // 주문 관련 데이터 및 상태
        products,           // 상품 리스트
        customerData,       // 고객사 정보
        orderDetails,       // 주문 상세 정보
        orderHStatus,
        orderHTotalPrice,   // 주문 총액
        orderHInsertDate,   // 주문 등록일
        employee,           // 담당자 정보 (로그인한 사용자 정보)

        // 상품 및 주문 상세 데이터 변경 함수
        handleProductChange,    // 상품 데이터 변경 처리 함수 (등록 시)
        handleProductEdit,      // 상품 수정 데이터 변경 처리 함수 (수정 시)
        addProductRow,          // 상품 행 추가 함수
        removeProductRow,       // 상품 행 제거 함수
        removeProducteditRow,   // 상품 수정 행 제거 함수

        // 주문 생성 및 수정 함수
        handleSubmit,   // 주문 생성 처리 함수
        handleEdit,     // 주문 수정 처리 함수
        handleResubmit,

        // 날짜 관련 함수
        formatDateForInput,  // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수

        displayItems,
        editProductRow,
        displayItemEdit,
        setCustomerData,
        selectedProductIndex,
        setProducts,
        setOrderDetails,
        setSelectedProductIndex,
    } = useHooksList();

    return (
        <Layout currentMenu="order">
            <main className="main-content menu_order">
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">{isCreateMode ? '주문 등록' : isEditMode || isResubmitMode ? '주문 수정' : '주문 상세'}</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            <div className="form-row">
                                {orderNo && !isResubmitMode && (
                                    <div className="form-group">
                                        <label>주문번호</label>
                                        <input type="text" value={orderNo} readOnly className="box readonly" />
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>고객사<span style={{ color: 'red', marginLeft: '1px' }}>*</span></label>
                                    <input type="hidden" className="box" name="customerNo" value={customerData.customerNo} readOnly />
                                    {/*위는 주문 생성 , 아래는 수정과 변경*/}
                                    <input type="text" className="box" name="customerName" value={customerData.customerName || ''}
                                        placeholder="고객사 선택" readOnly />
                                    <button
                                        className="search-button"
                                        onClick={() => setCustomerModalOpen(true)}
                                        style={{ display: !isEditMode && !isCreateMode && !isResubmitMode ? 'none' : 'block' }}
                                    >
                                        <i className="bi bi-search"></i>
                                    </button>
                                </div>

                                {!isCreateMode && !isResubmitMode && (
                                    <>
                                        <div className="form-group">
                                            <label>물품 총액</label>
                                            <span className="orderHtotal-price"> {orderHTotalPrice.toLocaleString()}원</span>
                                        </div>

                                        <div className="form-group">
                                            <label>주문 등록일</label>
                                            <input type="date" value={formatDateForInput(orderHInsertDate) || ''} readOnly
                                                className="readonly box"
                                            />

                                        </div>
                                    </>
                                )}

                                <div className="form-group">
                                    {/*위는 주문 생성 , 아래는 수정과 변경*/}
                                    <label>납품요청일<span style={{ color: 'red', marginLeft: '1px' }}>*</span></label>
                                    <input
                                        type="date"
                                        className="delivery-date box"
                                        defaultValue={formatDateForInput(orderDetails[0]?.orderDDeliveryRequestDate)}
                                        readOnly={isDetailView}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            const selectedDate = new Date(e.target.value);
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간 부분을 00:00:00으로 설정
                                            // 날짜 검증
                                            if (isNaN(selectedDate.getTime())) {
                                                // 유효하지 않은 날짜 처리
                                                window.showToast("유효하지 않은 날짜입니다.", 'error');
                                            } else if (selectedDate < today) {
                                                // 선택한 날짜가 오늘보다 이전인지 확인
                                                window.showToast("납품 요청일은 오늘보다 같거나 이후여야 합니다.", 'error');
                                                e.target.value = ''; // 잘못된 날짜 선택 시 입력값 초기화
                                            } else {
                                                // 선택한 날짜가 유효할 경우
                                                console.log("선택한 날짜:", selectedDate);
                                            }
                                        }
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ opacity: isCreateMode ? 0 : 1 }} >담당자</label>
                                    <span className="employee-id" style={{ display: 'none' }}>{employee ? (
                                        <>
                                            {employee.employeeId}
                                        </>
                                    ) : (
                                        'LOADING'
                                    )}</span>

                                    <span className="employee-name" style={{ display: 'none' }} >{employee ? (
                                        <>
                                            {employee.employeeName}
                                        </>
                                    ) : (
                                        <span></span>
                                    )}
                                    </span>

                                    <span className="employee-name">
                                        {employee ? (
                                            <input
                                                type="text"
                                                className="employee-name box"
                                                value={employee.employeeName}
                                                readOnly
                                                style={{ opacity: isCreateMode ? 0 : 1 }}
                                            />
                                        ) : (
                                            <span>NOT AVAILABLE</span> // employee가 없을 때 대체 텍스트 제공
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

                                {!isCreateMode && !isResubmitMode && (
                                    <div className="form-group">

                                        <label>현재 주문 상태</label>
                                        <span className={`order-status ${orderHStatus}`}>
                                            {/* 상태에 따른 한글로 텍스트 변경 */}
                                            {orderHStatus === 'ing' && '결재중'}
                                            {orderHStatus === 'denied' && '반려'}
                                            {orderHStatus === 'approved' && '결재완료'}
                                        </span>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="right">
                            {/* 제품 추가 버튼 - 생성 모드 또는 수정 모드(재생성모드) 에서만 표시 */}
                            {(isCreateMode || isEditMode || isResubmitMode) &&
                                customerData.customerName &&
                                orderHStatus !== 'approved' &&
                                ((isResubmitMode && orderHStatus === 'denied') || orderHStatus !== 'denied') && (
                                    <button className="box color" onClick={isCreateMode ? addProductRow : editProductRow}>
                                        <i className="bi bi-plus-circle"></i> 추가하기
                                    </button>
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
                                    {(isCreateMode || isEditMode || isResubmitMode) && <th style={{ width: '100px' }}>삭제</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {/* 하나의 데이터 소스를 조건에 맞게 사용 */}
                                {customerData.customerName ? (
                                    (isCreateMode ? products : isEditMode || isResubmitMode ? displayItemEdit : displayItems || []).map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="box"
                                                    value={isCreateMode
                                                        ? item?.name || ''
                                                        : isEditMode || isResubmitMode || isDetailView
                                                            ? item?.productNm || ''
                                                            : ''}
                                                    readOnly
                                                    disabled={isDetailView} // 상세보기 모드일 때 disabled 속성 추가
                                                    placeholder="상품 선택"
                                                    onChange={(e) => {
                                                        if (isCreateMode) {
                                                            handleProductChange(index, 'name', e.target.value);
                                                        } else {
                                                            handleProductEdit(index, 'productNm', e.target.value);
                                                        }
                                                    }}
                                                />
                                                {(isCreateMode || isEditMode || isResubmitMode) && (
                                                    <button className="search-button" onClick={() => openProductModal(index)}>
                                                        <i className="bi bi-search"></i>
                                                    </button>
                                                )}

                                            </td>
                                            <td>
                                                <input
                                                    type="text" // type을 text로 변경하여 콤마가 들어간 값을 처리 가능하게 함
                                                    className="box"
                                                    value={isCreateMode
                                                        ? (item?.price !== undefined ? item.price.toLocaleString() : '')
                                                        : isEditMode || isResubmitMode
                                                            ? (item?.orderDPrice !== undefined ? item.orderDPrice.toLocaleString() : '')
                                                            : item?.orderDPrice?.toLocaleString() || ''}
                                                    readOnly={!isEditMode && !isResubmitMode && !isCreateMode}
                                                    disabled={isDetailView} // 상세보기 모드일 때 disabled 속성 추가
                                                    placeholder="단가 입력"
                                                    onChange={(e) => {
                                                        // 콤마를 제거한 숫자만 추출
                                                        const numericValue = Number(e.target.value.replace(/,/g, ''));

                                                        if (isCreateMode) {
                                                            handleProductChange(index, 'price', numericValue);
                                                        } else if (isEditMode || isResubmitMode) {
                                                            handleProductEdit(index, 'orderDPrice', numericValue);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text" // 콤마가 포함된 값을 처리하기 위해 type을 text로 변경
                                                    className="box"
                                                    value={isCreateMode
                                                        ? (item?.quantity !== undefined ? item.quantity.toLocaleString() : 0)
                                                        : isEditMode || isResubmitMode
                                                            ? (item?.orderDQty !== undefined ? item.orderDQty.toLocaleString() : 0)
                                                            : item?.orderDQty?.toLocaleString() || 0}
                                                    readOnly={!isEditMode && !isResubmitMode && !isCreateMode}
                                                    disabled={isDetailView} // 상세보기 모드일 때 disabled 속성 추가
                                                    placeholder="수량 입력"
                                                    onChange={(e) => {
                                                        // 콤마를 제거한 숫자만 추출
                                                        const numericValue = Number(e.target.value.replace(/,/g, ''));

                                                        // 상태 업데이트: 콤마 없는 숫자를 상태에 저장
                                                        if (isCreateMode) {
                                                            handleProductChange(index, 'quantity', numericValue);
                                                        } else if (isEditMode || isResubmitMode) {
                                                            handleProductEdit(index, 'orderDQty', numericValue);
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {((isCreateMode ? (item?.price || 0) * (item?.quantity || 0) : item?.orderDPrice * item?.orderDQty) || 0).toLocaleString()}
                                            </td>
                                            {(isCreateMode || isEditMode || isResubmitMode) && (
                                                <td style={{ width: '100px' }}>
                                                    <button className="box icon del" onClick={() => {
                                                        const currentProducts = isCreateMode ? products : isEditMode || isResubmitMode ? displayItemEdit : displayItems || [];
                                                        // 상품이 없을 경우 알림 표시
                                                        if (currentProducts.length > 1) {
                                                            if (isCreateMode) {
                                                                console.log("생성모드");
                                                                removeProductRow(index);
                                                            } else if (isEditMode || isResubmitMode) {
                                                                console.log("수정모드");
                                                                removeProducteditRow(index);
                                                            }
                                                        } else {
                                                            window.showToast("상품은 최소 1개 이상이어야 합니다.", 'error');
                                                        }
                                                    }}>
                                                        <i className="bi bi-trash"></i> {/* 삭제 아이콘 */}
                                                    </button>
                                                </td>
                                            )}
                                            {/* 숨겨진 상품 코드 */}
                                            <td style={{ display: 'none' }}>
                                                <input
                                                    type="text"
                                                    value={isCreateMode ? item?.code : isEditMode || isResubmitMode ? item?.productCd : item?.productCd || ''}
                                                    readOnly
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="tr_empty">
                                        <td colSpan="10">
                                            <div className="no_data">
                                                <i className="bi bi-exclamation-triangle"></i> 고객사를 먼저 선택해주세요.
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {customerData.customerName && (
                        <div className="table_footer_wrapper">
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold', padding: '12px 8px' }}>총 금액 :
                                    <span style={{ marginLeft: "5px" }}>{(
                                        (isCreateMode ? products : isEditMode || isResubmitMode ? displayItemEdit : displayItems || [])
                                            .reduce((sum, item) => sum + (isCreateMode ? item?.price || 0 : item?.orderDPrice || 0) * (isCreateMode ? item?.quantity || 0 : item?.orderDQty || 0), 0)
                                    ).toLocaleString()} 원</span>
                                </td>
                            </tr>
                        </div>
                    )}

                    <div className="order-buttons">
                        {isCreateMode && <button className="box color" onClick={handleSubmit}>결재 요청</button>}
                        {isResubmitMode && (
                            <button className="box color" onClick={() => handleResubmit(orderNo)}>
                                결재 재요청
                            </button>
                        )}
                        {isEditMode && orderHStatus === 'ing' && (<button className="box color" onClick={() => handleEdit(orderNo)}>주문 수정</button>)}
                        {isDetailView && role === 'admin' && orderHStatus === 'ing' && (
                            <>
                                <button className="box color" onClick={handleApproveOrder}>
                                    결재승인
                                </button>
                                <button className="box" onClick={handleDeniedOrder}>
                                    반려요청
                                </button>
                            </>
                        )}
                        {isDetailView && orderHStatus === 'ing' && (
                            <button className="box color" onClick={() => window.location.href = `/order?no=${orderNo}&mode=edit`}>수정</button>)}
                        {isDetailView && orderHStatus === 'denied' && (
                            <button className="box color" onClick={() => window.location.href = `/order?no=${orderNo}&mode=resubmit`}>수정</button>)}
                    </div>
                </div>
            </main>
            {/* 고객사 검색 모달 */}
            {isCustomerModalOpen && (
                <CustomerSearchModal
                    onClose={() => setCustomerModalOpen(false)}
                    onCustomerSelect={handleCustomerSelect}
                />
            )}
            {/* 상품 검색 모달 -> 고객에 해당하는 상품 정보 가져오기 */}
            {isProductModalOpen && (
                <ProductSearchModal
                    onClose={() => setProductModalOpen(false)}
                    onProductSelect={handleProductSelect}
                    customerNo={customerData.customerNo || null}
                />
            )}

        </Layout >
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Order />
    </BrowserRouter>
);