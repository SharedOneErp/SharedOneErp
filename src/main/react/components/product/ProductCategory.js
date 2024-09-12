import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductCategory.css'; // 개별 CSS 스타일 적용

// 컴포넌트
function ProductCategory() {



    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <div className="top-container">
                <h2>상품 카테고리 관리</h2>
            </div>

            <div className='container1'>
                {/* 대분류 */}
                <div className='category-column'>
                    <h3>대분류</h3>
                    <input type='text' placeholder='대분류 입력' className='input-field'/>
                    <button className='search-button'>검색</button>
                    <br/>
                    <ul className='category-list'>
                        <li>대1</li>
                        <li>대2</li>
                        <li>대3</li>
                        <li>대4</li>
                    </ul>
                    <input type='text' placeholder='새 대분류 추가' className='input-field'/>
                    <button className='register-button'>등록</button>
                </div>
                {/* 중분류 */}
                <div className='category-column'>
                    <h3>중분류</h3>
                    <input type='text' placeholder='중분류 입력' className='input-field'/>
                    <button className='search-button'>검색</button>
                    <br/>
                    <ul className='category-list'>
                        <li>중1</li>
                        <li>중2</li>
                        <li>중3</li>
                        <li>중4</li>
                    </ul>
                    <input type='text' placeholder='새 중분류 추가' className='input-field'/>
                    <button className='register-button'>등록</button>
                </div>
                {/* 소분류 */}
                <div className='category-column'>
                    <h3>소분류</h3>
                    <input type='text' placeholder='소분류 입력' className='input-field'/>
                    <button className='search-button'>검색</button>
                    <br/>
                    <ul className='category-list'>
                        <li>소1</li>
                        <li>소2</li>
                        <li>소3</li>
                        <li>소4</li>
                    </ul>
                    <input type='text' placeholder='새 소분류 추가' className='input-field'/>
                    <button className='register-button'>등록</button>
                </div>


            </div>

            


            
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);