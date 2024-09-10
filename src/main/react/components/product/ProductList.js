import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Routes, Route, Link} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 스타일 적용

function ProductList() {

    // 상품 목록 저장 state
    const [products, setProducts] = useState([]); // 전체 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 체크된 상품 목록

    useEffect(() => {
        fetch('/api/products/productList')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('전체 상품 목록 조회 실패', error))
    }, []);

    // 전체 선택
    const handleAllSelectProducts = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd); // 모든 상품의 ID를 배열로 만듭니다.
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    // 상품 선택
    const handleSelectProduct = (productCd) => {
        setSelectedProducts(prevSelected => {
            if(prevSelected.includes(productCd)) {
                return prevSelected.filter(cd => cd !== productCd);
            } else {
                const newSelectedProducts = [...prevSelected, productCd];
                console.log('선택된 상품코드', newSelectedProducts);
                return newSelectedProducts;
            }
        });
    };
    
    // 선택 상품 삭제 요청
    const handleDeleteSelected = () => {
        fetch('http://localhost:8787/api/products/productDelete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'},
            body: JSON.stringify(selectedProducts)
        })
            .then(response => {
                console.log(selectedProducts) // 현재 선택된 상품코드들
                if (!response.ok) {
                    throw new Error('상품 삭제 실패');
                }
                alert('상품이 삭제되었습니다');
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setSelectedProducts([]);
            })
            .catch(error => console.error(error));
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

    return (<Layout currentMenu="productList">
            <div className="top-container">
                <h2>전체 상품 목록</h2>
            </div>
            <div className="middle-container">
                <form className="search-box-container">
                    <div style={{marginBottom: "10px"}}>
                        <span style={{marginRight: "5px"}}>카테고리 </span>
                        <select className="approval-select">
                            <option>대분류</option>
                        </select>
                        <select className="approval-select">
                            <option>중분류</option>
                        </select>
                        <select className="approval-select">
                            <option>소분류</option>
                        </select>
                    </div>
                    <div>
                        <select className="approval-select">
                            <option>상품명</option>
                        </select>
                        <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                        <button type="submit" className="search-button">검색</button>
                    </div>
                </form>
            </div>
            <div className="bottom-container">
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
                        <th><input type="checkbox"
                                   onChange={(e) => handleAllSelectProducts(e.target.checked)}/></th>
                        <th>상품번호</th>
                        <th>상품명</th>
                        <th>대분류</th>
                        <th>중분류</th>
                        <th>소분류</th>
                        <th>상품 등록일</th>
                        <th>상품 수정일</th>
                        <th>상세보기</th>
                    </tr>
                    </thead>
                    <tbody className="approval-list-content">
                    {products.map((product, index) => (
                        <tr key={product.productCd}
                            className={selectedProducts.includes(product.productCd) ? 'selected' : ''}>
                            <td><input type="checkbox"
                                       onChange={() => handleSelectProduct(product.productCd)}
                                       checked={selectedProducts.includes(product.productCd)}/></td>
                            <td>{product.productCd}</td>
                            <td>{product.productNm}</td>
                            <td>{product.category?.categoryNo}</td>
                            <td>{product.category?.categoryNo}</td>
                            <td>{product.category?.categoryNo}</td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td><a href={`/productDetail?no=${product.productCd}`}>상세보기</a></td>
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
                    <button className="filter-button">수정</button>
                    <button className="filter-button" onClick={handleDeleteSelected}>삭제</button>
                    <button className="filter-button" onClick={() => window.location.href = '/product'}>등록</button>
                </div>

            </div>

        </Layout>

    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <ProductList/>
</BrowserRouter>);