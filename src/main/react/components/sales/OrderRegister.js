import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/Order.css'; // 개별 CSS 스타일 적용


function OrderRegister() {

    return (
        <Layout currentMenu="orderRegister">
            <div>
                <h3 className="app">ORDER REGISTER 화면입니다.</h3>
            </div>

            <h1>주문 등록 화면입니다.2</h1>
            {/* 페이지별 주요 컨텐츠 */}
        </Layout>

    )
}
//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderRegister />
    </BrowserRouter>
);