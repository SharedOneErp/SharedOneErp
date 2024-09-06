import React, {useState} from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import '../../Main.css' //css파일 임포트
import Layout from "../../layout/Layout";
import {BrowserRouter} from "react-router-dom"; //css파일 임포트
import '../../../resources/static/css/OrderListAssigned.css';


function OrderListAssinged() {

    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customer'); // 필터기본값
    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지기본값
    const [currentPage, setCurrentPage] = useState(1);

    const orders = [
        { id: 1, customer: '네이버', date: '2024-08-27', status: '결제완료', items: '사무용 의자 블랙시 S 외 1종', total: 1500000 },
        { id: 2, customer: '카카오', date: '2024-08-27', status: '결제완료', items: '사무용 의자 블랙시 A', total: 200000 },
        { id: 3, customer: '쿠팡', date: '2024-08-28', status: '결제완료', items: '구매 의자 C', total: 800000 },
        { id: 4, customer: '쿠팡', date: '2024-08-28', status: '반려', items: '미팅용 소파 A', total: 3000000 },
        { id: 5, customer: '쿠팡', date: '2024-09-03', status: '반려', items: '미팅용 소파 B', total: 3000000 },
        // 추가 데이터
    ];

    // 필터 처리
    const filteredOrders = orders.filter(order => {
        if (filterType === 'customer') return order.customer.includes(filter);
        if (filterType === 'date') return order.date.includes(filter);
        if (filterType === 'status') return order.status.includes(filter);
        if (filterType === 'items') return order.items.includes(filter);
        return true;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    return (
        <Layout>
            <div className="filter-section">
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="customer">고객사</option>
                    <option value="date">주문 등록일</option>
                    <option value="status">주문 상태</option>
                    <option value="items">물품(계약) 리스트</option>
                </select>
                <input type="text" placeholder="검색어 입력" value={filter} onChange={(e) => setFilter(e.target.value)}/>
                <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>
                <br/>
                <button className="filter-button" onClick={() => setFilter('')}>전체</button>
                <button className="filter-button" onClick={() => setFilter('결제중')}>결제중</button>
                <button className="filter-button" onClick={() => setFilter('결제완료')}>결제완료</button>
                <button className="filter-button" onClick={() => setFilter('반려')}>반려</button>
            </div>

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
                        <tr key={order.id}>
                            <td>{String(order.id).padStart(3, '0')}</td>
                            <td>{order.customer}</td>
                            <td>{order.date}</td>
                            <td>{order.status}</td>
                            <td>{order.items}</td>
                            <td>{order.total.toLocaleString()}</td>
                            <td><a href={`/order/${order.id}`}>내역 보기</a></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-buttons">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
                {Array.from({length: totalPages}, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음
                </button>
            </div>
        </Layout>
    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderListAssinged />
    </BrowserRouter>
);