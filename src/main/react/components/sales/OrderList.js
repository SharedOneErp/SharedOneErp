import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/sales/OrderList.css';

const fetchOrders = async () => {
    try {
        const response = await fetch('/api/order/all');
        if (!response.ok) {
            throw new Error('네트워크 연결이 불안정합니다.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
};

const fetchEmployee = async () => {
    try {
        const response = await fetch('/api/employee', {
            credentials: "include", // 세션 포함
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('사용자 정보를 가져오는 데 실패했습니다.');
            return null;
        }
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        return null;
    }
};

function OrderList() {
    const [filterValue, setFilterValue] = useState('');
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customer');
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [role, setRole] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(''); // 상태

    const [searchParams] = useSearchParams();

    const applyFilter = (filterValue) => {
        setFilter(filterValue);
        setFilterType("status");
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);
        applyFilter(status);
    };

    const mapStatusFromDbToUi = (dbStatus) => {
        switch (dbStatus) {
            case 'ing':
                return '결제중';
            case 'approved':
                return '결제완료';
            case 'denied':
                return '반려';
            default:
                return '알 수 없음';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 직원 정보 가져오기
                const empData = await fetchEmployee();
                if (empData) {
                    setRole(empData.employeeRole);
                    setEmployeeId(empData.employeeId);
                }
                // 주문 정보 가져오기
                const orderData = await fetchOrders();

                // 주문 필터링
                if (empData.employeeRole === 'admin') {
                    setOrders(orderData); // 관리자일 경우 모든 주문 표시
                } else {
                    const filteredOrders = orderData.filter(order => order.employee.employeeId === empData.employeeId);
                    setOrders(filteredOrders);
                }
            } catch (err) {
                alert('해당 페이지에 접근 권한이 없습니다.');
                window.location.href = '/main';
            } finally {
                setLoading(false); // 데이터 로딩 완료
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Layout currentMenu="orderList">
                <main className="main-content menu_order_list">
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </main>
            </Layout>
        );
    }

    const filteredOrders = orders.filter(order => {
        const customerName = order.customer?.customerName || '';
        const orderDate = order.orderHInsertDate?.split('T')[0] || '';
        const orderStatus = mapStatusFromDbToUi(order.orderHStatus) || '';
        const productNames = (order.productNames || []).join(', ');
        const employeeName = order.employee?.employeeName || '';

        const matchesFilter = filterType === 'customer' ? customerName.includes(filter) :
            filterType === 'date' ? orderDate.includes(filter) :
                filterType === 'status' ? orderStatus.includes(filter) :
                    filterType === 'items' ? productNames.includes(filter) :
                        filterType === 'employee' ? employeeName.includes(filter) :
                            true;

        const matchesSearch = searchTerm ? [customerName, orderDate, orderStatus, productNames, employeeName].some(field => field.includes(searchTerm)) : true;

        return matchesFilter && matchesSearch;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const formatProductNames = (productNames) => {
        if (!Array.isArray(productNames)) return 'N/A';
        if (productNames.length <= 1) {
            return productNames.join(', ');
        } else {
            return `${productNames[0]} 외 ${productNames.length - 1}건`;
        }
    };

    return (
        <Layout currentMenu="orderList">
            <main className="main-content menu_order_list">
                <div className="orderList-title">
                    <h3>{role === 'admin' ? '전체 주문 목록' : '담당 주문 목록'}</h3>
                </div>
                <div className="orderList-container">

                    {error && <div className="error-message">{error}</div>}
                    <div className="menu_content">
                        <div className="search_wrap">
                            <div className="left">
                                    <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                                        <option value="customer">고객사</option>
                                        <option value="date">주문 등록일</option>
                                        <option value="status">주문 상태</option>
                                        <option value="items">물품(계약) 리스트</option>
                                        {role === 'admin' && (
                                            <option value="employee">담당자</option>
                                        )}
                                    </select>

                                    <div className="search_box">
                                        <i className="bi bi-search"></i>
                                        <input
                                            type="text"
                                            className="box search"
                                            placeholder="검색어 입력"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        /></div>

                                    <br/>
                                    <div className="radio_box">
                                        <span>상태</span>
                                        <input
                                            type="radio"
                                            id="all"
                                            name="status"
                                            value=""
                                            checked={selectedStatus === ''}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="all">전체</label>

                                        <input
                                            type="radio"
                                            id="pending"
                                            name="status"
                                            value="결제중"
                                            checked={selectedStatus === '결제중'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="pending">결제중</label>

                                        <input
                                            type="radio"
                                            id="completed"
                                            name="status"
                                            value="결제완료"
                                            checked={selectedStatus === '결제완료'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="completed">결제완료</label>

                                        <input
                                            type="radio"
                                            id="rejected"
                                            name="status"
                                            value="반려"
                                            checked={selectedStatus === '반려'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="rejected">반려</label>
                                </div>
                            </div>

                            <div className="right">
                            <div className="pagination-section">
                                전체 {filteredOrders.length}건 페이지 당
                                <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                                    <option value={100}>100</option>
                                    <option value={50}>50</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                            </div>
                        </div>


                            <table className="order-table">
                                <thead>
                                <tr>
                                    <th>주문번호</th>
                                    <th>고객사</th>
                                    <th>주문 등록일</th>
                                    <th>주문 상태</th>
                                    <th>물품(계약) 리스트</th>
                                    <th>총액(원)</th>
                                    <th>담당자명</th>
                                    <th>내역 보기</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredOrders
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map(order => (
                                        <tr key={order.orderNo}>
                                            <td>{String(order.orderNo).padStart(3, '0')}</td>
                                            <td>{order.customer?.customerName || 'N/A'}</td>
                                            <td>{order.orderHInsertDate?.split('T')[0] || 'N/A'}</td>
                                            <td>{mapStatusFromDbToUi(order.orderHStatus) || 'N/A'}</td>
                                            <td>{formatProductNames(order.productNames || []) || 'N/A'}</td>
                                            <td>{order.orderHTotalPrice?.toLocaleString() + '원' || 'N/A'}</td>
                                            {role === 'admin' && (
                                                <td>
                                                    {order.employee?.employeeName || 'N/A'}
                                                </td>
                                            )}
                                            <td><a href={`/order?no=${order.orderNo}`}>내역 보기</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-buttons">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전
                                </button>
                                {Array.from({length: totalPages}, (_, i) => (
                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                ))}
                                <button disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}>다음
                                </button>
                            </div>

                    </div>
                </div>
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderList/>
    </BrowserRouter>
);
