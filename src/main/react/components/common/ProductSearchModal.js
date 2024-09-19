// src/main/react/components/common/ProductSearchModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 임포트

function ProductSearchModal({ onClose, onProductSelect }) {
    // 🔴 검색어 상태 관리
    const [searchQuery, setSearchQuery] = useState(''); // 상품명 검색어
    const [searchCode, setSearchCode] = useState('');   // 상품코드 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 배열 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태

    const itemsPerPage = 10; // 페이지당 표시할 항목 수
    const totalPages = Math.ceil(searchResults.length / itemsPerPage); // 전체 페이지 수 계산
    const indexOfLastResult = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstResult = indexOfLastResult - itemsPerPage; // 현재 페이지의 첫 번째 항목 인덱스
    const paginatedSearchResults = searchResults.slice(indexOfFirstResult, indexOfLastResult); // 페이지에 해당하는 항목들만 추출

    // 🔴 상품 검색 처리 함수 (비동기)
    const fetchData = async () => {
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
            setCurrentPage(1); // 검색 후 페이지를 첫 페이지로 초기화
        } catch (error) {
            // 오류 처리
            console.error('검색 중 오류 발생:', error);
            setSearchResults([]); // 검색 결과 없을 때 상태 초기화
        }
    };

    // 🔴 페이지 변경 처리 함수
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 상태 업데이트
    };

    // 🟡
    //카테고리 셀렉터
    const [categories, setCategories] = useState({
        topCategories: [],
        middleCategories: [],
        lowCategories: []
    });
    const [selectedCategory, setSelectedCategory] = useState({
        top: '',
        middle: '',
        low: ''
    });

    // 🟡 컴포넌트가 처음 렌더링될 때 기본 검색 호출
    useEffect(() => {
        fetchData();
    }, []); // 빈 배열을 넣어 처음 렌더링 시 한 번만 실행

    // 🟡 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const topResponse = await fetch('/api/category/top');
                const topData = await topResponse.json();
                setCategories(prev => ({ ...prev, topCategories: topData }));

                if (selectedCategory.top) {
                    const middleResponse = await fetch(`/api/category/middle/${selectedCategory.top}`);
                    const middleData = await middleResponse.json();
                    setCategories(prev => ({ ...prev, middleCategories: middleData }));
                }

                if (selectedCategory.middle) {
                    const lowResponse = await fetch(`/api/category/low/${selectedCategory.middle}/${selectedCategory.top}`);
                    const lowData = await lowResponse.json();
                    setCategories(prev => ({ ...prev, lowCategories: lowData }));
                }

            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [selectedCategory.top, selectedCategory.middle]);

    // 🟡 
    const handleTopChange = (e) => {
        const topValue = e.target.value;
        setSelectedCategory({
            top: topValue,
            middle: '',
            low: ''
        });
        setCategories(prev => ({ ...prev, middleCategories: [], lowCategories: [] }));
    };

    // 🟡 
    const handleMiddleChange = (e) => {
        const middleValue = e.target.value;
        setSelectedCategory({
            ...selectedCategory,
            middle: middleValue,
            low: ''
        });
        setCategories(prev => ({ ...prev, lowCategories: [] }));
    };

    // 🟢 모달 렌더링
    return (
        <div className="modal_overlay">
            <div className="modal_container">
                <div className="header">
                    <div>상품 검색</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="search_wrap">
                    <select
                        className="box" value={selectedCategory.top} onChange={handleTopChange}>
                        <option value="">대분류</option>
                        {categories.topCategories.map(category => (
                            <option key={category.categoryNo}
                                value={category.categoryNo}>{category.categoryNm}</option>
                        ))}
                    </select>
                    <select
                        className="box" value={selectedCategory.middle} onChange={handleMiddleChange}
                        disabled={!selectedCategory.top}>
                        <option value="">중분류</option>
                        {categories.middleCategories.map(category => (
                            <option key={category.categoryNo}
                                value={category.categoryNo}>{category.categoryNm}</option>
                        ))}
                    </select>
                    <select
                        className="box" value={selectedCategory.low} onChange={(e) => setSelectedCategory({
                        ...selectedCategory,
                        low: e.target.value
                    })} disabled={!selectedCategory.middle}>
                        <option value="">소분류</option>
                        {categories.lowCategories.map(category => (
                            <option key={category.categoryNo}
                                value={category.categoryNo}>{category.categoryNm}</option>
                        ))}
                    </select>
                </div>
                <div className="search_wrap">
                    <input
                        type="text"
                        className="box"
                        placeholder="상품명"
                        value={searchQuery} // 상품명 검색어 상태값 연결
                        onChange={(e) => setSearchQuery(e.target.value)} // 상품명 검색어 변경 처리
                    />
                    <input
                        type="text"
                        className="box"
                        placeholder="상품코드"
                        value={searchCode} // 상품코드 검색어 상태값 연결
                        onChange={(e) => setSearchCode(e.target.value)} // 상품코드 검색어 변경 처리
                    />
                    <button className="box color" onClick={fetchData}>검색</button> {/* 검색 버튼 */}
                </div>
                <div className="table_wrap">
                    {/* 검색 결과가 있을 때 */}
                    {searchResults.length > 0 ? (
                        <table>
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
                                        <td>{result.productCd || '-'}</td> {/* 상품 코드 */}
                                        <td>{result.productNm || '-'}</td> {/* 상품명 */}
                                        <td>{result.price || '-'}</td>     {/* 상품 가격 */}
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

export default ProductSearchModal;
