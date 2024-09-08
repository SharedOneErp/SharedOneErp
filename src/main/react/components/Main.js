import React from 'react';
import ReactDOM from 'react-dom/client';
import '../Main.css';
import Layout from "../layout/Layout";
import { BrowserRouter } from "react-router-dom";

function Main() {
    return (
        <Layout currentMenu="main">
            <div className="dashboard-container">
                <div className="card card-large">
                    <h3>인사 관리</h3>
                    <div className="info-group">
                    <p>전체 직원 수: 120명</p>
                    <p>최근 채용: 5명</p>
                    <p>퇴사 예정: 2명</p>
                    </div>
                </div>
                <div className="card card-large">
                <h3>영업 관리</h3>
                    <div className="info-group">
                        <p>결재중: 0건</p>
                        <p>결재완료: 0건</p>
                        <p>반려: 0건</p>
                    </div>
                </div>
                <div className="card card-large">
                    <h3>고객 관리</h3>
                    <div className="info-group">
                    <p>총 고객사 수: 45개</p>
                    <p>최근 신규 고객: 3개</p>
                    <p>계약 갱신 예정: 7개</p>
                    </div>
                </div>
                <div className="card card-full">
                    <h3>상품관리</h3>
                    <div className="info-group">
                    <p>재고 현황: 1200개</p>
                    <p>신상품 등록: 8개</p>
                    <p>최근 판매량: 450개</p>
                    {/*    넣어도 될 것 같기도 하구요?*/}
                    </div>
                </div>
                <div className="card">
                    <h3>정산관련 안내</h3>
                    <div className="info-group">
                    <p>정산금액: ₩2,500,000</p>
                    <p>정산 마감일: 2024년 9월 15일</p>
                    <p>미수금: ₩300,000</p>
                    </div>
                </div>
                <div className="card">
                    <h3>공지사항</h3>
                    <div className="info-group">
                    <p>새로운 이벤트: 가을 세일</p>
                    <p>공지사항 업데이트: 2024년 9월 1일</p>
                    <p>다음 회의 일정: 2024년 9월 10일</p>
                    </div>
                </div>
                <div className="card">
                    <h3>영업 실적 보고서</h3>
                    <div className="info-group">
                    <p>총 매출: ₩5,000,000</p>
                    <p>총 주문 수: 150건</p>
                    <p>월간 목표 달성율: 85%</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>
);
