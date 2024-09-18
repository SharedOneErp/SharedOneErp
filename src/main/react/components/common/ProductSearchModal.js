// src/main/react/components/common/ProductSearchModal.js
import React, { useState } from 'react';

function ProductSearchModal({ onClose, onProductSelect }) {
    // 검색어 상태 관리
    const [searchQuery, setSearchQuery] = useState(''); // 상품명 검색어
    const [searchCode, setSearchCode] = useState('');   // 상품코드 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 배열 상태
    const [currentPageProduct, setCurrentPageProduct] = useState(1); // 현재 페이지 상태

    const itemsPerPageProduct = 10; // 페이지당 표시할 항목 수
    const totalProductPages = Math.ceil(searchResults.length / itemsPerPageProduct); // 전체 페이지 수 계산
    const indexOfLastProductResult = currentPageProduct * itemsPerPageProduct; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstProductResult = indexOfLastProductResult - itemsPerPageProduct; // 현재 페이지의 첫 번째 항목 인덱스
    const paginatedSearchResults = searchResults.slice(indexOfFirstProductResult, indexOfLastProductResult); // 페이지에 해당하는 항목들만 추출

    // 상품 검색 처리 함수 (비동기)
    const handleSearch = async () => {
        try {
            // 검색 API 호출
            const response = await axios.get(`/api/order/search`, {
                params: {
                    productCd: searchCode,   // 상품 코드 필터
                    productNm: searchQuery   // 상품명 필터
                }
            });
            const data = response.data; // axios는 자동으로 JSON 변환
            setSearchResults(data); // 검색 결과 상태 업데이트
            setCurrentPageProduct(1); // 검색 후 페이지를 첫 페이지로 초기화
        } catch (error) {
            // 오류 처리
            console.error('검색 중 오류 발생:', error);
            setSearchResults([]); // 검색 결과 없을 때 상태 초기화
        }
    };

    // 페이지 변경 처리 함수
    const handlePageChangeProduct = (pageNumber) => {
        setCurrentPageProduct(pageNumber); // 페이지 번호 상태 업데이트
    };

    return (
        <div className="modal_container">
            <div className="header">
                <h4>상품 검색</h4>
                <button className="btn_close" onClick={onClose}>&times;</button> {/* 모달 닫기 버튼 */}
            </div>
            <div className="search_wrap">
                <input
                    type="text"
                    placeholder="상품명"
                    value={searchQuery} // 상품명 검색어 상태값 연결
                    onChange={(e) => setSearchQuery(e.target.value)} // 상품명 검색어 변경 처리
                />
                <input
                    type="text"
                    placeholder="상품코드"
                    value={searchCode} // 상품코드 검색어 상태값 연결
                    onChange={(e) => setSearchCode(e.target.value)} // 상품코드 검색어 변경 처리
                />
                <button className="box color" onClick={handleSearch}>검색</button> {/* 검색 버튼 */}
            </div>
            <div className="list_wrap">
                {/* 검색 결과가 있을 때 */}
                {searchResults.length > 0 ? (
                    <table className="search-results-table">
                        <thead>
                            <tr>
                                <th>상품코드</th>
                                <th>상품명</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 검색된 상품 결과 목록 출력 */}
                            {paginatedSearchResults.map((result, index) => (
                                <tr key={index} onClick={() => onProductSelect(result)}>
                                    <td>{result.productCd}</td> {/* 상품 코드 */}
                                    <td>{result.productNm}</td> {/* 상품명 */}
                                    <td>{result.price}</td>     {/* 상품 가격 */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>검색 결과가 없습니다.</div> 
                )}

                {/* 페이지네이션 */}
                <div className="pagination">
                    {Array.from({ length: totalProductPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => handlePageChangeProduct(number)} // 페이지 번호 클릭 처리
                            className={number === currentPageProduct ? 'active' : ''} // 현재 페이지 강조
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductSearchModal;
