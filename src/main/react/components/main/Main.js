import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/common/Main.css';
import axios from 'axios';

function Main() {

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [renewalCustomers, setRenewalCustomers] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 모달 타입 추가

    useEffect(() => {
        // 총 고객사 수 가져오기
        axios.get('/api/customer/count')
            .then(response => {
                setTotalCustomers(response.data);
            })
            .catch(error => {
                console.error("총 고객사 수를 가져오는 중 오류 발생:", error);
                alert("총 고객사 수를 가져오는 데 실패했습니다.");
            });

        // 최근 신규 고객 가져오기
        axios.get('/api/customer/recent')
            .then(response => {
                setRecentCustomers(response.data);
            })
            .catch(error => {
                console.error("최근 신규 고객을 가져오는 중 오류 발생:", error);
                alert("최근 신규 고객을 가져오는 데 실패했습니다.");
            });

        // 계약 갱신 예정 고객 가져오기
        axios.get('/api/customer/renewals')
            .then(response => {
                setRenewalCustomers(response.data);
            })
            .catch(error => {
                console.error("계약 갱신 예정 고객을 가져오는 중 오류 발생:", error);
                alert("계약 갱신 예정 고객을 가져오는 데 실패했습니다.");
            });
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    // 모달 내용 렌더링 함수
    const renderModalContent = () => {
        if (modalType === 'total') {
            return (
                <div>
                    <h2>총 고객사 수</h2>
                    <p>총 고객사 수는 {totalCustomers}개 입니다.</p>
                </div>
            );
        } else if (modalType === 'recent') {
            return (
                <div>
                    <h2>최근 신규 고객</h2>
                    <ul>
                        {recentCustomers.map(customer => (
                            <li key={customer.customerNo}>{customer.customerName}</li>
                        ))}
                    </ul>
                </div>
            );
        } else if (modalType === 'renewal') {
            return (
                <div>
                    <h2>계약 갱신 예정 고객</h2>
                    <ul>
                        {renewalCustomers.map(customer => (
                            <li key={customer.customerNo}>{customer.customerName}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return null;
        }
    };

    return (
        <Layout currentMenu="main">
            <main className="main-content dashboard-container">
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
                        <p onClick={() => openModal('total')} style={{ cursor: 'pointer', color: 'blue' }}> 총 고객사 수: {totalCustomers}개 </p>
                        <p onClick={() => openModal('recent')} style={{ cursor: 'pointer', color: 'blue' }}> 최근 신규 고객: {recentCustomers.length}개</p>
                        <p onClick={() => openModal('renewal')} style={{ cursor: 'pointer', color: 'blue' }}> 계약 갱신 예정: {renewalCustomers.length}개 </p>
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

                {/* 고객관리 모달 */}
                {isModalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-button" onClick={closeModal}>&times;</span>
                            {renderModalContent()}
                        </div>
                    </div>
                )}
            </main>
        </Layout >
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>
);
