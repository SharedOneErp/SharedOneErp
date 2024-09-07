import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../../Main.css';
import Layout from "../../layout/Layout";
import {BrowserRouter, useNavigate, useSearchParams} from "react-router-dom";
import '../../../resources/static/css/OrderDetail.css';

function Order() {

    // 쿼리 파라미터에서 주문번호와 mode 추출 (등록/상세/수정 한 페이지에서 제어)
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('no'); // 등록일 경우 order, 상세일 경우 order?no=1, 수정일 경우 order?no=1&mode=edit
    const mode = searchParams.get('mode') || 'view'; // mode가 없으면 기본값 'view'

    const [products, setProducts] = useState([{ name: '사무용 의자 블랙 A', price: 35000, quantity: 100 }]);
    const [status] = useState('처리중'); // 결재 상태
    const [showModal, setShowModal] = useState(false); // 모달 창 상태
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const navigate = useNavigate();

    // 상품 변경
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
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
        const query = e.target.value;
        setSearchQuery(query);
        const filteredResults = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    // 검색 버튼 클릭
    const handleSearch = () => {
        // 검색 결과 필터링
        const filteredResults = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
    };

    // 수정 버튼 클릭
    const handleEditClick = () => {
        window.location.href = '/orderListAll';
    };

    // 수정 완료 버튼 클릭
    const handleEditSubmitClick = () => {
    };

    // 닫기 버튼 클릭
    const handleCloseClick = () => {
        window.location.href = '/orderListAll';
    };

    // 결재 요청
    const handleRequestApproval = () => {
        // 주문 등록
    };

    return (
        <Layout currentMenu="orderDetail">
            <div className="orderDetail-title">
                <h3>{orderNo ? (mode === 'edit' ? '주문 수정' : '주문 상세') : '주문 등록'} 화면</h3>
            </div>
            <div className="order-detail-container">
                <div className="form-row">
                    {orderNo && (
                        <div className="form-group">
                            <label>주문번호</label>
                            <input type="text" defaultValue="HJW-2024907-A" readOnly className="readonly"/>
                        </div>
                    )}

                    <div className="form-group">
                        <label>고객사</label>
                        <input type="text" defaultValue="쉐어드원" readOnly/>
                    </div>

                    {orderNo && mode === 'view' && (
                        <div className="form-group">
                            <label>물품 총액</label>
                            <input type="text" defaultValue="300,000" readOnly/>
                        </div>
                    )}

                    <div className="form-group">
                        <label>납품요청일</label>
                        <input type="date" defaultValue="2024-10-07"/>
                    </div>

                    {orderNo && (
                        <div className="form-group">
                            <label>주문 등록일</label>
                            <input type="date" defaultValue="2024-09-07" readOnly className="readonly"/>
                        </div>
                    )}

                    <div className="form-group">
                        <label>담당자</label>
                        <span type="text"> 한정우 </span>
                    </div>

                    {orderNo && (
                        <div className="form-group">
                            <label>주문 상태</label>
                            <span type="text"> 처리중 </span>
                        </div>
                    )}
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
                            <div>
                                <h4>상품 검색</h4>
                                <input
                                    type="text"
                                    placeholder="상품명 검색"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="search-modal" onClick={handleSearch}>검색</button>
                                <button className="close-modal" onClick={closeModal}>닫기</button>
                            </div>
                            <div className="search-results">
                                {searchResults.length > 0 ? (
                                    searchResults.map((result, index) => (
                                        <div key={index} className="search-item">
                                            {result.name} - {result.price} - {result.quantity}
                                        </div>
                                    ))
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
                {orderNo ? (
                    <>
                        {mode === 'edit' && (
                            <button className="orderDetail-edit" onClick={handleEditClick}>수정</button>
                        )}
                        <button className="orderDetail-edit" onClick={handleEditSubmitClick}>수정 완료</button>
                        <button className="orderDetail-close" onClick={handleCloseClick}>삭제</button>
                    </>
                ) : (
                    <button className="orderDetail-edit" onClick={handleRequestApproval}>결재요청</button>
                )}
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

export default Order;
