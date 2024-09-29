// src/main/react/components/price/PriceHooks.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useDebounce } from '../common/useDebounce'; // useDebounce 훅 임포트

// 🔴 날짜 포맷팅 함수
function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // 유효하지 않은 날짜
    return format(d, 'yyyy-MM-dd');
}

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
    const [targetDate, setTargetDate] = useState(null);
    const [isCurrentPriceChecked, setIsCurrentPriceChecked] = useState(false); // 현재 적용되는 가격 체크박스 상태

    const [selectedStatus, setSelectedStatus] = useState("active"); // 상태

    // 체크박스 상태 관리
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false); // 초기값을 false로 설정

    const [sortField, setSortField] = useState('priceInsertDate'); // 정렬 필드(기본값 : 등록일시)
    const [sortOrder, setSortOrder] = useState('desc'); // 정렬 순서(기본값 : 내림차순)

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

    const [isInitialRender, setIsInitialRender] = useState(true); // 초기 렌더링 여부를 추적하는 상태 변수

    // 🔴🔴🔴 select
    const fetchData = async () => {
        console.log("🔴 fetch");
        setLoading(true);
        const MIN_LOADING_TIME = 100;
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
                    sort: sortField,
                    order: sortOrder,
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

    // 🔴🔴🔴 update(del_yn - 삭제 또는 복원)
    const updateDeleteYnList = async (priceList, successMessage, errorMessage) => {
        try {
            await axios.put('/api/price/updateDel', priceList);
            await fetchData();
            window.showToast(successMessage);
        } catch (error) {
            console.error(errorMessage, error);
            window.showToast(errorMessage);
        }
    };

    // 🔴 updateDeleteYnList로 연결
    const updateDeleteYn = async (priceNo, deleteYn) => {
        const priceList = [{ priceNo, priceDeleteYn: deleteYn }];
        const successMessage = deleteYn === 'Y' ? '해당 항목이 삭제되었습니다.' : '해당 항목이 복원되었습니다.';
        const errorMessage = `${deleteYn === 'Y' ? '삭제' : '복원'} 처리 중 오류가 발생했습니다.`;
        await updateDeleteYnList(priceList, successMessage, errorMessage);
    };

    // 🟡 조건에 따른 가격 리스트 출력
    useEffect(() => {
        console.log("🔴 fetch 11");
        fetchData();
    }, [selectedCustomerNo, selectedProductCd, startDate, endDate, selectedStatus, currentPage, itemsPerPage, sortField, sortOrder, debouncedCustomerSearchText, debouncedProductSearchText]);

    // 🟡 오늘 적용되는 가격만 보기 체크박스가 체크되었을 때 targetDate 관리
    useEffect(() => {
        if (isCurrentPriceChecked) {
            if (targetDate !== today) {
                setTargetDate(today);
            }
        } else {
            if (targetDate === today) {
                setTargetDate(null); // targetDate가 오늘이면 체크 해제 시 초기화
            }
        }
    }, [isCurrentPriceChecked]);

    // 🟡 targetDate가 오늘 날짜가 아니면 체크 해제 (초기 렌더링에서는 실행되지 않도록 제어)
    useEffect(() => {
        if (!isInitialRender) {
            if (targetDate === today && !isCurrentPriceChecked) {
                setIsCurrentPriceChecked(true);
            } else if (targetDate !== today && isCurrentPriceChecked) {
                setIsCurrentPriceChecked(false);
            }
            fetchData(); // targetDate가 변경될 때 fetchData 실행
        } else {
            setIsInitialRender(false); // 초기 렌더링 이후로 설정
        }
    }, [targetDate]);

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
        if (selectedItems.length === 0) {
            setSelectAll(false); // 모든 항목이 해제되었을 때 전체 선택 체크박스 해제
        } else {
            setSelectAll(selectedItems.length === priceList.length); // 모든 항목이 선택되었을 때 전체 선택 체크박스 체크
        }
    }, [selectedItems, priceList]);

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
            // 전체 해제
            setSelectedItems([]);
        } else {
            // 상태가 'N'인 항목만 선택
            setSelectedItems(priceList.filter(item => item.priceDeleteYn !== 'Y').map(item => item.priceNo));
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
        setSelectedItems([]); // 선택 상태 초기화
    };

    // 🟣 추가하기-저장 버튼 클릭
    const handleAddSave = () => {
        window.showToast('저장되었습니다.');
        console.log('새 가격 정보 등록:', newPriceData);
        setIsAdding(false); // 추가 행 숨기기
        fetchData(); // 데이터 재조회
    };

    // 🟣 추가하기-취소 버튼 클릭
    const handleAddCancel = () => {
        setIsAdding(false); // 추가 행 숨기기
    };

    // 🟣 수정하기 버튼 클릭
    const handleEdit = (priceNo) => {

        setIsAdding(false); // 등록 상태 초기화
        setSelectedItems([]); // 선택 상태 초기화

        // 수정할 데이터 찾기
        const priceDataToEdit = priceList.find((item) => item.priceNo === priceNo);

        // editingId에 현재 수정 중인 priceNo를 설정하고, 수정할 데이터를 editedPriceData에 설정
        setEditingId(priceNo);
        setEditedPriceData({
            priceNo: priceDataToEdit.priceNo,
            customerName: priceDataToEdit.customerName,
            customerNo: priceDataToEdit.customerNo,
            productNm: priceDataToEdit.productNm,
            productCd: priceDataToEdit.productCd,
            categoryNm: priceDataToEdit.categoryNm,
            priceCustomer: priceDataToEdit.priceCustomer,
            priceStartDate: priceDataToEdit.priceStartDate,
            priceEndDate: priceDataToEdit.priceEndDate
        });
    };

    // 🟣 수정 완료 버튼 클릭
    const handleSaveEdit = () => {
        window.showToast('수정되었습니다.');
        // 수정 완료 후, editingId 초기화 및 editedPriceData 초기화
        setEditingId(null);
        setEditedPriceData({});
        fetchData(); // 데이터 재조회
    };

    // 🟣 수정 취소 버튼 클릭
    const handleCancelEdit = () => {
        // 수정 취소: editingId 및 수정 중인 데이터 초기화
        setEditingId(null);
        setEditedPriceData({});
    };

    // 🟣 삭제 버튼 클릭 (단일 삭제)
    const handleDelete = (priceNo) => {
        window.confirmCustom("해당 항목을 삭제하시겠습니까?").then(result => {
            if (result) {
                updateDeleteYn(priceNo, 'Y');
            }
        });
    };

    // 🟣 선택 삭제 버튼 클릭 (del_yn 업데이트)
    const handleDeleteSelected = () => {
        window.confirmCustom(`선택된 ${selectedItems.length}건을 삭제하시겠습니까?`).then(result => {
            if (result) {
                const priceList = selectedItems.map(item => ({
                    priceNo: item,
                    priceDeleteYn: 'Y'  // del_yn 값을 'Y'로 업데이트
                }));

                const successMessage = `선택된 ${selectedItems.length}건이 삭제 처리되었습니다.`;
                const errorMessage = '선택 항목 삭제 처리 중 오류가 발생했습니다.';

                updateDeleteYnList(priceList, successMessage, errorMessage)
                    .then(() => {
                        // 상태 업데이트
                        setSelectedItems([]);  // 삭제 후 선택 항목 초기화
                        setSelectAll(false);   // 전체 선택 체크박스 해제
                    })
                    .catch(error => {
                        console.error("선택 항목 삭제 처리 중 오류 발생:", error);
                        window.showToast('선택 항목 삭제 처리 중 오류가 발생했습니다.');
                    });
            }
        });
    };

    // 🟣 복원 버튼 클릭
    const handleRestore = (priceNo) => updateDeleteYn(priceNo, 'N');

    // 🟣 모달 열기
    const openConfirmModal = () => {
        setConfirmModalOpen(true);
    };

    // 🟣 모달 닫기
    const closeConfirmModal = () => {
        setConfirmModalOpen(false);
    };

    // 사용자가 모달에서 확인 버튼을 누르면 실행
    const handleConfirmAction = async () => {
        if (confirmedAction) {
            await confirmedAction();  // 사용자가 확정한 작업 실행
        }
        closeConfirmModal();  // 모달 닫기
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

        updateDeleteYn,            // 삭제/복원 버튼 클릭 함수
        handleDelete,
        handleRestore,
        handleDeleteSelected,    // 선택 삭제

        sortField,
        setSortField,
        sortOrder,
        setSortOrder,
        fetchData,
    };

};