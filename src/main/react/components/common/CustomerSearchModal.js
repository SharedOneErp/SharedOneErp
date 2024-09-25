// src/main/react/components/common/CustomerSearchModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 임포트
import { useDebounce } from '../common/useDebounce'; // useDebounce 훅 임포트

function CustomerSearchModal({ onClose, onCustomerSelect }) {

    const [loading, setLoading] = useState(false); // 🔴 로딩 상태 추가

    // 🔴 검색어 및 검색 결과 상태 관리
    const [customerSearchText, setCustomerSearchText] = useState(''); // 고객사 검색어 상태
    const debouncedCustomerSearchText = useDebounce(customerSearchText, 300); // 딜레이 적용
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객사 검색 결과 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

    const itemsPerPage = 10; // 페이지당 항목 수
    const totalPages = Math.ceil(customerSearchResults.length / itemsPerPage); // 전체 페이지 수 계산
    const indexOfLastResult = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstResult = indexOfLastResult - itemsPerPage; // 현재 페이지의 첫 번째 항목 인덱스
    const paginatedCustomerSearchResults = customerSearchResults.slice(indexOfFirstResult, indexOfLastResult); // 페이지에 맞는 항목 추출

    // 🔴 고객사 검색 처리 함수 (비동기)
    const fetchData = async () => {
        setLoading(true); // 로딩 시작
        try {
            // 검색 API 호출
            const response = await axios.get(`/api/customer/search`, {
                params: {
                    name: customerSearchText // 고객사 이름 필터
                }
            });
            const data = response.data; // axios는 자동으로 JSON 응답을 변환
            setCustomerSearchResults(data); // 검색 결과 상태 업데이트
            setCurrentPage(1); // 검색 후 페이지를 첫 페이지로 초기화
            setLoading(false); // 로딩 종료
        } catch (error) {
            // 오류 처리
            console.error('검색 중 오류 발생:', error);
            setCustomerSearchResults([]); // 검색 결과 초기화
            setLoading(false); // 에러 시 로딩 종료
        }
    };

    // 🟡 컴포넌트가 처음 렌더링될 때 기본 검색 호출
    useEffect(() => {
        fetchData();
    }, []); // 빈 배열을 넣어 처음 렌더링 시 한 번만 실행

    // 🟡 검색어가 디바운스된 후 fetchData 호출(고객사)
    useEffect(() => {
        fetchData();
    }, [debouncedCustomerSearchText]);

    // 🟢 페이지 변경 처리 함수
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 상태 업데이트
    };

    // 🟢 검색어 삭제 버튼 클릭 공통 함수
    const handleSearchDel = (setSearch) => {
        setSearch(''); // 공통적으로 상태를 ''로 설정
    };

    // 🟢 검색어 변경(고객사)
    const handleCustomerSearchTextChange = (event) => {
        setCustomerSearchText(event.target.value);
    };

    // 🟢 모달 배경 클릭 시 창 닫기
    const handleBackgroundClick = (e) => {
        if (e.target.className === 'modal_overlay') {
            onClose();
        }
    };

    // 🟢 검색된 고객사를 클릭
    const handleCustomerClick = (customer) => {
        onCustomerSelect(customer); // 부모 컴포넌트에서 전달된 함수 호출 (handleCustomerSelect)
        onClose(); // 모달 닫기
    };

    // 🟣 모달 렌더링
    return (
        <div className="modal_overlay" onMouseDown={handleBackgroundClick}>
            <div className="modal_container search search_customer">
                <div className="header">
                    <div>고객사 검색</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="search_wrap">
                    <div className={`search_box ${customerSearchText ? 'has_text' : ''}`}>
                        <label className="label_floating">고객사</label>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="box search"
                            value={customerSearchText}
                            onChange={handleCustomerSearchTextChange}
                            style={{ width: '250px' }} // 인라인 스타일로 width 적용
                        />
                        {/* 검색어 삭제 버튼 */}
                        {customerSearchText && (
                            <button
                                className="btn-del"
                                onClick={() => handleSearchDel(setCustomerSearchText)} // 공통 함수 사용
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>
                </div>
                <div className="table_wrap">
                    {/* 검색 결과가 있을 경우 목록을 출력 */}
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
                            {loading ? (
                                <tr className="tr_empty">
                                    <td colSpan="3"> {/* 로딩 애니메이션 중앙 배치 */}
                                        <div className="loading">
                                            <span></span> {/* 첫 번째 원 */}
                                            <span></span> {/* 두 번째 원 */}
                                            <span></span> {/* 세 번째 원 */}
                                        </div>
                                    </td>
                                </tr>
                            ) : customerSearchResults.length > 0 ? (
                                /* 검색된 고객사 목록을 출력 */
                                paginatedCustomerSearchResults.map((result) => (
                                    <tr key={result.customerNo} onClick={() => handleCustomerClick(result)}>
                                        <td>{result.customerName || '-'}</td> {/* 고객사 이름 */}
                                        <td>{result.customerAddr || '-'}</td> {/* 고객사 주소 */}
                                        <td>{result.customerTel || '-'}</td> {/* 고객사 연락처 */}
                                        <td>{result.customerRepresentativeName || '-'}</td> {/* 대표 이름 */}
                                    </tr>
                                ))
                            ) : (
                                <tr className="tr_empty">
                                    <td colSpan="4">
                                        <div className="no_data">조회된 결과가 없습니다.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
