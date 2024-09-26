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
    const [totalSales, setTotalSales] = useState(0);
    const [last30DaysSales, setLast30DaysSales] = useState(0);
    const [orderStatusCount, setOrderStatusCount] = useState({
        ingCount: 0,
        approvedCount: 0,
        deniedCount: 0,
    });
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [recentProductCount, setRecentProductCount] = useState(0);
    const [annualSales, setAnnualSales] = useState(0);
    const [settlementInfo, setSettlementInfo] = useState({
        approvedTotal: 0,
        deniedTotal: 0,
        settlementDeadline: '',
    });
    const [deletedEmployees, setDeletedEmployees] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const startTime = performance.now(); // 요청 시작 시간
            try {
                const [
                    orderStatusResponse,
                    employeesResponse,
                    recentHiresResponse,
                    customersResponse,
                    productCountsResponse,
                    totalSalesResponse,
                    settlementResponse,
                    annualSalesResponse,
                    last30DaysSalesResponse,
                    recentCustomersResponse,
                    renewalCustomersResponse,
                    deletedEmployeesResponse
                ] = await Promise.all([
                    axios.get('/api/order/status/count'),
                    axios.get('/api/employeeCount'),
                    axios.get('/api/employeeRecentCount'),
                    axios.get('/api/customer/count'),
                    axios.get('/api/products/productCounts'),
                    axios.get('/api/totalSales'),
                    axios.get('/api/order/settlement'),
                    axios.get('/api/order/annual'),
                    axios.get('/api/order/lastMonth'),
                    axios.get('/api/customer/recent'),
                    axios.get('/api/customer/renewals'),
                    axios.get('/api/employeeCountDeleted')
                ]);

                const { ingCount, approvedCount, deniedCount } = orderStatusResponse.data;
                setOrderStatusCount({ ingCount, approvedCount, deniedCount });
                setOrderCount(ingCount + approvedCount + deniedCount);
                setTotalEmployees(employeesResponse.data);
                setRecentHiresCount(recentHiresResponse.data);
                setTotalCustomers(customersResponse.data);
                setTotalSales(totalSalesResponse.data || 0);
                const { totalProductCount, recentProductCount } = productCountsResponse.data;
                setTotalProductCount(totalProductCount);
                setRecentProductCount(recentProductCount);
                setAnnualSales(annualSalesResponse.data || 0);
                setLast30DaysSales(last30DaysSalesResponse.data || 0);
                setSettlementInfo(settlementResponse.data);
                setRecentCustomers(recentCustomersResponse.data);
                setRenewalCustomers(renewalCustomersResponse.data);
                setDeletedEmployees(deletedEmployeesResponse.data);

                const endTime = performance.now(); // 요청 종료 시간
                const duration = endTime - startTime; // 소요 시간 계산

                console.log(`요청 소요 시간: ${duration.toFixed(2)}ms`);

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
                <div className="card card-large" onClick={() => window.location.href = '/orderList?mode=Assigned'}>
                    <h3><i className="bi bi-bar-chart-line-fill"></i> 영업 관리</h3>
                    <div className="info-group">
                        <p><i className="bi bi-clock-fill"></i> 결재중 : {orderStatusCount.ingCount}건</p>
                        <p><i className="bi bi-check-circle-fill"></i> 결재완료 : {orderStatusCount.approvedCount}건</p>
                        <p><i className="bi bi-x-circle-fill"></i> 반려 : {orderStatusCount.deniedCount}건</p>
                    </div>
                </div>
                <div className="card card-large" onClick={() => window.location.href = '/customerList'}>
                    <h3><i className="bi bi-building"></i> 고객 관리</h3>
                    <div className="info-group">
                        <p><i className="bi bi-people-fill"></i> 총 고객사 수 : {(totalCustomers).toLocaleString()}개</p>
                        <p><i className="bi bi-person-add"></i> 최근 신규 고객 : {(recentCustomers.length).toLocaleString()}개
                        </p>
                        <p><i className="bi bi-arrow-clockwise"></i> 계약 갱신
                            예정 : {(renewalCustomers.length).toLocaleString()}개</p>
                    </div>
                </div>
                <div className="card card-large" onClick={() => window.location.href = '/employeeList'}>
                    <h3><i className="bi bi-people-fill"></i> 직원 관리</h3>
                    <div className="info-group">
                        <p><i className="bi bi-person-circle"></i> 전체 직원 수 : {totalEmployees}명</p>
                        <p><i className="bi bi-person-check-fill"></i> 최근 채용 인원 : {recentHiresCount}명</p>
                        <p><i className="bi bi-person-x-fill"></i> 최근 퇴직 인원  : {deletedEmployees}명</p>
                    </div>
                </div>
                <div className="card card-large" onClick={() => window.location.href = '/productList'}>
                    <h3><i className="bi bi-box-seam"></i> 상품 관리</h3>
                    <div className="info-group">
                        <p><i className="bi bi-box"></i> 상품 전체 수량 : {totalProductCount.toLocaleString()}개</p>
                        <p><i className="bi bi-star-fill"></i> 신상품 등록 : {recentProductCount.toLocaleString()}개</p>
                        <p><i className="bi bi-box-seam"></i> 최근 판매량  : {totalSales.toLocaleString()}개</p>
                        <p><i className="bi bi-list-check"></i> 월간 총 매출 : ₩{last30DaysSales.toLocaleString()}</p>
                    </div>
                </div>
                <div className="image-container">
                    <img src="/img/cardimg.jpg" alt="상품 이미지" className="logo-image"/>
                    <img src="/img/cardimg2.jpg" alt="상품 이미지" className="logo-image"/>
                </div>
                <div className="card" onClick={() => window.location.href = '/orderReport'}>
                    <h3><i className="bi bi-graph-up-arrow"></i> 주문 현황</h3>
                    <div className="info-group">
                        <p><i className="bi bi-list-check"></i> 총 주문 수 : {(orderCount).toLocaleString()}건</p>
                        <p><i className="bi bi-cash-coin"></i> 연간 총 매출 : ₩{(annualSales || 0).toLocaleString()}</p>
                        <p><i className="bi bi-check-all"></i> 연 매출 목표 달성율 : ₩{(annualSales || 0).toLocaleString()}/₩100,000,000
                            ({((annualSales / 100000000) * 100).toFixed(2)}%)</p>
                    </div>
                </div>
                <div className="card">
                    <h3><i className="bi bi-cash-coin"></i> 정산</h3>
                    <div className="info-group">
                        <p><i className="bi bi-cash-stack"></i> 정산금액 :
                            ₩{(settlementInfo.approvedTotal || 0).toLocaleString()}</p>
                        <p><i className="bi bi-calendar-date"></i> 정산
                            마감일 : {settlementInfo.settlementDeadline || '정보 없음'}</p>
                        <p><i className="bi bi-credit-card"></i> 미수금 :
                            ₩{(settlementInfo.deniedTotal || 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="card">
                    <h3><i className="bi bi-megaphone-fill"></i> 공지사항</h3>
                    <div className="info-group">
                        <p><i className="bi bi-bell-fill"></i> 새로운 이벤트 : 쉐어드원 자사 방문일</p>
                        <p><i className="bi bi-info-circle-fill"></i> 공지사항 업데이트 : 2024년 9월 26일</p>
                        <p><i className="bi bi-calendar-event"></i> 다음 회의 일정 : 2024년 9월 27일</p>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Main/>
    </BrowserRouter>
);
