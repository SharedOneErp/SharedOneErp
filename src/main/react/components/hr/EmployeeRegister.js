import React, {useState} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Routes, Route} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/hr/EmployeeRegister.css'; // 개별 CSS 스타일 적용

// 컴포넌트
function EmployeeRegister() {
    return (
        <Layout currentMenu="employeeRegister"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <div className="top-container">
                <h2>직원 등록</h2>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <EmployeeRegister/> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);