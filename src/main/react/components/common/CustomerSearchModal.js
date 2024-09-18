// src/main/react/components/common/CustomerSearchModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 임포트

function CustomerSearchModal({ onClose, onCustomerSelect }) {
    // 🔴 검색어 및 검색 결과 상태 관리
    const [searchQuery, setSearchQuery] = useState(''); // 고객사 검색어 상태
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객사 검색 결과 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

    const itemsPerPage = 10; // 페이지당 항목 수
    const totalPages = Math.ceil(customerSearchResults.length / itemsPerPage); // 전체 페이지 수 계산
    const indexOfLastResult = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstResult = indexOfLastResult - itemsPerPage; // 현재 페이지의 첫 번째 항목 인덱스
    const paginatedCustomerSearchResults = customerSearchResults.slice(indexOfFirstResult, indexOfLastResult); // 페이지에 맞는 항목 추출

    // 🔴 고객사 검색 처리 함수 (비동기)
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
            setCurrentPage(1); // 검색 후 페이지를 첫 페이지로 초기화
        } catch (error) {
            // 오류 처리
            console.error('검색 중 오류 발생:', error);
            setCustomerSearchResults([]); // 검색 결과 초기화
        }
    };

    // 🔴 페이지 변경 처리 함수
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 상태 업데이트
    };

    // 🟡 컴포넌트가 처음 렌더링될 때 기본 검색 호출
    useEffect(() => {
        customerSearch();
    }, []); // 빈 배열을 넣어 처음 렌더링 시 한 번만 실행

    // 🟢 모달 렌더링
    return (
        <div className="modal_overlay">
            <div className="modal_container">
                <div className="header">
                    <div>고객사 검색</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="search_wrap">
                    {/* 고객사 검색어 입력 필드 */}
                    <input
                        type="text"
                        className="box"
                        placeholder="검색하실 고객사를 입력하세요"
                        value={searchQuery} // 입력된 검색어 상태값
                        onChange={(e) => setSearchQuery(e.target.value)} // 검색어 변경 처리
                    />
                    {/* 검색 버튼 */}
                    <button className="box color" onClick={customerSearch}>검색</button>
                </div>
                <div className="table_wrap">
                    {/* 검색 결과가 있을 경우 목록을 출력 */}
                    {customerSearchResults.length > 0 ? (
                        <table>
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
                                        <td>{result.customerName || '-'}</td> {/* 고객사 이름 */}
                                        <td>{result.customerAddr || '-'}</td> {/* 고객사 주소 */}
                                        <td>{result.customerTel || '-'}</td> {/* 고객사 연락처 */}
                                        <td>{result.customerRepresentativeName || '-'}</td> {/* 대표 이름 */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>검색 결과가 없습니다.</div>
                    )}
                </div>

                {/* 페이지네이션 컴포넌트 사용 */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePage={handlePage}
                    showFilters={false} // 간단 버전으로 필터링 부분 숨기기
                />
            </div>
        </div>
    );
}

export default CustomerSearchModal;
