// src/components/product/ProductPriceHooks.js
import {useState, useEffect} from 'react';
import axios from 'axios';
import {formatDate} from '../../util/dateUtils';

export const useHooksList = () => {

    const [priceList, setPriceList] = useState([]); // 가격 리스트 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [editIndex, setEditIndex] = useState(null); // 수정 중인 항목 인덱스
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

// 가격 리스트를 서버에서 받아오는 함수
    useEffect(() => {
        const fetchData = async () => {
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
            }
        };

        fetchData();
    }, [selectedCustomer, selectedProduct, startDate, endDate, currentPage, itemsPerPage, sortField, sortOrder]); // 필터 및 페이지 변경 시마다 데이터 재요청

// 가격 항목 추가 함수
    const handleAddPrice = () => {
        setPriceList([
            ...priceList,
            {
                customer: '',
                product: '',
                price: '',
                startDate: new Date(),
                endDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    };

// 폼 데이터 변경 시 호출되는 함수
    const handleChange = (index, field, value) => {
        const newList = [...priceList];
        newList[index][field] = value; // 필드 값 업데이트
        newList[index].updatedAt = new Date(); // 수정 날짜 업데이트
        setPriceList(newList); // 업데이트된 리스트 저장
    };

// 항목 삭제 함수
    const handleDelete = (index) => {
        const newList = priceList.filter((_, i) => i !== index); // 해당 항목 삭제
        setPriceList(newList); // 삭제된 리스트 저장
    };

// 수정 모드로 변경하는 함수
    const handleEdit = (index) => {
        setEditIndex(index); // 수정 중인 항목 인덱스 설정
    };

// 수정 완료 후 저장하는 함수
    const handleSave = () => {
        setEditIndex(null); // 수정 모드 종료
    };

// 모달 열기 함수
    const openModal = () => {
        setIsModalOpen(true); // 모달 열림 상태로 변경
    };

// 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기 상태로 변경
    };

// 상품 선택 시 호출되는 함수
    const handleProductSelect = (product) => {
        setSelectedProduct(product.name); // 선택된 상품 설정
    };

    // 페이지당 항목 수 변경 함수
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value)); // 페이지당 항목 수 변경
        setCurrentPage(1); // 페이지 번호 초기화
    };

// 정렬을 위한 함수
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // 정렬 순서 변경
        } else {
            setSortField(field); // 정렬 필드 설정
            setSortOrder('asc'); // 정렬 순서를 오름차순으로 설정
        }
    };

// 가격 리스트 필터링
    const filteredList = priceList.filter((item) => {
        const matchesCustomer = !selectedCustomer || item.customer.includes(selectedCustomer);
        const matchesProduct = !selectedProduct || item.product.includes(selectedProduct);
        const matchesDate = (!startDate || item.startDate >= startDate) &&
            (!endDate || item.endDate <= endDate);
        return matchesCustomer && matchesProduct && matchesDate;
    });

// 정렬된 리스트 반환
    const sortedList = [...filteredList].sort((a, b) => {
        if (!sortField) return 0;
        const order = sortOrder === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -order;
        if (a[sortField] > b[sortField]) return order;
        return 0;
    });

// 페이지네이션 처리된 리스트 반환
    const paginatedList = sortedList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

// 총 페이지 수 계산
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return {
        selectedCustomer,        // [2] 선택된 고객사
        setSelectedCustomer,     // [3] 고객사 설정 함수
        selectedProduct,         // [4] 선택된 상품
        setSelectedProduct,      // [5] 상품 설정 함수
        isModalOpen,             // [6] 모달 열림 상태
        editIndex,               // [7] 수정 중인 항목 인덱스
        setEditIndex,            // [8] 수정 중인 항목 인덱스 설정 함수
        setItemsPerPage,         // [10] 페이지당 항목 수 설정 함수
        currentPage,             // [11] 현재 페이지
        setCurrentPage,          // [12] 현재 페이지 설정 함수
        sortField,               // [13] 정렬 필드
        sortOrder,               // [14] 정렬 순서
        startDate,               // [15] 시작 날짜
        setStartDate,            // [16] 시작 날짜 설정 함수
        endDate,                 // [17] 종료 날짜
        setEndDate,              // [18] 종료 날짜 설정 함수
        paginatedList,           // [19] 페이지네이션 처리된 리스트
        totalPages,              // [20] 총 페이지 수
        handleAddPrice,          // [21] 가격 항목 추가 함수
        handleChange,            // [22] 폼 데이터 변경 함수
        handleDelete,            // [23] 항목 삭제 함수
        handleEdit,              // [24] 수정 모드로 변경하는 함수
        handleSave,              // [25] 수정 완료 후 저장 함수
        openModal,               // [26] 모달 열기 함수
        closeModal,              // [27] 모달 닫기 함수
        handleProductSelect,     // [28] 상품 선택 시 호출되는 함수
        handleSort,              // [30] 정렬을 위한 함수
        handlePageChange,        // [31] 페이지 변경 함수
    };

};