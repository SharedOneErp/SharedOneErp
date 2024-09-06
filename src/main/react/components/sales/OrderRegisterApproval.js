import React, {useState} from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import '../../Main.css' //css파일 임포트
import Layout from "../../layout/Layout";
import {BrowserRouter, Routes, Route} from "react-router-dom"; //css파일 임포트
import '../../../resources/static/css/OrderRegisterApproval.css'; // CSS 모듈 임포트
import OrderRegisterApprovalDetail from './OrderRegisterApprovalDetail';

function OrderRegisterApproval() {

    return (
        <Layout>
            <div className="top-container">
                <h2>주문 등록 승인</h2>
                <p>영업 관리</p>
            </div>
            <div className="middle-container">
                <form className="search-box-container">
                    <select className="approval-select">
                        <option>담당자</option>
                        <option>거래처</option>
                    </select>
                    <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                    <button type="submit" className="search-button">검색</button>
                </form>
                <div className="approval-filter">
                    <button className="btn1" type="button">전체</button>
                    <button className="btn2" type="button">결재중</button>
                    <button className="btn3" type="button">결재완료</button>
                    <button className="btn4" type="button">반려</button>
                </div>
            </div>
            <div className="bottom-container">
                <label>
                    <p>전체 100건 페이지 당:</p>
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
                            <th>선택</th>
                            <th>주문번호</th>
                            <th>거래처</th>
                            <th>물품</th>
                            <th>총액(원)</th>
                            <th>납품 요청일</th>
                            <th>주문 등록일</th>
                            <th>담당자</th>
                            <th>주문 상태</th>
                            <th>내역보기</th>
                        </tr>
                    </thead>
                    <tbody className="approval-list-content">
                    <tr>
                        <td><input type="checkbox"/></td>
                        <td>A001</td>
                        <td>카카오</td>
                        <td>의자 외 1건</td>
                        <td>999,999</td>
                        <td>2024-10-30</td>
                        <td>2024-9-3</td>
                        <td>홍길동</td>
                        <td>결재완료</td>
                        <td><a href="/orderRegisterApprovalDetail">내역 보기</a></td>
                    </tr>s
                    <tr>
                        <td><input type="checkbox"/></td>
                        <td>A002</td>
                        <td>네이버</td>
                        <td>책상 외 1건</td>
                        <td>222,999</td>
                        <td>2024-11-30</td>
                        <td>2024-9-6</td>
                        <td>유관순</td>
                        <td>결재중</td>
                        <td><a href="#">내역 보기</a></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox"/></td>
                        <td>A003</td>
                        <td>삼성</td>
                        <td>책장 외 1건</td>
                        <td>2555,999</td>
                        <td>2024-12-30</td>
                        <td>2024-9-8</td>
                        <td>김세종</td>
                        <td>결재중</td>
                        <td><a href="#">내역 보기</a></td>
                    </tr>
                    {/* 반복문으로 데이터 */}
                    </tbody>
                </table>
                <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div>
                <div className="bottom-button">
                    <button className="approval-button">승인</button>
                    <button className="delete-button">삭제</button>
                    <button className="print-button">인쇄</button>
                </div>
            </div>

        </Layout>

    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderRegisterApproval/>
    </BrowserRouter>
);