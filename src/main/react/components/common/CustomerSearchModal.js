// src/main/react/components/common/CustomerSearchModal.js
import React, { useState } from 'react';

function CustomerSearchModal({ onClose, onCustomerSelect }) {
    // 검색어 및 검색 결과 상태 관리
    const [searchQuery, setSearchQuery] = useState(''); // 고객사 검색어 상태
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객사 검색 결과 상태
    const [currentPageCustomer, setCurrentPageCustomer] = useState(1); // 현재 페이지 상태

    const itemsPerPageCustomer = 10; // 페이지당 항목 수
    const totalCustomerPages = Math.ceil(customerSearchResults.length / itemsPerPageCustomer); // 전체 페이지 수 계산
    const indexOfLastCustomerResult = currentPageCustomer * itemsPerPageCustomer; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstCustomerResult = indexOfLastCustomerResult - itemsPerPageCustomer; // 현재 페이지의 첫 번째 항목 인덱스
    const paginatedCustomerSearchResults = customerSearchResults.slice(indexOfFirstCustomerResult, indexOfLastCustomerResult); // 페이지에 맞는 항목 추출

    // 고객사 검색 처리 함수 (비동기)
    const customerSearch = async () => {
        try {
            // 검색 API 호출
            const response = await axios.get(`/api/customer/search`, {
                params: {
                    name: searchQuery // 고객사 이름 필터
                }
            });
            const data = response.data; // axios는 자동으로 JSON 응답을 변환
            setCustomerSearchResults(data); // 검색 결과 상태 업데이트
            setCurrentPageCustomer(1); // 검색 후 페이지를 첫 페이지로 초기화
        } catch (error) {
            // 오류 처리
            console.error('검색 중 오류 발생:', error);
            setCustomerSearchResults([]); // 검색 결과 초기화
        }
    };

    // 페이지 변경 처리 함수
    const handlePageChangeCustomer = (pageNumber) => {
        setCurrentPageCustomer(pageNumber); // 페이지 번호 상태 업데이트
    };

    return (
        <div className="modal_container">
            <div className="header">
                <h4>고객사 검색</h4>
                <button className="btn_close" onClick={onClose}>&times;</button> {/* 모달 닫기 버튼 */}
            </div>
            <div className="search_wrap">
                {/* 고객사 검색어 입력 필드 */}
                <input
                    type="text"
                    placeholder="검색하실 고객사를 입력하세요"
                    value={searchQuery} // 입력된 검색어 상태값
                    onChange={(e) => setSearchQuery(e.target.value)} // 검색어 변경 처리
                />
                {/* 검색 버튼 */}
                <button className="box color" onClick={customerSearch}>검색</button>
            </div>
            <div className="list_wrap">
                {/* 검색 결과가 있을 경우 목록을 출력 */}
                {customerSearchResults.length > 0 ? (
                    <table className="search-results-table">
                        <thead>
                            <tr>
                                <th>고객사</th>
                                <th>주소</th>
                                <th>연락처</th>
                                <th>대표명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 검색된 고객사 목록을 출력 */}
                            {paginatedCustomerSearchResults.map((result) => (
                                <tr key={result.customerNo} onClick={() => onCustomerSelect(result)}>
                                    <td>{result.customerName}</td> {/* 고객사 이름 */}
                                    <td>{result.customerAddr}</td> {/* 고객사 주소 */}
                                    <td>{result.customerTel}</td> {/* 고객사 연락처 */}
                                    <td>{result.customerRepresentativeName}</td> {/* 대표 이름 */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>검색 결과가 없습니다.</div>
                )}
                {/* 페이지네이션 */}
                <div className="pagination">
                    {Array.from({ length: totalCustomerPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => handlePageChangeCustomer(number)} // 페이지 클릭 처리
                            className={number === currentPageCustomer ? 'active' : ''} // 현재 페이지 강조
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CustomerSearchModal;
