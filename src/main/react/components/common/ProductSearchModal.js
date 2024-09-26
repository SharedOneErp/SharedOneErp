import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination'; // 페이지네이션 컴포넌트 임포트

function ProductSearchModal({ onClose, onProductSelect, customerNo = null }) { // 가격 등록 시 -> 단순 상품 검색, 주문 등록 시 -> 고객사에 해당하는 상품 검색(customerNo)

    const [loading, setLoading] = useState(false); // 🔴 로딩 상태 추가

    // 🔴 검색어 상태 관리
    const [searchName, setSearchName] = useState(''); // 상품명 검색어
    const [searchCode, setSearchCode] = useState('');   // 상품코드 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 배열 상태
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태

    const itemsPerPage = 10; // 페이지당 표시할 항목 수

    // 🔴 모든 카테고리 상태
    const [allCategories, setAllCategories] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [middleCategories, setMiddleCategories] = useState([]);
    const [lowCategories, setLowCategories] = useState([]);

    // 🔴 선택한 카테고리
    const [selectedCategory, setSelectedCategory] = useState({
        top: '',
        middle: '',
        low: ''
    });

    // 🔴 상품 조회 함수
    const fetchProducts = () => {
        setLoading(true); // 로딩 시작

        // API 요청에 전달할 파라미터 객체 생성
        const params = {
            page: currentPage,
            size: itemsPerPage,
            topCategoryNo: selectedCategory.top || null,    // 대분류 카테고리
            middleCategoryNo: selectedCategory.middle || null, // 중분류 카테고리
            lowCategoryNo: selectedCategory.low || null,    // 소분류 카테고리
            productCd: searchCode || null,                  // 상품 코드 필터
            productNm: searchName || null,                 // 상품명 필터
            status: 'active',                              // 활성화된 상품만 조회
        };

        // 🔴 customerNo가 있을 경우에만 추가
        if (customerNo) {
            params.customerNo = customerNo;
        }

        axios.get('/api/products/productsFilter', { params })
            .then((response) => {
                const data = response.data.content || []; // 서버 응답에서 상품 목록 추출
                console.log("검색 결과:", data);
                setSearchResults(data); // 검색 결과 상태 업데이트
                setTotalPages(response.data.totalPages || 0); // 전체 페이지 수 설정
                setLoading(false); // 로딩 종료
            })
            .catch((error) => {
                console.error('상품 목록 조회 실패', error);
                setLoading(false); // 에러 시 로딩 종료
            });
    };


    // 🟡 컴포넌트 마운트 시 모든 카테고리 가져오기
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const response = await axios.get('/api/category/all');
                const categories = response.data;
                console.log("전체 카테고리 데이터:", categories);

                setAllCategories(categories);

                // 대분류 분류
                const top = categories.filter(cat => !cat.parentCategoryNo);
                setTopCategories(top);
                console.log("대분류:", top);

                // 중분류 분류
                const middle = categories.filter(cat => cat.parentCategoryNo && top.some(topCat => topCat.categoryNo === cat.parentCategoryNo));
                setMiddleCategories(middle);
                console.log("중분류:", middle);

                // 소분류 분류
                const low = categories.filter(cat => {
                    const middleCat = middle.find(m => m.categoryNo === cat.parentCategoryNo);
                    return middleCat && top.some(topCat => topCat.categoryNo === middleCat.parentCategoryNo);
                });
                setLowCategories(low);
                console.log("소분류:", low);

            } catch (error) {
                console.error('모든 카테고리 가져오기 실패:', error);
            }
        };

        fetchAllCategories();
    }, []); // 빈 의존성 배열로 한 번만 실행

    // 🟡 대분류 변경 시 중분류 필터링
    useEffect(() => {
        console.log("대분류 변경 시 selectedCategory.top:", selectedCategory.top);
        if (selectedCategory.top) {
            // selectedCategory.top을 숫자로 변환
            const topValue = Number(selectedCategory.top);
            const filteredMiddle = allCategories.filter(cat => cat.parentCategoryNo === topValue);
            console.log("필터링된 중분류:", filteredMiddle);
            setMiddleCategories(filteredMiddle);
        } else {
            setMiddleCategories([]);
        }
        setSelectedCategory(prev => {
            if (prev.middle !== '' || prev.low !== '') {
                return { ...prev, middle: '', low: '' };
            }
            return prev; // 값이 동일하면 상태 업데이트 없음
        });
        setLowCategories([]);
    }, [selectedCategory.top, allCategories]);

    // 🟡 중분류 변경 시 소분류 필터링
    useEffect(() => {
        if (selectedCategory.middle) {
            const middleValue = Number(selectedCategory.middle);
            const filteredLow = allCategories.filter(cat => cat.parentCategoryNo === middleValue);
            console.log("필터링된 소분류:", filteredLow);
            setLowCategories(filteredLow);
        } else {
            setLowCategories([]);
        }
        setSelectedCategory(prev => {
            if (prev.low !== '') {
                return { ...prev, low: '' };
            }
            return prev;
        });
    }, [selectedCategory.middle, allCategories]);

    // 🟡 검색 조건이나 페이지가 변경될 때마다 상품 조회
    useEffect(() => {
        let isMounted = true; // 컴포넌트가 마운트된 상태인지 확인하는 변수
        if (isMounted) {
            fetchProducts(); // 상태가 변경될 때만 실행
        }
        return () => {
            isMounted = false; // 컴포넌트 언마운트 시 API 호출 중단
        };
    }, [searchCode, searchName, selectedCategory, currentPage]);

    // 🟢 페이지 변경 처리 함수
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 페이지 번호 상태 업데이트
    };

    // 🟢 대분류 변경 처리 함수
    const handleTopChange = (e) => {
        const topValue = e.target.value;
        console.log("handleTopChange - 선택된 대분류:", topValue);
        setSelectedCategory({
            top: topValue,
            middle: '',
            low: ''
        });
        setMiddleCategories([]);
        setLowCategories([]);
    };

    // 🟢 중분류 변경 처리 함수
    const handleMiddleChange = (e) => {
        const middleValue = e.target.value;
        console.log("handleMiddleChange - 선택된 중분류:", middleValue);
        setSelectedCategory(prev => ({
            ...prev,
            middle: middleValue,
            low: ''
        }));
        setLowCategories([]);
    };

    // 🟢 소분류 변경 처리 함수
    const handleLowChange = (e) => {
        const lowValue = e.target.value;
        console.log("handleLowChange - 선택된 소분류:", lowValue);
        setSelectedCategory(prev => ({
            ...prev,
            low: lowValue
        }));
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
        <div className="modal_overlay" onMouseDown={handleBackgroundClick}>
            <div className="modal_container search search_product">
                <div className="header">
                    <div>상품 검색</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="search_wrap">
                    {/* 대분류 셀렉터 */}
                    <div className={`select_box ${selectedCategory.top ? 'selected' : ''}`} >
                        <label className="label_floating">대분류</label>
                        <select
                            className="box" value={selectedCategory.top} onChange={handleTopChange}>
                            <option value="">대분류</option>
                            {topCategories.map(category => (
                                <option key={category.categoryNo}
                                    value={category.categoryNo}>{category.categoryNm}</option>
                            ))}
                        </select>
                    </div>

                    {/* 중분류 셀렉터 */}
                    <div className={`select_box ${selectedCategory.middle ? 'selected' : ''}`} >
                        <label className="label_floating">중분류</label>
                        <select
                            className="box" value={selectedCategory.middle} onChange={handleMiddleChange}
                            disabled={!selectedCategory.top}>
                            <option value="">중분류</option>
                            {middleCategories.map(category => (
                                <option key={category.categoryNo}
                                    value={category.categoryNo}>{category.categoryNm}</option>
                            ))}
                        </select>
                    </div>

                    {/* 소분류 셀렉터 */}
                    <div className={`select_box ${selectedCategory.low ? 'selected' : ''}`} >
                        <label className="label_floating">소분류</label>
                        <select
                            className="box" value={selectedCategory.low} onChange={handleLowChange}
                            disabled={!selectedCategory.middle}>
                            <option value="">소분류</option>
                            {lowCategories.map(category => (
                                <option key={category.categoryNo}
                                    value={category.categoryNo}>{category.categoryNm}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 검색어 입력란 */}
                <div className="search_wrap" style={{ marginTop: '5px' }}>
                    {/* 상품명 검색 */}
                    <div className={`search_box ${searchName ? 'has_text' : ''}`}>
                        <label className="label_floating">상품명</label>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="box"
                            value={searchName} // 상품명 검색어 상태값 연결
                            onChange={(e) => setSearchName(e.target.value)} // 상품명 검색어 변경 처리
                        />
                        {searchName && (
                            <button className="btn-del" onClick={() => handleSearchDel(setSearchName)}>
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>

                    {/* 상품코드 검색 */}
                    <div className={`search_box ${searchCode ? 'has_text' : ''}`}>
                        <label className="label_floating">상품코드</label>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            className="box"
                            value={searchCode} // 상품코드 검색어 상태값 연결
                            onChange={(e) => setSearchCode(e.target.value)} // 상품코드 검색어 변경 처리
                        />
                        {searchCode && (
                            <button className="btn-del" onClick={() => handleSearchDel(setSearchCode)}>
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* 검색 결과 테이블 */}
                <div className="table_wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>상품코드</th>
                                <th>카테고리</th>
                                <th>상품명</th>
                                <th>가격</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr className="tr_empty">
                                    <td colSpan="4"> {/* 로딩 애니메이션 중앙 배치 */}
                                        <div className="loading">
                                            <span></span> {/* 첫 번째 원 */}
                                            <span></span> {/* 두 번째 원 */}
                                            <span></span> {/* 세 번째 원 */}
                                        </div>
                                    </td>
                                </tr>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <tr key={index} onClick={() => onProductSelect(result)}>
                                        <td>{result.productCd || '-'}</td> {/* 상품 코드 */}
                                        <td>{result.lowCategory}</td> {/* 상품 카테고리 */}
                                        <td>{result.productNm || '-'}</td> {/* 상품명 */}
                                        <td>
                                            {/* 고객사 별 상품 가격 또는 상품 가격(기준가) */}
                                            {customerNo ? (
                                                result.priceCustomer ? (
                                                    `${result.priceCustomer.toLocaleString()}원`
                                                ) : (
                                                    '-'
                                                )
                                            ) : (
                                                result.productPrice ? (
                                                    `${result.productPrice.toLocaleString()}원`
                                                ) : (
                                                    '-'
                                                )
                                            )}
                                        </td>
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

                {/* 페이지네이션 컴포넌트 */}
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
