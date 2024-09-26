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
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [recentHiresCount, setRecentHiresCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [orderStatusCount, setOrderStatusCount] = useState({
        ingCount: 0,
        approvedCount: 0,
        deniedCount: 0,
    });
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [recentProductCount, setRecentProductCount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [settlementInfo, setSettlementInfo] = useState({
        approvedTotal: 0,
        deniedTotal: 0,
        settlementDeadline: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 전체 주문 수, 상태별 주문 각각
                const orderStatusResponse = await axios.get('/api/order/status/count');
                const { ingCount, approvedCount, deniedCount } = orderStatusResponse.data;
                setOrderStatusCount({ ingCount, approvedCount, deniedCount });
                setOrderCount(ingCount + approvedCount + deniedCount);

                // 전체 직원 수 가져오기
                const employeesResponse = await axios.get('/api/employeeCount');
                setTotalEmployees(employeesResponse.data);

                // 최근 채용 직원 수
                const recentHiresResponse = await axios.get('/api/employeeRecentCount');
                setRecentHiresCount(recentHiresResponse.data);

                // 총 고객사 수 가져오기
                const customersResponse = await axios.get('/api/customer/count');
                setTotalCustomers(customersResponse.data);

                // 상품 수를 가져오기
                const productCountsResponse = await axios.get('/api/products/productCounts');
                const { totalProductCount, recentProductCount } = productCountsResponse.data;
                setTotalProductCount(totalProductCount);
                setRecentProductCount(recentProductCount);

                // 판매량 가져오기
                const totalSalesResponse = await axios.get('/api/totalSales');
                setTotalSales(totalSalesResponse.data || 0);

                // 정산 정보 가져오기
                const settlementResponse = await axios.get('/api/order/settlement');
                setSettlementInfo(settlementResponse.data);

                // 최근 신규 고객 가져오기
                const recentCustomersResponse = await axios.get('/api/customer/recent');
                setRecentCustomers(recentCustomersResponse.data);

                // 계약 갱신 예정 고객 가져오기
                const renewalCustomersResponse = await axios.get('/api/customer/renewals');
                setRenewalCustomers(renewalCustomersResponse.data);

            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
                window.showToast("데이터를 가져오는 데 실패했습니다.", 'error');
            }
        };

        fetchData();
    }, []);

    return (
        <Layout currentMenu="main">
            <main className="main-content dashboard-container">
                <div className="card card-large">
                    <h3><i className="bi bi-people-fill"></i> 인사 관리</h3>
                    <div className="info-group">
                        <p>전체 직원 수: {totalEmployees}명</p>
                        <p>최근 채용: {recentHiresCount}명</p>
                    </div>
                </div>
                <div className="card card-large">
                    <h3><i className="bi bi-bar-chart-line-fill"></i> 영업 관리</h3>
                    <div className="info-group">
                        <p>총 주문건 수: {orderCount}건</p>
                        <p>결재중: {orderStatusCount.ingCount}건</p>
                        <p>결재완료: {orderStatusCount.approvedCount}건</p>
                        <p>반려: {orderStatusCount.deniedCount}건</p>
                    </div>
                </div>
                <div className="card card-large">
                    <h3><i className="bi bi-building"></i> 고객 관리</h3>
                    <div className="info-group">
                        <p> 총 고객사 수: {totalCustomers}개 </p>
                        <p> 최근 신규 고객: {recentCustomers.length}개</p>
                        <p> 계약 갱신 예정: {renewalCustomers.length}개 </p>
                    </div>
                </div>
                <div className="card card-full">
                    <h3><i className="bi bi-box-seam"></i> 상품 관리</h3>
                    <div className="info-group">
                        <p>상품 전체 수량: {totalProductCount}개</p>
                        <p>신상품 등록: {recentProductCount}개</p>
                        <p>최근 판매량: {totalSales}개</p>
                    </div>
                </div>
                <div className="card">
                    <h3><i className="bi bi-cash-coin"></i> 정산 관련 안내</h3>
                    <div className="info-group">
                        <p>정산금액: ₩{(settlementInfo.approvedTotal || 0).toLocaleString()}</p>
                        <p>정산 마감일: {settlementInfo.settlementDeadline || '정보 없음'}</p>
                        <p>미수금: ₩{(settlementInfo.deniedTotal || 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="card">
                    <h3><i className="bi bi-megaphone-fill"></i> 공지사항</h3>
                    <div className="info-group">
                        <p>새로운 이벤트: 가을 세일</p>
                        <p>공지사항 업데이트: 2024년 9월 1일</p>
                        <p>다음 회의 일정: 2024년 9월 10일</p>
                    </div>
                </div>
                <div className="card">
                    <h3><i className="bi bi-graph-up-arrow"></i> 영업 실적 보고서</h3>
                    <div className="info-group">
                        <p>총 매출: ₩5,000,000</p>
                        <p>총 주문 수: 150건</p>
                        <p>월간 목표 달성율: 85%</p>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Main />
    </BrowserRouter>
);
