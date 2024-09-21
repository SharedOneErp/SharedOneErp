import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 임포트

function ProductSearchModal({ onClose, onProductSelect }) {
    // 🔴 검색어 상태 관리
    const [searchName, setSearchName] = useState(''); // 상품명 검색어
    const [searchCode, setSearchCode] = useState('');   // 상품코드 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 배열 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태

    const itemsPerPage = 10; // 페이지당 표시할 항목 수

    // 🔴 카테고리 셀렉터
    const [categories, setCategories] = useState({
        topCategories: [],
        middleCategories: [],
        lowCategories: []
    });

    // 🔴 선택한 카테고리
    const [selectedCategory, setSelectedCategory] = useState({
        top: '',
        middle: '',
        low: ''
    });

    // 🔴 /api/products/productsFilter : 상품 검색 처리 함수 (비동기)
    const fetchProducts = () => {
        axios.get('/api/products/productsFilter', {
            params: {
                page: currentPage,
                size: itemsPerPage,
                topCategoryNo: selectedCategory.top || null,    // 대분류 카테고리
                middleCategoryNo: selectedCategory.middle || null, // 중분류 카테고리
                lowCategoryNo: selectedCategory.low || null,    // 소분류 카테고리
                productCd: searchCode || null,                  // 상품 코드 필터
                productNm: searchName || null,                 // 상품명 필터
                status: 'active'                               // 활성화된 상품만 조회
            },
        })
            .then((response) => {
                const data = response.data.content || []; // 서버 응답에서 상품 목록 추출
                setSearchResults(data); // 검색 결과 상태 업데이트
                setTotalPages(response.data.totalPages || 0); // 전체 페이지 수 설정
            })
            .catch((error) => console.error('상품 목록 조회 실패', error));
    };

    // 🔴 /api/category/top, middle, low : 카테고리 검색 처리 함수 (비동기)
    const fetchCategories = async (selectedCategory, setCategories) => {
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

    // 🟡 searchName, searchCode, 카테고리 변경될 때마다 fetchProducts 호출
    useEffect(() => {
        fetchProducts();
    }, [searchCode, searchName, selectedCategory, currentPage]); // 카테고리 상태와 페이지 번호도 추가

    // 🟡 하위 카테고리 가져오기
    useEffect(() => {
        fetchCategories(selectedCategory, setCategories);
    }, [selectedCategory.top, selectedCategory.middle]);

    // 🟢 페이지 변경 처리 함수
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 상태 업데이트
    };

    // 🟢 카테고리 대분류 변경
    const handleTopChange = (e) => {
        const topValue = e.target.value;
        setSelectedCategory({
            top: topValue,
            middle: '',
            low: ''
        });
        setCategories(prev => ({ ...prev, middleCategories: [], lowCategories: [] }));
    };

    // 🟢 카테고리 중분류 변경
    const handleMiddleChange = (e) => {
        const middleValue = e.target.value;
        setSelectedCategory({
            ...selectedCategory,
            middle: middleValue,
            low: ''
        });
        setCategories(prev => ({ ...prev, lowCategories: [] }));
    };

    // 🟢 검색어 삭제 버튼 클릭 공통 함수
    const handleSearchDel = (setSearch) => {
        setSearch(''); // 공통적으로 상태를 ''로 설정
    };

    // 🟢 모달 배경 클릭 시 창 닫기
    const handleBackgroundClick = (e) => {
        if (e.target.className === 'modal_overlay') {
            onClose();
        }
    };

    // 🟣 모달 렌더링
    return (
        <div className="modal_overlay" onClick={handleBackgroundClick}>
            <div className="modal_container search">
                <div className="header">
                    <div>상품 검색</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="search_wrap">
                    <div className={`select_box ${selectedCategory.top ? 'selected' : ''}`} >
                    <label className="label_floating">대분류</label>
                        <select
                            className="box" value={selectedCategory.top} onChange={handleTopChange}>
                            <option value="">대분류</option>
                            {categories.topCategories.map(category => (
                                <option key={category.categoryNo}
                                    value={category.categoryNo}>{category.categoryNm}</option>
                            ))}
                        </select>
                    </div>
                    <div className={`select_box ${selectedCategory.middle ? 'selected' : ''}`} >
                    <label className="label_floating">중분류</label>
                        <select
                            className="box" value={selectedCategory.middle} onChange={handleMiddleChange}
                            disabled={!selectedCategory.top}>
                            <option value="">중분류</option>
                            {categories.middleCategories.map(category => (
                                <option key={category.categoryNo}
                                    value={category.categoryNo}>{category.categoryNm}</option>
                            ))}
                        </select>
                    </div>
                    <div className={`select_box ${selectedCategory.low ? 'selected' : ''}`} >
                    <label className="label_floating">소분류</label>
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
                </div>
                <div className="search_wrap" style={{ marginTop: '5px' }}>
                    <div className={`search_box ${searchName ? 'has_text' : ''}`}>
                    <label className="label_floating">상품명</label>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="box"
                            value={searchName} // 상품명 검색어 상태값 연결
                            onChange={(e) => setSearchName(e.target.value)} // 상품명 검색어 변경 처리
                        />
                        {searchName && (<button className="btn-del" onClick={() => handleSearchDel(setSearchName)}><i className="bi bi-x"></i></button>)}
                    </div>
                    <div className={`search_box ${searchCode ? 'has_text' : ''}`}>
                    <label className="label_floating">상품코드</label>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="box"
                            value={searchCode} // 상품코드 검색어 상태값 연결
                            onChange={(e) => setSearchCode(e.target.value)} // 상품코드 검색어 변경 처리
                        />
                        {searchCode && (<button className="btn-del" onClick={() => handleSearchDel(setSearchCode)}><i className="bi bi-x"></i></button>)}
                    </div>
                </div>
                <div className="table_wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>상품코드</th>
                                <th>상품명</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <tr key={index} onClick={() => onProductSelect(result)}>
                                        <td>{result.productCd || '-'}</td> {/* 상품 코드 */}
                                        <td>{result.productNm || '-'}</td> {/* 상품명 */}
                                        <td>{result.price || '-'}</td>     {/* 상품 가격 */}
                                    </tr>
                                ))
                            ) : (
                                <tr className="tr_empty">
                                    <td colSpan="3">
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

export default ProductSearchModal;
