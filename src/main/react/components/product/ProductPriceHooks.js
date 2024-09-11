// src/components/product/ProductPriceHooks.js
import {useState, useEffect} from 'react';
import axios from 'axios';
import {formatDate} from '../../util/dateUtils';

export const useHooksList = () => {

    const [priceList, setPriceList] = useState([]); // 가격 리스트

    const [totalItems, setTotalItems] = useState(0); // 전체 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

    const [selectedCustomerNo, setSelectedCustomerNo] = useState(''); // 선택된 고객사
    const [selectedProductCd, setSelectedProductCd] = useState(''); // 선택된 상품

    const [startDate, setStartDate] = useState(null); // 시작 날짜
    const [endDate, setEndDate] = useState(null); // 종료 날짜

    const [sortField, setSortField] = useState(null); // 정렬 필드
    const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서

    const [loading, setLoading] = useState(false); // 로딩 상태 관리

    // 가격 리스트를 서버에서 받아오는 함수
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // 데이터를 가져오기 전에 로딩 상태를 true로 설정
            const MIN_LOADING_TIME = 500; // 최소 로딩 시간
            const startTime = Date.now(); // 요청 시작 시간 기록
            try {
                // 요청 파라미터 콘솔 출력
                console.log('Request Params:', {
                    customerNo: selectedCustomerNo || null,
                    productCd: selectedProductCd || null,
                    startDate: startDate ? formatDate(startDate) : null,
                    endDate: endDate ? formatDate(endDate) : null,
                    page: currentPage,
                    size: itemsPerPage,
                    sort: sortField ? sortField : 'priceNo',
                    order: sortOrder || 'asc',
                });

                // 서버로부터 데이터를 받아오는 요청
                const response = await axios.get('/api/price/all', {
                    params: {
                        customerNo: selectedCustomerNo || null,  // 필터로 사용될 고객 번호
                        productCd: selectedProductCd || null,    // 필터로 사용될 제품 코드
                        startDate: startDate ? formatDate(startDate) : null,  // 필터로 사용될 시작 날짜
                        endDate: endDate ? formatDate(endDate) : null,        // 필터로 사용될 종료 날짜
                        page: currentPage,                                   // 페이지 번호
                        size: itemsPerPage,                                  // 페이지당 항목 수
                        sort: sortField ? sortField : 'priceNo',             // 정렬 필드
                        order: sortOrder || 'asc',                           // 정렬 순서 (기본값: 오름차순)
                    },
                });

                // 서버로부터 받아온 데이터를 처리하여 상태 업데이트
                const {content, totalElements, totalPages} = response.data;

                setPriceList(content);         // 가격 리스트 상태 업데이트
                setTotalItems(totalElements);  // 전체 항목 수 상태 업데이트
                setTotalPages(totalPages);     // 전체 페이지 수 상태 업데이트

            } catch (error) {
                console.error('데이터를 불러오는 중 오류 발생:', error);
            } finally {
                // 현재 시간과 요청 시작 시간의 차이를 계산
                const elapsedTime = Date.now() - startTime;

                // 최소 로딩 시간보다 빨리 완료되면 나머지 시간 동안 로딩 상태 유지
                const remainingTime = MIN_LOADING_TIME - elapsedTime;

                if (remainingTime > 0) {
                    setTimeout(() => {
                        setLoading(false); // 최소 최소 로딩 시간 후 로딩 상최소 로딩 시간 false로 설정
                    }, remainingTime);
                } else {
                    setLoading(false); // 최소 로딩 시간 이상 경과했으최소 로딩 시간즉시 로딩 상태를 false로 설정
                }
            }
        };

        fetchData();
    }, [selectedCustomerNo, selectedProductCd, startDate, endDate, currentPage, itemsPerPage, sortField, sortOrder]); // 필터 및 페이지 변경 시마다 데이터 재요청

    // 페이지당 항목 수 변경 함수
    const handleItemsPerPageChange = (e) => {
        console.log("---------------------------handleItemsPerPageChange()");
        setItemsPerPage(parseInt(e.target.value)); // 페이지당 항목 수 변경
        setCurrentPage(1); // 페이지 번호 초기화
    };

    // 페이지 번호 클릭 시 현재 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); // 클릭한 페이지 번호로 현재 페이지 변경
    };

    return {
        priceList,               // [1] 가격 리스트 상태
        itemsPerPage,            // [9] 페이지당 항목 수
        handleItemsPerPageChange,// [29] 페이지당 항목 수 변경 함수
        loading,
        handlePageChange,
        totalPages,
        currentPage,
    };

};