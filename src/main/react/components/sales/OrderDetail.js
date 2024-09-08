import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../../Main.css';
import Layout from "../../layout/Layout";
import { BrowserRouter, useNavigate } from "react-router-dom";
import '../../../resources/static/css/OrderDetail.css';
// 백업용 js 화면입니다 (사용하지 않음)
function OrderDetail() {
    const [products, setProducts] = useState([{ name: '코딩용 정우 블랙 A', price: 5000000, quantity: 1 }]);
    const [showModal, setShowModal] = useState(false); // 모달 창 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchCode, setSearchCode] = useState(''); // 상품코드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

    // 상품 변경
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
    };

    // 상품코드 변경
    const handleSearchCodeChange = (e) => {
        setSearchCode(e.target.value);
    };

    // 상품 행 추가
    const addProductRow = () => {
        setProducts([...products, { name: '', price: 0, quantity: 0 }]);
    };

    // 상품 행 제거
    const removeProductRow = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    // 모달 열기
    const openModal = () => {
        setShowModal(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // 검색어 변경
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // 검색 버튼 클릭시 RestAPI 실행 후 SQL에서 값 받아올 수 있도록 설정 , INPUT값 2중 1이 NULL 일때도 값 받아올 수 있음.
    //차후에 쿼리값 변경 필요할지도 모름.
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8787/api/products/search?productCd=${searchCode}&productNm=${searchQuery}`);
            if (!response.ok) throw new Error('RESPONSE.OK ERROR "응답이 올바르지 않습니다."');
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('검색 값이 없습니다.', error);
            setSearchResults([]); // 오류 발생 시 빈 결과로 설정
        }
    };

    // 수정 버튼 클릭
    const handleEditClick = () => {
        window.location.href = '/orderListAll';
    };

    // 닫기 버튼 클릭
    const handleCloseClick = () => {
        window.location.href = '/orderListAll';
    };

    // 상품 선택 시 처리 함수
    const handleProductSelect = (selectedProduct) => {
        // 모달을 닫고 선택한 상품 정보를 입력 필드에 반영
        const updatedProducts = [...products];
        updatedProducts[0] = selectedProduct; // 첫 번째 상품을 선택한 것으로 가정
        setProducts(updatedProducts);
        closeModal();
    };

    return (
        <Layout currentMenu="orderDetail">
            <div className="orderDetail-title">
                <h3>주문 상세 화면</h3>
            </div>
            <div className="order-detail-container">
                <div className="form-row">
                    <div className="form-group">
                        <label>주문번호</label>
                        <input type="text" defaultValue="HJW-2024907-A" readOnly className="readonly"/>
                    </div>

                    <div className="form-group">
                        <label>고객사</label>
                        <input type="text" defaultValue="쉐어드원" readOnly/>
                    </div>

                    <div className="form-group">
                        <label>물품 총액</label>
                        <input type="text" defaultValue="300,000" readOnly/>
                    </div>

                    <div className="form-group">
                        <label>납품요청일</label>
                        <input type="date" defaultValue="2024-10-07"/>
                    </div>

                    <div className="form-group">
                        <label>주문 등록일</label>
                        <input type="date" defaultValue="2024-09-07" readOnly className="readonly"/>
                    </div>

                    <div className="form-group">
                        <label>담당자</label>
                        <span type="text"> 한정우 </span>
                    </div>

                    <div className="form-group">
                    <label>주문 상태</label>
                        <span type="text"> 처리중 </span>
                    </div>
                </div>

                {/* 상품 목록 테이블 */}
                <div className="product-table">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>상품명(영문)</th>
                            <th>단가</th>
                            <th>수량</th>
                            <th>총 금액</th>
                            <th>삭제</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="product-name-cell">
                                        <input
                                            type="text"
                                            value={product.name}
                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                        />
                                        <button className="search-button" onClick={openModal}><i class="bi bi-search"></i></button>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => handleProductChange(index, 'price', Number(e.target.value))}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', Number(e.target.value))}
                                    />
                                </td>
                                <td>{product.price * product.quantity}</td>
                                <td>
                                    <button onClick={() => removeProductRow(index)}>삭제</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button className="add-button" onClick={addProductRow}>상품 추가</button>
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
                                    onChange={handleSearchChange}
                                />
                                <input
                                    type="text"
                                    placeholder="상품코드"
                                    value={searchCode}
                                    onChange={handleSearchCodeChange}
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
                                                {/*상품코드 (임시)*/}
                                                <td>{result.categoryNo}</td>
                                                {/*카테고리코드 (임시)*/}
                                                <td>{result.productNm}</td>
                                                {/*상품 이름*/}
                                                {/*<td>{result.price}</td> */}
                                                {/*가격 (받아올 수 없으므로 주석)*/}
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
            </div>

            <div className="orderDetail-button">
                <button className="orderDetail-edit" onClick={handleEditClick}>수정</button>
                <button className="orderDetail-close" onClick={handleCloseClick}>닫기</button>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderDetail/>
    </BrowserRouter>
);
