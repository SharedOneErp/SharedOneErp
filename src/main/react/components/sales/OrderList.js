import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/sales/OrderList.css';

const fetchOrders = async () => {
    try {
        const response = await fetch('/api/order/all');
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return [];
    }
};

function OrderList() {
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customer');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [role, setRole] = useState('');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const userRole = searchParams.get('role') || 'admin';
        setRole(userRole);

        fetchOrders().then(data => {
            setOrders(data);
        }).catch(err => {
            setError('문제가 발생했습니다. 주문 목록을 가져올 수 없습니다.');
        });
    }, [searchParams]);

    // 필터 처리
    const filteredOrders = orders.filter(order => {
        const customerName = order.customer?.customerName || '';
        const orderDate = order.orderHInsertDate?.split('T')[0] || ''; // 날짜만 추출
        const orderStatus = order.orderHStatus || '';
        const productNames = order.productNames || ''; // 예시: productNames가 존재하는 경우

        if (filterType === 'customer') return customerName.includes(filter);
        if (filterType === 'date') return orderDate.includes(filter);
        if (filterType === 'status') return orderStatus.includes(filter);
        if (filterType === 'items') return productNames.includes(filter);
        return true;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    return (
        <Layout currentMenu="orderList">
            <main className="main-content menu_order_list">
                <h1>{role === 'admin' ? '전체 주문 목록' : '담당 주문 목록'}</h1>

                {error && <div className="error-message">{error}</div>}

                <div className="filter-section">
                    <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                        <option value="customer">고객사</option>
                        <option value="date">주문 등록일</option>
                        <option value="status">주문 상태</option>
                        <option value="items">물품(계약) 리스트</option>
                    </select>
                    <input type="text" placeholder="검색어 입력" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>
                    <br />
                    <button className="filter-button" onClick={() => { setFilter(''); setCurrentPage(1); }}>전체</button>
                    <button className="filter-button" onClick={() => { setFilter('결제중'); setCurrentPage(1); }}>결제중</button>
                    <button className="filter-button" onClick={() => { setFilter('결제완료'); setCurrentPage(1); }}>결제완료</button>
                    <button className="filter-button" onClick={() => { setFilter('반려'); setCurrentPage(1); }}>반려</button>

                    <div className="pagination-section">
                        전체 {filteredOrders.length}건 페이지 당
                        <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                            <option value={100}>100</option>
                            <option value={50}>50</option>
                            <option value={20}>20</option>
                        </select>
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
                                    <td>{order.orderHStatus || 'N/A'}</td>
                                    <td>{order.productNames || 'N/A'}</td>
                                    <td>{order.orderHTotalPrice?.toLocaleString() || 'N/A'}</td>
                                    <td><a href={`/order?no=${order.orderNo}`}>내역 보기</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-buttons">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
                    </div>
                </div>
            </main>
        </Layout>
    );
}

// 페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderList />
    </BrowserRouter>
);
