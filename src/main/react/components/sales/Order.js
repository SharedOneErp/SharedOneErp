import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/Order.css';

function Order() {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('no'); // 주문번호
    const mode = searchParams.get('mode') || 'view'; // 'edit' 또는 'view'

    // 등록/수정/상세 구분
    const isCreateMode = !orderNo; // 주문번호 없으면 등록 모드
    const isEditMode = mode === 'edit'; // 수정 모드
    const isDetailView = !!orderNo && mode === 'view'; // 상세보기 모드

    // 상태들
    const [products, setProducts] = useState([{ name: '', price:'' , quantity: '' }]);
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchCode, setSearchCode] = useState(''); // 상품코드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객 검색 결과

    const [employee, setEmployee] = useState(null); // 사용자 정보 넘기는 변수

    // 사용자 정보를 서버에서 가져오는 useEffect
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('/api/employee', {
                    credentials: "include", // 세션 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmployee(data);
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchEmployee();
    }, []);


    // 주문 상세 정보 가져오기 (상세보기/수정용)
    useEffect(() => {
        if (orderNo) {
            fetchOrderDetail(orderNo);
        }
    }, [orderNo]);

    const fetchOrderDetail = async (orderNo) => {
        console.log("-------------------------------------fetchOrderDetail");
        try {
            const response = await fetch(`http://localhost:8787/api/orders/${orderNo}`);
            if (!response.ok) throw new Error('주문 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setProducts(data ? data.products : []);
        } catch (error) {
            console.error('주문 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };


    // 상품 행 추가
    const addProductRow = () => {
        setProducts([...products, { name: '', price: 0, quantity: 0 }]);
    };

    // 상품 행 제거
    const removeProductRow = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    // 상품 변경 처리
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value || 0;
        setProducts(updatedProducts);
    };

    // 모달 열기
    const openModal = (index) => {
        setSelectedProductIndex(index);
        setShowModal(true);
        setSearchQuery('');
        setSearchCode('');
        setSearchResults([]);
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // Customer 모달 열기
    const openCustomerModal = () => {
        setCustomerModalOpen(true);
        setSearchQuery('');
        setSearchResults([]);
    };

    // Customer 모달 닫기
    const closeCustomerModal = () => {
        setCustomerModalOpen(false);
    };




    // 상품 검색 처리
    const handleSearch = async () => {
        console.log("-------------------------------------handleSearch");
        try {
            const response = await fetch(`http://localhost:8787/api/products/search?productCd=${searchCode}&productNm=${searchQuery}`);
            if (!response.ok) throw new Error('검색 결과가 없습니다.');
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setSearchResults([]);
        }
    };

    //고객사 서치
    const customerSearch = async () => {
        console.log("-------------------------------------customerSearch");
        try {
            const response = await fetch(`http://localhost:8787/api/customer/search?name=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('검색 결과가 없습니다.');
            const data = await response.json();
            setCustomerSearchResults(data);
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setCustomerSearchResults([]);
        }
    };

    const [selectedProductIndex, setSelectedProductIndex] = useState(null);


    // 상품 선택 처리
    const handleProductSelect = (selectedProduct) => {
        console.log('Selected product:', selectedProduct);

        if (selectedProductIndex !== null) {
            const updatedProducts = [...products];
            // 선택된 상품의 필드가 null인 경우 기본값 0으로 대체
            updatedProducts[selectedProductIndex] = {
                ...selectedProduct,
                name: selectedProduct.productNm,
                price: selectedProduct.price || 0,
                quantity: selectedProduct.quantity || 0,
                code: selectedProduct.productCd // 상품 코드를 추가
            };
            console.log('Updated products:', updatedProducts);
            console.log('Updated product codes:', updatedProducts.map(product => product.code));
            setProducts(updatedProducts);
        } else {
            console.error('No selectedProductIndex set');
        }
        closeModal();
    };


    const handleSubmit = async () => {
        // DOM에서 직접 값을 가져오는 대신 상태에서 관리하는 값을 사용하세요.
        const customerNo = document.querySelector('input[name="customerNo"]').value.trim(); // 고객번호
        const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0); // 총 금액
        const employeeIdElement = document.querySelector('.employee-id');
        const employeeId = employeeIdElement ? employeeIdElement.textContent.trim() : null; // 담당자의 ID를 가져오는 방법

        console.log(customerNo);
        console.log(employeeId);
        console.log(totalAmount);

        // 고객번호와 직원 ID를 숫자로 변환합니다.
        const orderData = {
            customer: { customerNo: customerNo },  // 서버에서 Expecting Customer 객체
            employee: { employeeId: employeeId },  // 서버에서 Expecting Employee 객체
            orderHTotalPrice: totalAmount,
            orderDStatus: "ing",
            orderDInsertDate: new Date().toISOString(),
            orderDUpdateDate: null
        };

        console.log("-------------------------------------handleSubmit");
        try {
            const response = await fetch('http://localhost:8787/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            // 오류
            if (response.ok) {
                // 서버 응답에서 orderNo 값을 추출
                const data = await response.json();
                const order_h_no = data.orderNo; // JSON에서 'orderNo'을 추출하여 'order_h_no'로 사용


                console.log("order_h_no : " + order_h_no);


                // 각 제품의 상세 주문 정보를 서버에 전송
                for (let product of products) {
                    const deliveryDateElement = document.querySelector('.delivery-date');
                    const deliveryRequestDate = deliveryDateElement ? deliveryDateElement.value : null;

                    const orderDetailData = {
                        orderNo: order_h_no,
                        productCd: product.code, // 상품 코드
                        orderDPrice: product.price,
                        orderDQty: product.quantity,
                        orderDTotalPrice: product.price * product.quantity,
                        orderDDeliveryRequestDate: deliveryRequestDate,
                    };

                    console.log("product.code : " + product.code);

                    const detailResponse = await fetch('http://localhost:8787/api/orderDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderDetailData),
                    });

                    if (!detailResponse.ok) {
                        const errorText = await detailResponse.text();
                        throw new Error(`상세 주문 처리 중 오류 발생: ${errorText}`);
                    }
                }

                // 주문 처리 후 페이지 이동
                window.location.href = '/orderListAll';
            } else {
                console.error('Order creation failed.');
            }
        } catch (error) {
            console.error('주문 처리 중 오류 발생:', error.message);
        }
    };

    const handleCustomerSelect = (selectedCustomer) => {
        // 선택된 고객 정보 처리
        console.log('Selected customer:', selectedCustomer);
        // 예를 들어, 고객 번호를 폼에 설정할 수 있습니다.
        document.querySelector('input[name="customerNo"]').value = selectedCustomer.customerNo;
        document.querySelector('input[name="customerName"]').value = selectedCustomer.customerName;

        closeCustomerModal();
    };



    return (
        <Layout currentMenu="order" >
            <div className="orderDetail-title">
                <h3>{isCreateMode ? '주문 등록' : isEditMode ? '주문 수정' : '주문 상세보기'}</h3>
            </div>
            <div className="order-detail-container">
                <div className="form-row">
                    {orderNo && (
                        <div className="form-group">
                            <label>주문번호</label>
                            <input type="text" value={orderNo} readOnly className="readonly"/>
                        </div>
                    )}

                    <div className="form-group">
                        <label>고객사</label>
                        <input type="hidden" name="customerNo" readOnly={!isEditMode && !isCreateMode}/>
                        <input type="text" name="customerName"/>
                        <button
                            className="search-button"
                            onClick={openCustomerModal}
                            style={{display: !isEditMode && !isCreateMode ? 'none' : 'block'}}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                    {!isCreateMode && (
                        <>
                            <div className="form-group">
                            <label>물품 총액</label>
                                <input type="text" value="300,000" readOnly/>
                            </div>
                            <div className="form-group">
                                <label>주문 등록일</label>
                                <input type="date" defaultValue="2024-09-07" readOnly className="readonly"/>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>납품요청일</label>
                        <input type="date" className="delivery-date" defaultValue="2024-10-07" readOnly={!isEditMode && !isCreateMode}/>
                    </div>

                    <div className="form-group">
                        <label>담당자</label>
                        <span className="employee-id">{employee ? (
                            <>
                               {employee.employeeId}
                            </>
                        ) : (
                            'LOADING'
                        )}</span>
                    </div>

                    <div className="form-group">
                        <label>주문 상태</label>
                        <span className="order-status">처리중</span>
                    </div>
                </div>

                {/* 상품 목록 */}
                <div className="product-table">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>상품번호</th>
                            <th>상품명</th>
                            <th>단가</th>
                            <th>수량</th>
                            <th>총 금액</th>
                            {(isCreateMode || isEditMode) && <th>삭제</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={product.name}
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => handleProductChange(index, 'name', e.target.value)}
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
                                        value={product.price || 0} // 기본값을 0으로 설정
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.quantity || 0} // 기본값을 0으로 설정
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </td>
                                <td>{product.price * product.quantity}</td>
                                {(isCreateMode || isEditMode) && (
                                    <td>
                                        <button onClick={() => removeProductRow(index)}>삭제</button>
                                    </td>
                                )}
                                {/* 숨겨진 상품 코드 */}
                                <td style={{ display: 'none' }}>
                                    <input type="text" value={product.code || ''} readOnly />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {(isCreateMode || isEditMode) &&
                        <button className="add-button" onClick={addProductRow}>상품 추가</button>}
                </div>


                {customerModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>고객사 검색</h4>
                                <button className="close-modal" onClick={closeCustomerModal}>&times;</button>
                            </div>

                            {/* 고객사 검색 */}
                            <div className="search-fields">
                                <input
                                    type="text"
                                    placeholder="검색하실 고객사를 입력하세요"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="search-modal" onClick={customerSearch}>검색</button>
                            </div>

                            {/* 고객사 검색 결과 */}
                            <div className="search-results">
                                {customerSearchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                        <tr>
                                            <th>고객사 코드</th>
                                            <th>고객사 이름</th>
                                            <th>주소</th>
                                            <th>연락처</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {customerSearchResults.map((result) => (
                                            <tr key={result.customerNo} onClick={() => handleCustomerSelect(result)}>
                                                <td>{result.customerNo}</td>
                                                <td>{result.customerName}</td>
                                                <td>{result.customerAddr}</td>
                                                <td>{result.customerTel}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 상품 검색 모달 */}
                {customerModalOpen && (
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
                                            <th>고객사 코드</th>
                                            <th>고객사 이름</th>
                                            <th>주소</th>
                                            <th>연락처</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {customerSearchResults.map((result) => (
                                            <tr key={result.customerNo} onClick={() => handleCustomerSelect(result)}>
                                                <td>{result.customerNo}</td>
                                                <td>{result.customerName}</td>
                                                <td>{result.customerAddr}</td>
                                                <td>{result.customerTel}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>상품 검색</h4>
                                <button className="close-modal" onClick={closeModal}>&times;</button>
                            </div>

                            <div className="category-selectors">
                                <select>
                                    <option value="">대분류</option>
                                    <option value="furniture">가구</option>
                                </select>

                                <select>
                                    <option value="">중분류</option>
                                    <option value="chair">의자</option>
                                    <option value="table">테이블</option>
                                </select>

                                <select>
                                    <option value="">소분류</option>
                                    <option value="office-chair">사무용 의자</option>
                                    <option value="dining-chair">식탁 의자</option>
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

                            <div className="search-results">
                                {searchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                        <tr>
                                            <th>상품코드</th>
                                            <th>카테고리</th>
                                            <th>상품명</th>
                                            <th>가격</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {searchResults.map((result, index) => (
                                            <tr key={index} onClick={() => handleProductSelect(result)}>
                                                <td>{result.productCd}</td>
                                                <td>{result.category.categoryNo}</td>
                                                <td>{result.productNm}</td>
                                                {/* 가격은 join 후 연결 */}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}



                {/* 모달 창 */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>상품 검색</h4>
                                <button className="close-modal" onClick={closeModal}>&times;</button>
                            </div>

                            <div className="category-selectors">
                                <select>
                                    <option value="">대분류</option>
                                    <option value="furniture">가구</option>
                                </select>

                                <select>
                                    <option value="">중분류</option>
                                    <option value="chair">의자</option>
                                    <option value="table">테이블</option>
                                </select>

                                <select>
                                    <option value="">소분류</option>
                                    <option value="office-chair">사무용 의자</option>
                                    <option value="dining-chair">식탁 의자</option>
                                </select>
                            </div>

                            {/*검색 div (상품명 / 상품코드 / 검색)*/}
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
                                            <th>가격</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {searchResults.map((result, index) => (
                                            <tr key={index} onClick={() => handleProductSelect(result)}>
                                                <td>{result.productCd}</td>
                                                <td>{result.category.categoryNo}</td>
                                                <td>{result.productNm}</td>
                                                {/* 가격은 join 후 연결 */}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="total-amount">
                    <label>총 금액: </label>
                    <span>{products.reduce((sum, product) => sum + product.price * product.quantity, 0)}원</span>
                </div>

                <div className="order-buttons">
                    {isCreateMode && <button onClick={handleSubmit}>주문 등록</button>}
                    {isEditMode && <button onClick={handleSubmit}>주문 수정</button>}
                    {isDetailView &&
                        <button onClick={() => window.location.href = `/order?no=${orderNo}&mode=edit`}>수정</button>}
                    <button onClick={() => window.location.href = '/orderListAll'}>닫기</button>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Order/>
    </BrowserRouter>
);