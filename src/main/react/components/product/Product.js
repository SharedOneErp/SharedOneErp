import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/Product.css'; // 개별 CSS 스타일 적용

// 컴포넌트
function Product() {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('no'); // 주문번호
    const mode = searchParams.get('mode') || 'view'; // 'edit' 또는 'view'

    // 등록/수정/상세 구분
    const isCreateMode = !orderNo; // 주문번호 없으면 등록 모드
    const isEditMode = mode === 'edit'; // 수정 모드
    const isDetailView = !!orderNo && mode === 'view'; // 상세보기 모드

    // 상태들
    const [products, setProducts] = useState([{name: '사무용 의자 블랙 A', price: 35000, quantity: 100}]);
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchCode, setSearchCode] = useState(''); // 상품코드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태


    // 주문 상세 정보 가져오기 (상세보기/수정용)
    useEffect(() => {
        if (orderNo) {
            fetchOrderDetail(orderNo);
        }
    }, [orderNo]);

    const fetchOrderDetail = async (orderNo) => {
        try {
            const response = await fetch(`/api/order/${orderNo}`);
            if (!response.ok) throw new Error('주문 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setProducts(data ? data.products : []);
        } catch (error) {
            console.error('주문 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    // 상품 행 추가
    const addProductRow = () => {
        setProducts([...products, {name: '', price: 0, quantity: 0}]);
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
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // 상품 검색 처리
    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/products/search?productCd=${searchCode}&productNm=${searchQuery}`);
            if (!response.ok) throw new Error('검색 결과가 없습니다.');
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setSearchResults([]);
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
            };
            console.log('Updated products:', updatedProducts);
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
            customer: {customerNo: customerNo},  // 서버에서 Expecting Customer 객체
            employee: {employeeId: employeeId},  // 서버에서 Expecting Employee 객체
            orderHTotalPrice: totalAmount,
            orderDStatus: "ing",
            orderDInsertDate: new Date().toISOString(),
            orderDUpdateDate: null
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`주문 처리 중 오류 발생: ${errorText}`);
            }

            window.location.href = '/orderListAll';
        } catch (error) {
            console.error('주문 처리 중 오류 발생:', error.message);
        }
    };

    return (
        <Layout currentMenu="product"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <div>
                <div className="product-registration-title">
                    <h3>상품 등록</h3>
                </div>
                <div className="product-table">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>상품코드</th>
                            <th>상품명</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="text"/></td>
                            <td><input type="text"/></td>
                        </tr>
                        </tbody>
                        <thead>
                        <tr>
                            <th>대분류</th>
                            <th>중분류</th>
                            <th>소분류</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                />
                                <button className="search-button" onClick={() => openModal(index)}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                />
                                <button className="search-button" onClick={() => openModal(index)}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                />
                                <button className="search-button" onClick={() => openModal(index)}>
                                    <i className="bi bi-search"></i>
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

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
                                                <td>{result.categoryNo}</td>
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

                <div className="order-buttons">
                    <button onClick={handleSubmit}>등록</button>
                    <button onClick={() => window.location.href = '/productList'}>닫기</button>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <Product/> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);