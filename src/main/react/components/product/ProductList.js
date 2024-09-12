import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 파일 임포트
import {useHooksList} from "./ProductHooks"; // 상품 관리에 필요한 상태 및 로직을 처리하는 훅


function ProductList() {

    const {
        products,
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        editMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleDeleteSelected
    } = useHooksList(); // 커스텀 훅 사용

    const [isAdding, setIsAdding] = useState(false); // 상품 등록시 한 줄 추가하기


    // 등록 버튼 클릭 시 처리할 함수
    const handleAddNewPrice = () => {
        console.log('새 가격 정보 등록:', newPriceData);
        setIsAdding(false); // 추가 행 숨기기
    };

    // 취소 버튼 클릭 시 처리할 함수
    const handleCancelAdd = () => {
        setIsAdding(false); // 추가 행 숨기기
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct({ ...editableProduct, [name]: value });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const [selectedTopCategory, setSeletedTopCategory] = useState('');
    const [selectedMiddleCategory, setSeletedMiddleCategory] = useState('');

    const topCategories = [...new Set(products.map(product => product.topCategory))];
    const middleCategories = [...new Set(products
        .filter(product => product.topCategory === selectedTopCategory)
        .map(product => product.middleCategory))];
    const lowCategories = [...new Set(products
        .filter(product => product.middleCategory === selectedMiddleCategory)
        .map(product => product.lowCategory))];

    return (
        <Layout currentMenu="productList">
            <div className="top-container">
                <h2>전체 상품 목록</h2>
            </div>
            <div className="middle-container">
                <form className="search-box-container">
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "5px" }}>카테고리 </span>
                        <select className="approval-select" onChange={e => setSeletedTopCategory(e.target.value)}>
                            <option>대분류</option>
                            {topCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <select className="approval-select" onChange={e => setSeletedMiddleCategory(e.target.value)}>
                            <option>중분류</option>
                            {middleCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <select className="approval-select">
                            <option>소분류</option>
                            {lowCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select className="approval-select">
                            <option>상품명</option>
                            <option>상품번호</option>
                        </select>
                        <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                        <button type="submit" className="search-button">검색</button>
                    </div>
                </form>
            </div>
            <div className="bottom-container">
                <button className="btn_add" onClick={() => setIsAdding(true)}><i className="bi bi-plus-circle"></i> 추가하기
                </button>
                <label>
                    <p>전체 {products.length}건 페이지 당:</p>
                    <select>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>
                <table className="approval-list">
                    <thead>
                    <tr>
                        <th><input type="checkbox" onChange={(e) => handleAllSelectProducts(e.target.checked)}/></th>
                        <th>상품번호</th>
                        <th>상품명</th>
                        <th>대분류</th>
                        <th>중분류</th>
                        <th>소분류</th>
                        <th>상품 등록일</th>
                        <th>상품 수정일</th>
                        <th>상세</th>
                        <th>수정</th>
                    </tr>
                    </thead>
                    <tbody className="approval-list-content">
                    {products.map((product, index) => (
                        <tr key={product.productCd}
                            className={`${selectedProducts.includes(product.productCd) ? 'selected' : ''} ${editMode === product.productCd ? 'edit-mode-active' : ''}`}>
                            <td><input type="checkbox" onChange={() => handleSelectProduct(product.productCd)}
                                       checked={selectedProducts.includes(product.productCd)}/></td>
                            <td>{product.productCd}</td>
                            <td>
                                {editMode === product.productCd ? (
                                    <input type="text" name="productNm" value={editableProduct.productNm}
                                           onChange={handleInputChange}/>
                                ) : (
                                    product.productNm
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="topCategory" value={editableProduct.topCategory}
                                            onChange={handleInputChange}>
                                        {topCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.topCategory
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="middleCategory" value={editableProduct.middleCategory}
                                            onChange={handleInputChange}>
                                        {middleCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.middleCategory
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="lowCategory" value={editableProduct.lowCategory}
                                            onChange={handleInputChange}>
                                        {lowCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.lowCategory
                                )}
                            </td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td><a href={`/productDetail?no=${product.productCd}`}>상세</a></td>
                            <td>
                                {editMode === product.productCd ? (
                                    <button className="product-confirm-button" onClick={handleConfirmClick}>확인</button>
                                ) : (
                                    <button className="product-edit-button"
                                            onClick={() => handleEditClick(product)}>수정</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div>
                <div className="button-container">
                    <button className="filter-button" onClick={handleDeleteSelected}>삭제</button>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><ProductList /></BrowserRouter>);
