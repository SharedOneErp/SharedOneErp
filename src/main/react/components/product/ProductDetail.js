import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductDetail.css'; // 개별 CSS 스타일 적용

function ProductDetail() {
    const handleListClick = () => {
        window.location.href = "/productList";
    };

    return (
        <Layout currentMenu="ProductDetail">
            <h1>상품 상세</h1>
            <div className="product-detail-container">
                <div className="form-group">
                    <label htmlFor="productName">상품명</label>
                    <input type="text" id="productName" defaultValue="의자A" />
                </div>
                <div className="form-group">
                    <label htmlFor="productCode">상품코드</label>
                    <input type="text" id="productCode" defaultValue="H0001" />
                </div>
                <div className="form-group">
                    <label>카테고리</label>
                    <div className="category-inputs">
                        <span className="category-item" id="category1">대분류</span>
                        <span className="category-item" id="category2">중분류</span>
                        <span className="category-item" id="category3">소분류</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="registrationDate">상품 등록일</label>
                    <input type="text" id="registrationDate" defaultValue="2024.09.07" />
                </div>
                <div className="form-group">
                    <label htmlFor="salesAmount">총 매출액(원)</label>
                    <input type="text" id="salesAmount" defaultValue="999,999,999,999" />
                </div>

                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>최근 납품일</th>
                            <th>거래처</th>
                            <th>수량</th>
                            <th>매출액(원)</th>
                            <th>담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2024.09.06</td>
                            <td>네이버</td>
                            <td>200</td>
                            <td>999,999</td>
                            <td>홍길동</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="note">
                * 최근 거래내역은 최대 5건까지 표시됩니다
            </div>
            <div className="button-container">
                <button className="approval-button" onClick={handleListClick}>목록</button>
                <button className="delete-button">수정</button>
                <button className="print-button">인쇄</button>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>

        <ProductDetail />
    </BrowserRouter>
);