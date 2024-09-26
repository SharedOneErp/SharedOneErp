import { useCallback, useEffect, useMemo, useState } from "react";
import axios from 'axios';
import { useCategoryHooks } from "./useCategoryHooks";

export const useProductHooks = () => {

    const {
        topCategories,
        isLoading: isCategoryLoading,
        getFilteredCategories
    } = useCategoryHooks();

    // 🟢 조회
    // 🟡 등록
    // 🟠 수정
    // 🟣 삭제
    // ⚪ 기타

    ///////////////////////////////////////////////////////////// state

    // 🟢 모드 state (로딩)
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 상품 state
    const [products, setProducts] = useState([]); // 전체 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록
    const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 목록

    // 🟢 카테고리 state
    const [middleCategories, setMiddleCategories] = useState([]);
    const [lowCategories, setLowCategories] = useState([]);
    const [filterTopCategory, setFilterTopCategory] = useState(''); // 대분류 필터
    const [filterMiddleCategory, setFilterMiddleCategory] = useState(''); // 중분류 필터
    const [filterLowCategory, setFilterLowCategory] = useState(''); // 소분류 필터

    // 🟢 검색 state
    const [searchTerm, setSearchTerm] = useState('');

    // 🟢 정렬 state
    const [selectedStatus, setSelectedStatus] = useState("active"); // 상태
    const [sortColumn, setSortColumn] = useState('productCd'); // 정렬할 컬럼
    const [sortDirection, setSortDirection] = useState('asc'); // 정렬 방향

    // 🟢 페이지네이션 state
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지 당 상품 수
    const [totalItems, setTotalItems] = useState(0); // 총 상품 수
    const [pageInputValue, setPageInputValue] = useState(1);

    // 🟡 모드 state (등록)
    const [isAddMode, setIsAddMode] = useState(false);

    // 🟡 상품 state
    const [newProductData, setNewProductData] = useState({
        productCd: '',
        productNm: '',
        categoryNo: null,
        productPrice: '',
    });

    // 🟡 카테고리 state
    const [addMiddleCategories, setAddMiddleCategories] = useState([]);
    const [addLowCategories, setAddLowCategories] = useState([]);
    const [selectedTopCategory, setSelectedTopCategory] = useState('');
    const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
    const [selectedLowCategory, setSelectedLowCategory] = useState('');

    //  🟠 모드 state (수정)
    const [isEditMode, setIsEditMode] = useState(null);

    // 🟠 상품 state
    const [editableProduct, setEditableProduct] = useState({
        productCd: '',
        productNm: '',
        categoryNo: '',
        topCategoryNo: '',
        middleCategoryNo: '',
        lowCategoryNo: '',
    });

    // 🟠 카테고리 state
    const [filteredEditMiddleCategories, setFilteredEditMiddleCategories] = useState([]);
    const [filteredEditLowCategories, setFilteredEditLowCategories] = useState([])

    // ⚪ 모달 state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductCd, setSelectedProductCd] = useState(null);

    ///////////////////////////////////////////////////////////// 함수

    // 🟢 상품 목록 조회
    const fetchProducts = useCallback(() => {
        setIsLoading(true);
        axios
            .get('/api/products/productList', {
                params: {
                    page: currentPage || null,
                    size: itemsPerPage || null,
                    topCategoryNo: filterTopCategory || null,
                    middleCategoryNo: filterMiddleCategory || null,
                    lowCategoryNo: filterLowCategory || null,
                    status: selectedStatus,
                    sortColumn,
                    sortDirection,
                    productNm: searchTerm || null,
                    productCd: searchTerm || null,
                },
            })
            .then((response) => {

                const productsWithCategoryNames = (response.data.content || []).map(product => ({
                    ...product,
                    topCategory: product.topCategory || '-',
                    middleCategory: product.middleCategory || '-',
                    lowCategory: product.lowCategory || '-',
                    productPrice: product.productPrice || 0,
                    productDeleteYn: product.productDeleteDate == null ? 'N' : 'Y',
                }));

                if (selectedStatus === 'active') {
                    setFilteredProducts(productsWithCategoryNames.filter(product => product.productDeleteYn === 'N'));
                } else if (selectedStatus === 'deleted') {
                    setFilteredProducts(productsWithCategoryNames.filter(product => product.productDeleteYn === 'Y'));
                } else {
                    setFilteredProducts(productsWithCategoryNames);
                }

                setProducts(productsWithCategoryNames);
                setTotalItems(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);

            })
            .catch((error) => {
                console.error('전체 상품 목록 조회 실패', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory, selectedStatus, sortColumn, sortDirection, searchTerm]);

    // 🟢 초기 상품 목록 및 필터링 조회
    useEffect(() => {
        fetchProducts();
    }, []);

    // 🟢 대분류 선택 시 중분류 목록 필터링
    const handleFilterTopCategoryChange = (e) => {
        const selectedTop = parseInt(e.target.value);
        setFilterTopCategory(selectedTop);

        if (selectedTop || selectedTop !== '') {
            setMiddleCategories(getFilteredCategories(2, selectedTop));
            setFilterMiddleCategory('');
            setLowCategories([]);
            setFilterLowCategory('');
        } else {
            setMiddleCategories([]);
            setLowCategories([]);
            setFilterMiddleCategory('');
            setFilterLowCategory('');
        }

        setCurrentPage(1);
    }

    // 🟢 중분류 선택 시 소분류 카테고리 목록 필터링
    const handleFilterMiddleCategoryChange = (e) => {
        const selectedMiddle = parseInt(e.target.value);
        setFilterMiddleCategory(selectedMiddle);

        if (selectedMiddle || selectedMiddle !== '') {
            setLowCategories(getFilteredCategories(3, selectedMiddle));
            setFilterLowCategory('');
        } else {
            setLowCategories([]);
            setFilterLowCategory('');
        }

        setCurrentPage(1);
    };

    // 🟢 소분류 선택 시 카테고리 번호 저장
    const handleFilterLowCategoryChange = (e) => {
        const selectedLow = parseInt(e.target.value);
        setFilterLowCategory(selectedLow);
        setCurrentPage(1);

    };

    // 🟢 카테고리 및 검색 조건이 변경될 때마다 상품 목록 조회
    useEffect(() => {
        fetchProducts();
    }, [filterTopCategory, filterMiddleCategory, filterLowCategory, searchTerm, currentPage, itemsPerPage, selectedStatus, sortColumn, sortDirection]);


    // 🟢 상태 변경 함수
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.id); // 상태 변경
    };

    // 🟢 상태 변경 시 데이터 로드
    useEffect(() => {
        if (selectedStatus) {
            console.log('상태 변경:', selectedStatus); // 상태 확인 로그
            fetchProducts();
        }
    }, [selectedStatus]);

    // 🟢 정렬 상태 변경될 때 데이터 로드
    useEffect(() => {
        if (sortColumn && sortDirection) {
            fetchProducts();
        }
    }, [sortColumn, sortDirection]);

    // 🟢 정렬 함수
    const handleSort = (column) => {
        if (!isLoading) {
            if (sortColumn === column) {
                setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortColumn(column);
                setSortDirection('asc');
            }

            fetchProducts();
        }
    };

    // 🟢 페이지 변경
    const handlePageChange = (pageNumber) => {
        const newPage = Math.min(pageNumber, totalPages);

        // 선택된 상품 초기화 (전체 선택 해제)
        setSelectedProducts([]);

        // 페이지 변경 후 전체 선택 체크박스 상태 초기화
        const allSelectCheckbox = document.getElementById('all-select_checkbox');
        if (allSelectCheckbox) {
            allSelectCheckbox.checked = false;
        }

        setCurrentPage(newPage);
    }

    // 🟢 페이지당 항목 수 변경
    const handleItemsPerPageChange = (e) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 1) {
            window.showToast('페이지당 항목 수는 최소 1 이상이어야 합니다.', 'error');
            setItemsPerPage(20); // 기본값으로 설정
        } else {
            setItemsPerPage(parsedValue);
        }
        setCurrentPage(1);
    };

    // 🟢 페이지네이션 번호 계산
    const paginationNumbers = useMemo(() => {
        const maxPagesToShow = 5;
        const currentPageGroup = Math.floor((currentPage) / maxPagesToShow);
        const startPage = Math.max(currentPageGroup * maxPagesToShow + 1, 1); // 시작 페이지
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages); // 끝 페이지

        if (totalPages === 0) {
            return [];
        }

        return [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);
    }, [currentPage, totalPages]);
    const handlePreviousPageGroup = () => {
        if (currentPage > 1) {
            setCurrentPage(Math.max(1, paginationNumbers[0]));
        }
    };
    const handleNextPageGroup = () => {
        if (currentPage < totalPages) {
            setCurrentPage(paginationNumbers[paginationNumbers.length - 1] + 1);
        }
    };


    // 🟢 페이지 입력 필드의 변경
    const handlePageInputChange = (e) => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');

        if (value === '' || isNaN(value)) {
            setPageInputValue('');
            setCurrentPage(1);
        } else {
            let page = Number(value);

            // 페이지 유효성 검사
            if (page < 1) {
                page = 1;
            }
            if (page > totalPages) {
                page = totalPages;
            }

            setPageInputValue(page);
            setCurrentPage(page);
        }
    };

    // 🟡 상품 등록 함수
    const handleAddNewProduct = () => {
        const { productCd, productNm, productPrice, categoryNo } = newProductData;

        if (!productCd || !productNm || !productPrice) {
            window.showToast('상품코드, 상품명, 기준가를 모두 입력해주세요.', 'error');
            return;
        }

        if (isNaN(productPrice)) {
            window.showToast( '기준가는 숫자만 입력할 수 있습니다.', 'error');
            return;
        }

        axios.post('/api/products/add', newProductData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                window.showToast('상품이 성공적으로 등록되었습니다.');


                // 등록 상태 초기화 및 입력 데이터 초기화
                setIsAddMode(false);
                setNewProductData({
                    productCd: '',
                    productNm: '',
                    categoryNo: null,
                    productPrice: '',
                });
                setSelectedTopCategory('');
                setSelectedMiddleCategory('');
                setSelectedLowCategory('');
                setAddMiddleCategories([]);
                setAddLowCategories([]);
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    window.showToast('이미 존재하는 상품 코드입니다. 다른 코드를 입력해주세요.', 'error');
                    setNewProductData(prevState => ({
                        ...prevState,
                        productCd: '',
                    }));
                } else {
                    console.error('상품 추가 실패:', error.response?.data || error.message);
                    window.showToast('상품 추가에 실패했습니다. 다시 시도해주세요.', 'error');
                }
            })
            .finally(() => {
                fetchProducts();
            });
    };

    // 🟡 상품 등록 취소 함수
    const handleCancelAdd = () => {
        setIsAddMode(false);
        setNewProductData({
            productCd: '',
            productNm: '',
            categoryNo: null,
            productPrice: '',
        });
        setSelectedTopCategory('');
        setSelectedMiddleCategory('');
        setSelectedLowCategory('');
        setAddMiddleCategories([]);
        setAddLowCategories([]);
    };

    // 🟡 대분류 선택 시 중분류 목록 가져오기
    const handleAddTopCategoryChange = (e) => {
        const selectedTop = parseInt(e.target.value);
        setSelectedTopCategory(selectedTop);

        if (selectedTop) {
            const filteredMiddle = getFilteredCategories(2, selectedTop);
            setAddMiddleCategories(filteredMiddle);
            setSelectedMiddleCategory('');
            setAddLowCategories([]);
            setSelectedLowCategory('');
        } else {
            setAddMiddleCategories([]);
            setSelectedMiddleCategory('');
            setAddLowCategories([]);
            setSelectedLowCategory('');
        }
    }

    // 🟡 중분류 선택 시 소분류 목록 가져오기
    const handleAddMiddleCategoryChange = (e) => {
        const selectedMiddle = parseInt(e.target.value);
        setSelectedMiddleCategory(selectedMiddle);

        if (selectedMiddle) {
            const filteredLow = getFilteredCategories(3, selectedMiddle);
            setAddLowCategories(filteredLow);
            setSelectedLowCategory('');
        } else {
            setAddLowCategories([]);
            setSelectedLowCategory('');
        }
    }

    // 🟡 소분류 선택 시 categoryNo 설정
    const handleLowCategoryChange = (e) => {
        const selectedLow = parseInt(e.target.value);
        setSelectedLowCategory(selectedLow);

        setNewProductData(prevData => ({
            ...prevData,
            categoryNo: selectedLow !== '' ? selectedLow : null
        }));
    }
    
    // 🟠 상품 수정 함수
    const handleEditClick = (product) => {
        setIsEditMode(product.productCd);

        console.log('선택한 상품:', product);

        // 선택된 상품의 카테고리 정보로 초기화
        setEditableProduct({
            productCd: product.productCd,
            productNm: product.productNm,
            categoryNo: product.lowCategoryNo || product.middleCategoryNo || product.topCategoryNo || '',
            topCategoryNo: product.topCategoryNo || '',
            middleCategoryNo: product.middleCategoryNo || '',
            lowCategoryNo: product.lowCategoryNo || '',
            productPrice: product.productPrice || 0,
        });

        if (product.topCategoryNo) {
            const filteredMiddle = getFilteredCategories(2, product.topCategoryNo);
            setFilteredEditMiddleCategories(filteredMiddle);

            if (product.middleCategoryNo) {
                const filteredLow = getFilteredCategories(3, product.middleCategoryNo);
                setFilteredEditLowCategories(filteredLow);
            } else {
                setFilteredEditLowCategories([]);
            }
        } else {
            setFilteredEditMiddleCategories([]);
            setFilteredEditLowCategories([]);
        }
    };

    // 🟠 상품 수정 완료 함수
    const handleConfirmClick = () => {

        window.confirmCustom('상품을 수정하시겠습니까?').then(result => {
            if (result) {
                const { productCd, productNm, productPrice, categoryNo } = editableProduct;

                if (!productCd || !productNm || !productPrice) {
                    window.showToast('상품코드, 상품명, 가격을 모두 입력해주세요.', 'error');
                    return;
                }

                if (isNaN(productPrice)) {
                    window.showToast('가격은 숫자만 입력할 수 있습니다.', 'error');
                    return;
                }

                const updatedProduct = {
                    productCd,
                    productNm,
                    categoryNo: categoryNo ? Number(categoryNo) : null,
                    productPrice: Number(productPrice),
                };

                axios.put('/api/products/update', updatedProduct, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        window.showToast('상품이 수정되었습니다.');
                        fetchProducts();
                        setIsEditMode(null);
                        setEditableProduct({
                            productCd: '',
                            productNm: '',
                            categoryNo: '',
                            topCategoryNo: '',
                            middleCategoryNo: '',
                            lowCategoryNo: '',
                            productPrice: 0,
                        });
                        setFilteredEditMiddleCategories([]);
                        setFilteredEditLowCategories([]);
                    })
                    .catch(error => {
                        console.error('업데이트 실패:', error);
                        window.showToast('상품 수정에 실패했습니다. 다시 시도해주세요.', 'error');
                    });
            }
        });

    }

    // 🟠 상품 수정 취소
    const handleCancelEdit = () => {
        setIsEditMode(null); // 수정 모드 종료
        setEditableProduct({}); // 수정된 데이터 초기화
    };

    // 🟠 대분류 변경 시 중분류 목록 가져오기
    const handleFilterTopCategoryChangeForEdit = (e) => {
        const selectedTopCategoryNo = parseInt(e.target.value);
        setEditableProduct(prev => ({
            ...prev,
            topCategoryNo: selectedTopCategoryNo,
            middleCategoryNo: '',
            lowCategoryNo: '',
            categoryNo: '',
        }));

        if (selectedTopCategoryNo) {
            const filteredMiddle = getFilteredCategories(2, selectedTopCategoryNo);
            setFilteredEditMiddleCategories(filteredMiddle);
            setFilteredEditLowCategories([]);
        } else {
            setFilteredEditMiddleCategories([]);
            setFilteredEditLowCategories([]);
        }
    };

    // 🟠 중분류 변경 시 소분류 목록 가져오기
    const handleFilterMiddleCategoryChangeForEdit = (e) => {
        const selectedMiddleCategoryNo = parseInt(e.target.value);
        setEditableProduct(prev => ({
            ...prev,
            middleCategoryNo: selectedMiddleCategoryNo,
            lowCategoryNo: '',
            categoryNo: '',
        }));

        if (selectedMiddleCategoryNo) {
            const filteredLow = getFilteredCategories(3, selectedMiddleCategoryNo);
            setFilteredEditLowCategories(filteredLow);
        } else {
            setFilteredEditLowCategories([]);
        }
    };

    // 🟠 소분류 변경 시 categoryNo 설정
    const handleFilterLowCategoryChangeForEdit = (e) => {
        const selectedLowCategoryNo = parseInt(e.target.value);
        setEditableProduct(prev => ({
            ...prev,
            lowCategoryNo: selectedLowCategoryNo,
            categoryNo: selectedLowCategoryNo, // 최종 선택된 카테고리 번호 설정
        }));
    };

    // ⚪ 상품 전체 선택/해제
    const handleAllSelectProducts = (checked) => {
        if (checked) {
            const allProductCds = products
                .filter(product => product.productDeleteYn === 'N')
                .map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    useEffect(() => {
        setSelectedProducts([]);

        const allSelectCheckbox = document.getElementById('all-select_checkbox');
        if (allSelectCheckbox) {
            allSelectCheckbox.checked = false;
        }
    }, [currentPage, filteredProducts]);

    // ⚪ 상품 개별 선택/해제
    const handleSelectProduct = (productCd) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productCd)) {
                return prevSelected.filter(cd => cd !== productCd);
            } else {
                return [...prevSelected, productCd];
            }
        });
    };

    // ⚪ 모달 상품 상세정보
    const [productDetail, setProductDetail] = useState([]);

    useEffect(() => {
        if (selectedProductCd) {
            axios.get(`/api/products/productDetail/${selectedProductCd}`)
                .then(response => setProductDetail(response.data))
                .catch(error => console.error('상세 정보 조회 실패', error));
        }
    }, [selectedProductCd]);

    // ⚪ 모달 열기
    const handleOpenModal = (productCd) => {
        setSelectedProductCd(productCd);
        setIsModalOpen(true);
    };

    // ⚪ 모달 닫기
    const handleCloseModal = () => {
        setSelectedProductCd(null);
        setIsModalOpen(false);
    };

    // 🟣 상품 삭제 함수
    const handleDeleteSelected = (productCd = null) => {
        let productsToDelete = [];

        if (productCd) {
            productsToDelete = [productCd];
        } else if (selectedProducts && selectedProducts.length > 0) {
            productsToDelete = selectedProducts;
        } else {
            window.showToast('삭제할 상품을 선택해주세요.');
            return;
        }

        window.confirmCustom("해당 항목을 삭제하시겠습니까?").then(result => {
            if (result) {
                axios.post('/api/products/delete', selectedProducts.length > 0 ? selectedProducts : productsToDelete, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        window.showToast('상품이 삭제되었습니다.');
                        fetchProducts();
                        setSelectedProducts([]);
                    })
                    .catch(error => {
                        console.error('상품 삭제 실패:', error);
                        window.showToast('상품 삭제에 실패했습니다. 다시 시도해주세요.', 'error');
                    });
            }
        });
        
    };

    // 🟣 상품 복원 함수
    const handleRestore = (productCd = null) => {
        let productsToRestore = [];

        if (productCd) {
            productsToRestore = [productCd];
        } else if (selectedProducts.length > 0) {
            productsToRestore = selectedProducts;
        } else {
            window.showToast('복원할 상품을 선택해주세요.');
            return;
        }

        window.confirmCustom("해당 항목을 복원하시겠습니까?").then(result => {
            if (result) {
                axios.put('/api/products/restore', productsToRestore, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        window.showToast('상품이 복원되었습니다.');
                        fetchProducts();
                        setSelectedProducts([]);
                    })
                    .catch(error => {
                        console.error('상품 복원 실패:', error);
                        window.showToast('상품 복원에 실패했습니다. 다시 시도해주세요.', 'error');
                    });
            }
        });
    };

    // ⚪ 입력 필드의 변경 함수
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        if (isEditMode && editableProduct[name] !== value) {
            setEditableProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (isAddMode && newProductData[name] !== value) {
            setNewProductData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }, [isEditMode, isAddMode, editableProduct, newProductData]);



    // Add Mode 중분류 필터링
    const addFilteredMiddleCategories = useMemo(() => {
        if (selectedTopCategory) {
            return addMiddleCategories;
        }
        return [];
    }, [selectedTopCategory, addMiddleCategories]);

    // Add Mode 소분류 필터링
    const addFilteredLowCategories = useMemo(() => {
        if (selectedMiddleCategory) {
            return addLowCategories;
        }
        return [];
    }, [selectedMiddleCategory, addLowCategories]);


    return {

        // 조회
        isLoading,
        paginationNumbers,
        handlePreviousPageGroup,
        handleNextPageGroup,
        products,
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        handleSort,
        sortColumn,
        sortDirection,
        filterLowCategory,
        filterMiddleCategory,
        filterTopCategory,
        handleFilterLowCategoryChange,
        handleFilterMiddleCategoryChange,
        handleFilterTopCategoryChange,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
        handlePageInputChange,

        // 등록
        isAddMode,
        setIsAddMode,
        handleCancelAdd,
        newProductData,
        handleAddNewProduct,
        addMiddleCategories,
        addLowCategories,
        handleAddMiddleCategoryChange,
        handleAddTopCategoryChange,
        addFilteredMiddleCategories,
        addFilteredLowCategories,


        // 수정
        isEditMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleCancelEdit,
        filteredEditMiddleCategories,
        filteredEditLowCategories,
        handleFilterTopCategoryChangeForEdit,
        handleFilterMiddleCategoryChangeForEdit,
        handleFilterLowCategoryChangeForEdit,

        // 삭제 / 복원
        handleDeleteSelected,
        handleRestore,

        // 기타
        handleInputChange,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        productDetail,
        selectedProductCd,



        selectedLowCategory,
        selectedMiddleCategory,
        selectedTopCategory,
        lowCategories,
        middleCategories,
        topCategories,
        handleLowCategoryChange,

        handleStatusChange,
        selectedStatus,


        pageInputValue,
    };
}
