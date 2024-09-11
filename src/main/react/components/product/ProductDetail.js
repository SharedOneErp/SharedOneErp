import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Route, Routes, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductDetail.css';
import {formatDate} from '../../util/dateUtils'

//import {response} from "express"; // 개별 CSS 스타일 적용

function ProductDetail() {
    const [searchParams] = useSearchParams();
    const productCd = searchParams.get('no');
    const [productDetail, setProductDetail] = useState([]);

    useEffect(() => {
        if (productCd) { // productCd가 있을 때만 fetch 요청
            fetch(`/api/products/productDetail/${productCd}`)
                .then(response => response.json())
                .then(data => setProductDetail(data))
                .catch(error => console.error('상세 정보 조회 실패', error))
        }
    }, [productCd]);

    console.log(productCd);
    console.log(productDetail);

    const handleListClick = () => {
        window.location.href = "/productList";
    };

    return (
        <Layout currentMenu="ProductDetail">
            <h1>상품 상세</h1>
            <div className="product-detail-container">
                <div className="form-group">
                    <label htmlFor="productName">상품명</label>
                    <input
                        type="text"
                        id="productName"
                        value={productDetail[0]?.productNm}
                        readOnly/>
                </div>
                <div className="form-group">
                    <label htmlFor="productCode">상품코드</label>
                    <input
                        type="text"
                        id="productCode"
                        value={productDetail[0]?.productCd}
                        readOnly/>
                </div>
                <div className="form-group">
                    <label>카테고리</label>
                    <div className="category-inputs">
                        <span className="category-item" id="category1">{productDetail[0]?.topCategory}</span>
                        <span className="category-item" id="category2">{productDetail[0]?.middleCategory}</span>
                        <span className="category-item" id="category3">{productDetail[0]?.lowCategory}</span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="registrationDate">상품 등록일</label>
                    <input type="text" id="registrationDate" value={formatDate(productDetail[0]?.productInsertDate)}
                           readOnly/>
                </div>
                <div className="form-group">
                    <label htmlFor="registrationDate">상품 수정일</label>
                    <input type="text" id="registrationDate" value={formatDate(productDetail[0]?.productUpdateDate)}
                           readOnly/>
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
                    {productDetail.map((detail, index) => ( //slice(0, 5)
                        <tr key={index}>
                            <td>{formatDate(detail.orderDDeliveryRequestDate)}</td>
                            <td>{detail.customerName}</td>
                            <td>{detail.orderDQty}</td>
                            <td>{detail.orderDTotalPrice.toLocaleString()}</td>
                            <td>{detail.employeeName}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="note">
                * 최근 거래내역은 최대 5건까지 표시됩니다
            </div>
            <div className="button-container">
                <button className="approval-button" onClick={handleListClick}>목록</button>
                <button className="print-button">인쇄</button>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/productDetail" element={<ProductDetail/>}/>
        </Routes>
    </BrowserRouter>
);