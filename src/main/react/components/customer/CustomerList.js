import React, {useState} from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import '../../../resources/static/css/Main.css' //css파일 임포트
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import {BrowserRouter} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import '../../../resources/static/css/customer/CustomerList.css'; // 개별 CSS 스타일 적용


function CustomerList() {

    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customer'); // 필터기본값
    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지기본값
    const [currentPage, setCurrentPage] = useState(1);

    const customers = [
        {id: 1, customer: '쿠팡', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'},
        {id: 2, customer: '삼성', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'},
        {id: 3, customer: 'LG', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'},
        {id: 4, customer: '쿠팡2', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'},
        {id: 5, customer: '중앙정보', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'},
        {id: 6, customer: '학원', customerCode: 'SA00010', businessRegNo: '123-456-7890', countryCode: 'KR', team: '영업팀', name: '박서희', detail: '내역보기'}
        // 추가 데이터
    ];

    // 필터 처리
    const filteredCustomers = customers.filter(customer => {
        if (filterType === 'customer') return customer.customer.includes(filter);
        if (filterType === 'businessRegNo') return customer.businessRegNo.includes(filter);
        if (filterType === 'countryCode') return customer.countryCode.includes(filter);
        if (filterType === 'team') return customer.team.includes(filter);
        if (filterType === 'name') return customer.name.includes(filter);
        return true;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <Layout>
            <h1>고객사 목록</h1>

            <div className="filter-section">
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="number">No</option>
                    <option value="customer">고객명</option>
                    <option value="businessRegNo">사업자 등록번호</option>
                    <option value="countryCode">국가코드</option>
                    <option value="team">담당팀</option>
                    <option value="name">담당자</option>
                </select>
                <input type="text" placeholder="검색어 입력" value={filter} onChange={(e) => setFilter(e.target.value)}/>
                <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>

                <div className="pagination-section">
                    전체 {filteredCustomers.length}건 페이지 당
                    <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                        <option value={100}>100</option>
                        <option value={50}>50</option>
                        <option value={20}>20</option>
                    </select>
                </div>

                <table className="customer-table">
                    <thead>
                    <tr>
                        <th>No</th>
                        <th>고객명</th>
                        <th>고객코드</th>
                        <th>사업자 등록번호</th>
                        <th>국가코드</th>
                        <th>담당팀</th>
                        <th>담당자</th>
                        <th>상세내역</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredCustomers
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map(customer => (
                            <tr key={customer.id}>
                                <td>{String(customer.id).padStart(3, '0')}</td>
                                <td>{customer.customer}</td>
                                <td>{customer.customerCode}</td>
                                <td>{customer.businessRegNo}</td>
                                <td>{customer.countryCode}</td>
                                <td>{customer.team}</td>
                                <td>{customer.name}</td>
                                <td><a href={`/customer?no=${customer.id}`}>내역보기</a></td>
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
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <CustomerList/> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);