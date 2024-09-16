// src/components/product/ProductPriceHooks.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from '../../util/dateUtils';

export const useHooksList = () => {

    // 🔴 useState : 상태 정의 및 초기화
    const [priceList, setPriceList] = useState([]); // 가격 리스트

    const [totalItems, setTotalItems] = useState(0); // 전체 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageInputValue, setPageInputValue] = useState(1); // 페이지 입력 필드의 값

    const [selectedCustomerNo, setSelectedCustomerNo] = useState(''); // 선택된 고객사
    const [selectedProductCd, setSelectedProductCd] = useState(''); // 선택된 상품

    const [searchText, setSearchText] = useState(''); // 검색어

    const [startDate, setStartDate] = useState(null); // 시작 날짜
    const [endDate, setEndDate] = useState(null); // 종료 날짜

    const [selectedStatus, setSelectedStatus] = useState("active"); // 상태

    // 체크박스 상태 관리
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // 초기값을 false로 설정

    const [sortField, setSortField] = useState(null); // 정렬 필드
    const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서

    const [isLoading, setLoading] = useState(false); // 로딩 상태 관리

    const [isAdding, setIsAdding] = useState(false); // 추가 버튼 클릭 상태
    const [newPriceData, setNewPriceData] = useState({
        customerName: '',
        productNm: '',
        categoryNm: '',
        priceCustomer: '',
        priceStartDate: null,
        priceEndDate: null
    });

    const [editingId, setEditingId] = useState(null); // 수정 중인 항목 ID를 저장
    const [editedPriceData, setEditedPriceData] = useState({}); // 수정 중인 항목 데이터를 저장
    
    // 🟡 조건에 따른 가격 리스트 출력
    useEffect(() => {
        
        const fetchData = async () => {
            setLoading(true); // 데이터를 가져오기 전에 로딩 상태를 true로 설정
            const MIN_LOADING_TIME = 300; //600; // 최소 로딩 시간
            const startTime = Date.now(); // 요청 시작 시간 기록
            try {
                // 요청 파라미터 콘솔 출력
                // 서버로부터 데이터를 받아오는 요청

                const response = await axios.get('/api/price/all', {
                    params: {
                        customerNo: selectedCustomerNo || null,  // 필터로 사용될 고객 번호
                        productCd: selectedProductCd || null,    // 필터로 사용될 제품 코드
                        startDate: startDate ? formatDate(startDate) : null,  // 필터로 사용될 시작 날짜
                        endDate: endDate ? formatDate(endDate) : null,        // 필터로 사용될 종료 날짜
                        page: currentPage > 0 ? currentPage : 1,             // 페이지 번호
                        size: itemsPerPage > 0 ? itemsPerPage : 20,          // 페이지당 항목 수
                        sort: sortField ? sortField : 'priceNo',             // 정렬 필드
                        order: sortOrder || 'asc',                           // 정렬 순서 (기본값: 오름차순)
                    },
                });

                // 서버로부터 받아온 데이터를 처리하여 상태 업데이트
                const { content, totalElements, totalPages } = response.data;

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
                        setLoading(false);
                    }, remainingTime);
                } else {
                    setLoading(false);
                }
            }
        };

        setSelectAll(false);  // 전체 선택을 false로 명확히 설정
        setSelectedItems([]);  // 개별 선택 항목 초기화
        fetchData();
        console.log("🚀  🔴  file: ProductPriceHooks.js:13  🔴  useHooksList  🔴  setEditedPriceData:");
        return;
    }, [selectedCustomerNo, selectedProductCd, startDate, endDate, currentPage, itemsPerPage, sortField, sortOrder]); // 필터 및 페이지 변경 시마다 데이터 재요청

    // 🟡 currentPage가 변경될 때 pageInputValue 업데이트
    useEffect(() => {
        if (pageInputValue !== currentPage && pageInputValue > 0) {
            setPageInputValue(currentPage);
        }
    }, [currentPage]);

    // 🟡 pageInputValue가 변경될 때 currentPage 업데이트
    useEffect(() => {
        if (pageInputValue !== currentPage) {
            setCurrentPage(pageInputValue > 0 ? pageInputValue : 1);
        }
    }, [pageInputValue]);

    // 🟡 모든 항목이 선택되었을 때 '전체 선택' 체크박스도 체크되도록
    useEffect(() => {
        setSelectAll(selectedItems.length === priceList.length);
    }, [selectedItems, priceList]);

    // 🟢 페이지당 항목 수 변경(1~500)
    const handleItemsPerPageChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^\d]/g, ''); // 숫자가 아닌 모든 문자 제거
        if (parseInt(value, 10) > 500) value = 500;
        setItemsPerPage(value); // 페이지당 항목 수 변경
        setCurrentPage(1); // 페이지 번호 초기화
    };

    // 🟢 페이지 번호 변경(1~최대 페이지)
    const handlePageInputChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^\d]/g, ''); // 숫자가 아닌 모든 문자 제거
        // 빈 값 처리
        if (value === '') {
            setPageInputValue(''); // 입력 필드 비움
            return;
        }
        // 최대 페이지 제한 처리
        value = parseInt(value, 10);
        if (value > totalPages) value = totalPages; // 총 페이지를 초과하면 최대 페이지로 설정
        setPageInputValue(value); // 페이지 입력 필드 값 설정
    };

    // 🟢 입력값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPriceData({
            ...newPriceData,
            [name]: value
        });
    };

    // 🟢 검색어 변경
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    // 🟢 시작 날짜 변경
    const handleStartDateChange = (value) => {
        setStartDate(value); // 시작 날짜 상태 업데이트
    };

    // 🟢 종료 날짜 변경
    const handleEndDateChange = (value) => {
        setEndDate(value); // 종료 날짜 상태 업데이트
    };

    // 🟢 상태 변경
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.id);
    };


    // 🟢 개별 체크박스 선택
    const handleCheckboxChange = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // 🟢 전체 선택/해제
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedItems([]); // 전체 해제
        } else {
            setSelectedItems(priceList.map(item => item.priceNo)); // 전체 선택
        }
        setSelectAll(!selectAll); // 전체 선택 상태 토글
    };


    // 🟣 검색어 삭제 버튼 클릭
    const handleSearchTextDelClick = () => {
        setSearchText('');
    };

    // 🟣 페이지 번호 클릭
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber); // 클릭한 페이지 번호로 현재 페이지 변경
    };

    // 🟣 등록 버튼 클릭
    const handleAddNewPriceClick = () => {
        // 추가된 데이터를 서버에 전송하거나 상태에 반영하는 로직 구현🟥
        console.log('새 가격 정보 등록:', newPriceData);
        setIsAdding(false); // 추가 행 숨기기
    };

    // 🟣 취소 버튼 클릭
    const handleAddCancelClick = () => {
        setIsAdding(false); // 추가 행 숨기기
    };

    return {
        priceList,               // 가격 리스트 상태 (고객사별 상품 가격 데이터를 담고 있는 배열)
        isLoading,               // 로딩 상태 (데이터를 불러오는 중일 때 true로 설정)

        totalItems,
        itemsPerPage,            // 페이지당 항목 수 (사용자가 선택한 한 페이지에 표시할 데이터 개수)
        handleItemsPerPageChange,// 페이지당 항목 수 변경 함수 (사용자가 페이지당 몇 개의 항목을 볼지 선택하는 함수)

        handlePageClick,         // 페이지 변경 함수 (사용자가 페이지를 이동할 때 호출하는 함수)
        totalPages,              // 총 페이지 수 (전체 데이터에서 페이지당 항목 수로 나눈 페이지 개수)
        currentPage,             // 현재 페이지 (사용자가 현재 보고 있는 페이지 번호)

        pageInputValue,          // 페이지 입력 필드의 값
        handlePageInputChange,   // 페이지 입력값 변경 함수

        searchText,
        handleSearchTextChange,
        handleSearchTextDelClick,
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        selectedStatus,
        handleStatusChange,

        selectedItems,
        selectAll,
        handleCheckboxChange,
        handleSelectAllChange,

        isAdding,                // 추가 상태 (추가 버튼을 눌러 새로운 입력 행을 보여줄지 여부를 나타내는 상태)
        setIsAdding,             // 추가 상태 변경 함수
        newPriceData,            // 새로운 가격 데이터를 담는 상태
        handleInputChange,       // 입력값 변경 함수 (사용자가 입력한 값이 상태에 반영됨)
        handleAddNewPriceClick,  // 새로운 가격을 추가하는 함수
        handleAddCancelClick,    // 추가를 취소하는 함수
        editingId,               // 수정 중인 항목 ID
        editedPriceData,         // 수정 중인 항목 데이터를 담는 상태
    };

};