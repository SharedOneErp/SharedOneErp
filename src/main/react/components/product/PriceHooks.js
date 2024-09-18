// src/main/react/components/product/PriceHooks.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { formatDate } from '../../util/dateUtils';
import { format } from 'date-fns';
import { useDebounce } from '../common/useDebounce'; // useDebounce 훅 임포트

export const useHooksList = () => {

    // 오늘 날짜 가져오기
    const today = format(new Date(), 'yyyy-MM-dd');

    // 🔴 useState : 상태 정의 및 초기화
    const [priceList, setPriceList] = useState([]); // 가격 리스트

    const [totalItems, setTotalItems] = useState(0); // 전체 항목 수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [pageInputValue, setPageInputValue] = useState(1); // 페이지 입력 필드의 값

    const [selectedCustomerNo, setSelectedCustomerNo] = useState(''); // 선택된 고객사
    const [selectedProductCd, setSelectedProductCd] = useState(''); // 선택된 상품

    const [customerSearchText, setCustomerSearchText] = useState(''); // 고객사 검색어
    const debouncedCustomerSearchText = useDebounce(customerSearchText, 300); // 딜레이 적용
    const [productSearchText, setProductSearchText] = useState(''); // 상품 검색어
    const debouncedProductSearchText = useDebounce(productSearchText, 300); // 딜레이 적용

    const [startDate, setStartDate] = useState(null); // 시작 날짜
    const [endDate, setEndDate] = useState(null); // 종료 날짜
    const [targetDate, setTargetDate] = useState(today);
    const [isCurrentPriceChecked, setIsCurrentPriceChecked] = useState(true); // 현재 적용되는 가격 체크박스 상태

    const [selectedStatus, setSelectedStatus] = useState("active"); // 상태

    // 체크박스 상태 관리
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // 초기값을 false로 설정

    const [sortField, setSortField] = useState(null); // 정렬 필드
    const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서

    const [isLoading, setLoading] = useState(true); // 로딩 상태 관리

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

    // fetchData
    const fetchData = async () => {
        setLoading(true);
        const MIN_LOADING_TIME = 300;
        const startTime = Date.now();

        try {
            const response = await axios.get('/api/price/all', {
                params: {
                    customerNo: selectedCustomerNo || null,
                    productCd: selectedProductCd || null,
                    startDate: startDate ? formatDate(startDate) : null,
                    endDate: endDate ? formatDate(endDate) : null,
                    targetDate: targetDate ? formatDate(targetDate) : null,
                    customerSearchText: debouncedCustomerSearchText || null,
                    productSearchText: debouncedProductSearchText || null,
                    selectedStatus: selectedStatus || null,
                    page: currentPage > 0 ? currentPage : 1,
                    size: itemsPerPage > 0 ? itemsPerPage : 20,
                    sort: sortField ? sortField : 'priceNo',
                    order: sortOrder || 'asc',
                },
            });

            const { content, totalElements, totalPages } = response.data;
            setPriceList(content);
            setTotalItems(totalElements);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('데이터를 불러오는 중 오류 발생:', error);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = MIN_LOADING_TIME - elapsedTime;
            setTimeout(() => {
                setLoading(false);
            }, remainingTime > 0 ? remainingTime : 0);

            // 상태 초기화
            setIsAdding(false);
            setEditingId(null);
            setEditedPriceData({});
            setSelectAll(false);
            setSelectedItems([]);
        }
    };

    // 🟡 조건에 따른 가격 리스트 출력
    useEffect(() => {
        fetchData();
    }, [selectedCustomerNo, selectedProductCd, isCurrentPriceChecked, startDate, endDate, targetDate, selectedStatus, currentPage, itemsPerPage, sortField, sortOrder]);

    // 🟡 오늘 적용되는 가격만 보기 체크박스가 체크되었을 때
    useEffect(() => {
        if (isCurrentPriceChecked) {
            setTargetDate(today);
        } else {
            if (targetDate === today) {
                setTargetDate(null); // targetDate가 오늘이면 체크 해제 시 초기화
            }
        }
    }, [isCurrentPriceChecked, today]);

    // 🟡 targetDate가 오늘 날짜가 아니면 체크 해제
    // targetDate가 오늘 날짜가 아니면 체크 해제, 오늘 날짜면 자동으로 체크
    useEffect(() => {
        if (targetDate === today) {
            setIsCurrentPriceChecked(true);  // targetDate가 오늘이면 자동 체크
        } else {
            setIsCurrentPriceChecked(false); // targetDate가 오늘이 아니면 체크 해제
        }
    }, [targetDate, today]);

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

    // 🟡 검색어가 디바운스된 후 fetchData 호출(고객사)
    useEffect(() => {
        fetchData();
    }, [debouncedCustomerSearchText]);

    // 🟡 검색어가 디바운스된 후 fetchData 호출(상품)
    useEffect(() => {
        fetchData();
    }, [debouncedProductSearchText]);

    // 🟡 startDate 또는 endDate가 변경될 때 targetDate를 확인하고 해제
    useEffect(() => {
        if (targetDate) {
            if (startDate && targetDate < startDate) {
                setTargetDate(null); // targetDate가 startDate 이전이면 해제
            } else if (endDate && targetDate > endDate) {
                setTargetDate(null); // targetDate가 endDate 이후이면 해제
            }
        }
    }, [startDate, endDate, targetDate]);

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

    // 🟢 검색어 변경(고객사)
    const handleCustomerSearchTextChange = (event) => {
        setCustomerSearchText(event.target.value);
    };

    // 🟢 검색어 변경(상품)
    const handleProductSearchTextChange = (event) => {
        setProductSearchText(event.target.value);
    };

    // 🟢 시작 날짜 변경
    const handleStartDateChange = (value) => {
        setStartDate(value); // 시작 날짜 상태만 업데이트
    };

    // 🟢 종료 날짜 변경
    const handleEndDateChange = (value) => {
        setEndDate(value); // 종료 날짜 상태만 업데이트
    };

    // 🟢 적용 날짜 변경
    const handleTargetDateChange = (value) => {
        setTargetDate(value);
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

    // 🟣 검색어 삭제 버튼 클릭 공통 함수
    const handleSearchDel = (setSearch) => {
        setSearch(''); // 공통적으로 상태를 ''로 설정
    };

    // 🟣 페이지 번호 클릭
    const handlePage = (pageNumber) => {
        setCurrentPage(pageNumber); // 클릭한 페이지 번호로 현재 페이지 변경
    };

    // 🟣 추가하기 버튼 클릭
    const handleAdd = () => {
        setIsAdding(true);  // 추가 상태 활성화
        setEditingId(null); // 수정 상태 초기화
        setEditedPriceData({}); // 수정 중인 데이터 초기화
    };

    // 🟣 추가하기-저장 버튼 클릭
    const handleAddSave = () => {
        window.showToast('저장되었습니다.', 5000);
        console.log('새 가격 정보 등록:', newPriceData);
        setIsAdding(false); // 추가 행 숨기기
    };

    // 🟣 추가하기-취소 버튼 클릭
    const handleAddCancel = () => {
        setIsAdding(false); // 추가 행 숨기기
    };

    // 🟣 수정하기 버튼 클릭
    const handleEdit = (priceNo) => {

        setIsAdding(false); // 등록 상태 초기화

        // 수정할 데이터 찾기
        const priceDataToEdit = priceList.find((item) => item.priceNo === priceNo);

        // editingId에 현재 수정 중인 priceNo를 설정하고, 수정할 데이터를 editedPriceData에 설정
        setEditingId(priceNo);
        setEditedPriceData({
            customerName: priceDataToEdit.customerName,
            productNm: priceDataToEdit.productNm,
            categoryNm: priceDataToEdit.categoryNm,
            priceCustomer: priceDataToEdit.priceCustomer,
            priceStartDate: priceDataToEdit.priceStartDate,
            priceEndDate: priceDataToEdit.priceEndDate
        });
    };

    // 🟣 삭제하기 버튼 클릭
    const handleDelete = async (priceNo) => {
        try {
            // 서버로 삭제 요청 전송 (필요에 따라 수정)
            // await axios.delete(`/api/price/${priceNo}`);
            window.showToast('삭제되었습니다.', 5000);

            // 상태에서 해당 항목 제거
            setPriceList((prevList) => prevList.filter((item) => item.priceNo !== priceNo));
        } catch (error) {
            console.error("데이터 삭제 중 오류 발생:", error);
        }
    };

    // 🟣 수정 완료 버튼 클릭
    const handleSaveEdit = async () => {
        // 수정할 데이터를 서버에 전송하거나 상태 업데이트
        try {
            // 서버로 데이터 전송 예시 (필요에 따라 수정)
            // await axios.put(`/api/price/${editingId}`, editedPriceData);
            window.showToast('수정되었습니다.', 5000);

            // 상태 업데이트: priceList에서 수정된 데이터를 반영
            setPriceList((prevList) =>
                prevList.map((item) =>
                    item.priceNo === editingId
                        ? { ...item, ...editedPriceData }
                        : item
                )
            );

            // 수정 완료 후, editingId 초기화 및 editedPriceData 초기화
            setEditingId(null);
            setEditedPriceData({});
        } catch (error) {
            console.error("데이터 저장 중 오류 발생:", error);
        }
    };

    // 🟣 수정 취소 버튼 클릭
    const handleCancelEdit = () => {
        // 수정 취소: editingId 및 수정 중인 데이터 초기화
        setEditingId(null);
        setEditedPriceData({});
    };

    return {
        priceList,               // 가격 리스트 상태 (고객사별 상품 가격 데이터를 담고 있는 배열)
        isLoading,               // 로딩 상태 (데이터를 불러오는 중일 때 true로 설정)

        totalItems,              // 전체 항목 수 상태
        itemsPerPage,            // 페이지당 항목 수 (사용자가 선택한 한 페이지에 표시할 데이터 개수)
        handleItemsPerPageChange,// 페이지당 항목 수 변경 함수 (사용자가 페이지당 몇 개의 항목을 볼지 선택하는 함수)

        handlePage,         // 페이지 변경 함수 (사용자가 페이지를 이동할 때 호출하는 함수)
        totalPages,              // 총 페이지 수 (전체 데이터에서 페이지당 항목 수로 나눈 페이지 개수)
        currentPage,             // 현재 페이지 (사용자가 현재 보고 있는 페이지 번호)

        pageInputValue,          // 페이지 입력 필드의 값
        handlePageInputChange,   // 페이지 입력값 변경 함수 (입력된 페이지 번호를 변경하는 함수)

        customerSearchText,              // 검색어 상태(고객사)
        setCustomerSearchText,
        handleCustomerSearchTextChange,
        productSearchText,              // 검색어 상태(상품)
        setProductSearchText,
        handleProductSearchTextChange,

        startDate,               // 시작 날짜 상태
        setStartDate,
        handleStartDateChange,
        endDate,                 // 종료 날짜 상태
        setEndDate,
        handleEndDateChange,
        targetDate,              // 적용 대상 날짜 상태
        setTargetDate,
        handleTargetDateChange,
        handleSearchDel,         // 공통 검색어/검색날짜 삭제 함수

        isCurrentPriceChecked,
        setIsCurrentPriceChecked,
        selectedStatus,          // 선택된 상태 (전체/정상/삭제)
        handleStatusChange,      // 상태 변경 함수 (전체/정상/삭제 상태 변경)

        selectedItems,           // 선택된 항목 ID 배열
        selectAll,               // 전체 선택 여부 상태
        handleCheckboxChange,    // 개별 체크박스 선택/해제 함수
        handleSelectAllChange,   // 전체 선택/해제 체크박스 클릭 함수

        isAdding,                // 추가 상태 (새로운 항목 추가 버튼 클릭 여부)
        newPriceData,            // 새로운 가격 데이터를 담는 상태
        setIsAdding,             // 추가 상태 변경 함수 (추가하기 버튼 클릭 시 추가 상태 전환)
        handleInputChange,       // 입력값 변경 함수 (사용자가 입력한 값이 상태에 반영됨)
        handleAdd,
        handleAddSave,       // 새로운 가격을 추가하는 함수 (저장 버튼 클릭)
        handleAddCancel,         // 추가 상태 취소 함수 (취소 버튼 클릭)

        handleEdit,              // 수정 버튼 클릭 함수 (수정 모드로 전환)
        editingId,               // 수정 중인 항목 ID (현재 수정 중인 항목의 ID)
        editedPriceData,         // 수정 중인 항목 데이터를 담는 상태
        handleSaveEdit,          // 수정 저장 함수 (수정된 데이터를 저장하는 함수)
        handleCancelEdit,        // 수정 취소 함수 (수정 모드를 취소)

        handleDelete,            // 삭제 버튼 클릭 함수 (항목을 삭제하는 함수)
    };

};