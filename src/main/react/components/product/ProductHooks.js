import {useCallback, useEffect, useMemo, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useProductHooks = () => {

    // 🟢 조회

    // [1] 상품 state
    const [products, setProducts] = useState([]);     // 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록
    const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 목록

    // [2] 카테고리 state
    const [topCategories, setTopCategories] = useState([]); // 대분류 목록
    const [middleCategories, setMiddleCategories] = useState([]); // 중분류 목록
    const [lowCategories, setLowCategories] = useState([]); // 소분류 목록
    
    const [filterTopCategory, setFilterTopCategory] = useState(''); // 대분류 필터링
    const [filterMiddleCategory, setFilterMiddleCategory] = useState(''); // 중분류 필터링
    const [filterLowCategory, setFilterLowCategory] = useState(''); // 소분류 필터링


  

    const [filteredEditMiddleCategories, setFilteredEditMiddleCategories] = useState([]); // Edit 모드용 카테고리
    const [filteredEditLowCategories, setFilteredEditLowCategories] = useState([])

    // [3] 검색 state
    const [searchTerm, setSearchTerm] = useState('');

    // 정렬 state
    const [sortColumn, setSortColumn] = useState('productCd'); // 정렬할 컬럼
    const [sortDirection, setSortDirection] = useState('asc'); // 정렬 방향

    // 🟡 Add Mode state
    const [isAddMode, setIsAddMode] = useState(false);
    
    // 🟡 상품 state
    const [newProductData, setNewProductData] = useState({
        productCd: '',
        productNm: '',
        categoryNo: null,
        productPrice: '',
    });

    // 🟡 카테고리 state
    const [selectedLowCategory, setSelectedLowCategory] = useState('');
    const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
    const [selectedTopCategory, setSelectedTopCategory] = useState('');

    const [addMiddleCategories, setAddMiddleCategories] = useState([]); // Adding 모드용 카테고리
    const [addLowCategories, setAddLowCategories] = useState([]);


    // 3️⃣ Update

    //  상품 state
    const [isEditMode, setIsEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({
        productCd: '',
        productNm: '',
        categoryNo: '',
        topCategoryNo: '',
        middleCategoryNo: '',
        lowCategoryNo: '',
    });


    // 4️⃣ 페이지 state
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지 당 아이템 수
    const [totalItems, setTotalItems] = useState(0); // 총 상품 수
    const [pageInputValue, setPageInputValue] = useState(1);


    // 5️⃣ 모달 state

    const [isLoading, setLoading] = useState(true); // 로딩 상태 관리

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductCd, setSelectedProductCd] = useState(null); // 선택된 상품 코드

    // 모달 열기
    const handleOpenModal = (productCd) => {
        setSelectedProductCd(productCd);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setSelectedProductCd(null);
        setIsModalOpen(false);
    };

    const [selectedStatus, setSelectedStatus] = useState("active"); // 상태

    // 🟢 조회
    useEffect(() => {
        setLoading(true);
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

                console.log('받아온 데이터:', response.data);

                // 상품 데이터가 있을 경우에만 map 함수 호출
                const productsWithCategoryNames = (response.data.content || []).map(product => ({
                    ...product,
                    topCategory: product.topCategory,
                    middleCategory: product.middleCategory,
                    lowCategory: product.lowCategory,
                    productPrice: product.productPrice,
                }));

                // 상품 목록 및 필터링된 상품 목록 업데이트
                setProducts(productsWithCategoryNames);
                setFilteredProducts(productsWithCategoryNames);

                // 페이지 정보 업데이트
                setTotalItems(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
                setLoading(false);

            })
            .catch((error) => {
                console.error('전체 상품 목록 조회 실패', error);
                setLoading(false);
            });
    }, [sortColumn, sortDirection, currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory, selectedStatus, searchTerm]);

    // 카테고리 조회 useEffect
    useEffect(() => {
        setLoading(true);

        // 대분류 API 호출
        axios.get('/api/category/top')
            .then((response) => {
                setTopCategories(response.data);          // 대분류 목록
            })
            .catch((error) => console.error('대분류 조회 실패', error));

        // 대분류 선택 시 중분류 API 호출
        if (filterTopCategory) {
            axios.get(`/api/category/middle/${filterTopCategory}`)
                .then((response) => {
                    setMiddleCategories(response.data);  // 중분류 데이터 설정
                    setFilterMiddleCategory('');        // 중분류 초기화
                })
                .catch((error) => console.error('중분류 조회 실패', error));
        } else {
            setMiddleCategories([]);  // 중분류 선택이 없을 경우 빈 배열로 초기화
        }

        setLoading(false);
    }, [filterTopCategory]);

    // 중분류 변경 시 소분류 API 호출
    useEffect(() => {
        if (filterTopCategory && filterMiddleCategory) {
            axios.get(`/api/category/low/${filterMiddleCategory}/${filterTopCategory}/`)
                .then((response) => {
                    setLowCategories(response.data);  // 소분류 데이터 설정
                })
                .catch((error) => console.error('소분류 조회 실패', error));
        } else {
            setLowCategories([]);  // 소분류 선택이 없을 경우 빈 배열로 초기화
        }
    }, [filterMiddleCategory, filterTopCategory]);

    // 대분류 변경
    const handleFilterTopCategoryChange = (e) => {
        setFilterTopCategory(e.target.value);
        setFilterMiddleCategory('');
        setFilterLowCategory('');
        setCurrentPage(1);
    };

    // 중분류 변경
    const handleFilterMiddleCategoryChange = (e) => {
        setFilterMiddleCategory(e.target.value);
        setFilterLowCategory('');
        setCurrentPage(1);
    };

    // 소분류 변경
    const handleFilterLowCategoryChange = (e) => {
        setFilterLowCategory(e.target.value);
        setCurrentPage(1);
    };

    // 상품 필터링 함수
    const filterProducts = () => {
        let filtered = products;

        // 카테고리 필터링
        if (filterTopCategory) {
            filtered = filtered.filter(product => product.topCategoryNo === parseInt(filterTopCategory));
        }
        if (filterMiddleCategory) {
            filtered = filtered.filter(product => product.middleCategoryNo === parseInt(filterMiddleCategory));
        }
        if (filterLowCategory) {
            filtered = filtered.filter(product => product.lowCategoryNo === parseInt(filterLowCategory));
        }

        // 검색어 필터링 (상품명 또는 상품코드)
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.productNm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productCd.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    // 필터링된 상품 목록 업데이트
    useEffect(() => {
        filterProducts();
    }, [filterTopCategory, filterMiddleCategory, filterLowCategory, products, searchTerm]);


    // 상품 상세 데이터 (모달)
    const [productDetail, setProductDetail] = useState([]);

    useEffect(() => {
        if (selectedProductCd) {
            axios.get(`/api/products/productDetail/${selectedProductCd}`)
                .then(response => setProductDetail(response.data))
                .catch(error => console.error('상세 정보 조회 실패', error));
        }
    }, [selectedProductCd]);

    // 상품 전체 선택
    const handleAllSelectProducts = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    // ⚪ 정렬 함수
    const handleSort = (column) => {
        let mappedColumn = column;
        switch(column){
            case 'productCd':
                mappedColumn = 'productCd';
                break;
            case 'productNm':
                mappedColumn = 'productNm';
                break;
            case 'topCategory':
                mappedColumn = 'topCategory';
                break;
            case 'middleCategory':
                mappedColumn = 'middleCategory';
                break;
            case 'lowCategory':
                mappedColumn = 'lowCategory';
                break;
            case 'productPrice':
                mappedColumn = 'productPrice';
                break;
            case 'productInsertDate':
                mappedColumn = 'productInsertDate';
                break;
            case 'productUpdateDate':
                mappedColumn = 'productUpdateDate';
                break;
            case 'productDeleteDate':
                mappedColumn = 'productDeleteDate';
                break;
            default:
                break;
        }

        if (sortColumn === mappedColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(mappedColumn);
            setSortDirection('asc');
        }
    };

    // 상품 개별 선택
    const handleSelectProduct = (productCd) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productCd)) {
                return prevSelected.filter(cd => cd !== productCd);
            } else {
                return [...prevSelected, productCd];
            }
        });
    };

    // 🟡 등록
    const handleAddNewProduct = () => {

        if (!newProductData.productCd || !newProductData.productNm || !newProductData.productPrice) {
            alert('품번, 상품명, 가격을 모두 입력해주세요.');
            return;
        }

        axios.post('/api/products/add', newProductData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert('상품이 성공적으로 등록되었습니다.');
                fetchProducts(); // 상품 등록 후 상품 목록 다시 불러오기

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

            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert('이미 존재하는 상품 코드입니다. 다른 코드를 입력해주세요.');
                } else {
                    console.error('상품 추가 실패:', error.response?.data || error.message);
                }
            });
    };

    // 🟡 Add Mode 취소 버튼 클릭
    const handleCancelAdd = () => {
        setIsAddMode(false);

        setSelectedTopCategory('');
        setSelectedMiddleCategory('');
        setSelectedLowCategory('');

        setNewProductData({
            productCd: '',
            productNm: '',
            categoryNo: null,
            productPrice: '',
        });
    };


    // 입력 필드의 변경을 처리하는 함수
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

    // 페이지 입력 필드의 변경을 처리하는 함수
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


    // 상품 수정
    const handleEditClick = (product) => {
        setIsEditMode(product.productCd);

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

        // 대분류가 있을 경우 중분류 목록 불러오기
        if (product.topCategoryNo) {
            axios.get(`/api/category/middle/${product.topCategoryNo}`)
                .then(response => {
                    setFilteredEditMiddleCategories(response.data);

                    // 중분류가 있을 경우 소분류 목록 불러오기
                    if (product.middleCategoryNo) {
                        axios.get(`/api/category/low/${product.middleCategoryNo}/${product.topCategoryNo}`)
                            .then(response => {
                                setFilteredEditLowCategories(response.data);
                            })
                            .catch(error => console.error('소분류 목록 조회 실패', error));
                    }
                })
                .catch(error => console.error('중분류 목록 조회 실패', error));
        }
    };

    // 상품 수정 확인
    const handleConfirmClick = () => {
        const isConfirmed = window.confirm('상품을 수정하시겠습니까?');

        if (!isConfirmed) {
            return;
        }

        const updatedProduct = {
            productCd: editableProduct.productCd,
            productNm: editableProduct.productNm,
            categoryNo: editableProduct.categoryNo ? Number(editableProduct.categoryNo) : null,
            productPrice: editableProduct.productPrice,
        };

        console.log('수정할 상품:', updatedProduct)

        axios.put('/api/products/update', updatedProduct, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('업데이트 성공:', response.data);
                alert('상품이 수정되었습니다.');

                // 상품 목록 불러오기
                axios.get('/api/products/productList', {
                    params: {
                        page: currentPage,
                        size: itemsPerPage,
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
                        const productsWithCategoryNames = response.data.content.map(product => ({
                            ...product,
                            topCategory: product.topCategory,
                            middleCategory: product.middleCategory,
                            lowCategory: product.lowCategory,
                            productPrice: product.productPrice,
                        }));
                        setProducts(productsWithCategoryNames);
                        setFilteredProducts(productsWithCategoryNames);
                        setTotalItems(response.data.totalElements || 0);
                        setTotalPages(response.data.totalPages || 0);
                        setLoading(false);
                    })
                    .catch((error) => console.error('상품 목록 갱신 실패', error));

                setIsEditMode(null);
                setEditableProduct({});
            })
            .catch(error => console.error('업데이트 실패:', error));
    };

    // 수정 모드 취소 시 원래 상태로 돌아가도록 하는 함수
    const handleCancelEdit = () => {
        setIsEditMode(null); // 수정 모드 종료
        setEditableProduct({}); // 수정된 데이터 초기화
    };

    // 상품 삭제 함수
    const handleDeleteSelected = (productCd = null) => {
        if (!productCd && selectedProducts.length === 0) {
            alert('삭제할 상품을 선택해주세요.');
            return;
        }
        if (!window.confirm('정말 삭제하시겠습니까?')) {
            return;
        }

        const productsToDelete = productCd ? [productCd] : selectedProducts;

        axios.delete('/api/products/delete', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: productsToDelete
        })
            .then(response => {
                alert('상품이 삭제되었습니다.');
                fetchProducts();
                setSelectedProducts([]); // 선택된 상품 초기화
            })
            .catch(error => {
                console.error('상품 삭제 실패:', error);
            });
    };

    const handleRestore = (productCd = null) => {

        if (!productCd && selectedProducts.length === 0) {
            alert('복원할 상품을 선택해주세요.');
            return;
        }

        if (!window.confirm(('정말 복원하시겠습니까?'))) {
            return;
        }

        const productsToRestore = productCd ? [productCd] : selectedProducts;

        axios.put('/api/products/restore', productsToRestore, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert('상품이 복원되었습니다.');
                fetchProducts();
                setSelectedProducts([]);
            })
            .catch(error => {
                console.error('상품 복원 실패', error)
            })
    }

    // 🟢 상품 재조회
    const fetchProducts = () => {
        axios.get('/api/products/productList', {
            params: {
                page: currentPage,
                size: itemsPerPage,
                topCategoryNo: filterTopCategory || null,
                middleCategoryNo: filterMiddleCategory || null,
                lowCategoryNo: filterLowCategory || null,
                status: selectedStatus,
                productNm: searchTerm || null,
                productCd: searchTerm || null,
                sortColumn,
                sortDirection,
            },
        })
            .then((response) => {
                const productsWithCategoryNames = response.data.content.map(product => ({
                    ...product,
                    topCategory: product.topCategory,
                    middleCategory: product.middleCategory,
                    lowCategory: product.lowCategory,
                    productDeleteYn: product.productDeleteDate ? 'Y' : 'N',
                    productPrice: product.productPrice,
                }));
                setProducts(productsWithCategoryNames);
                setFilteredProducts(productsWithCategoryNames);
                setTotalItems(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
                setLoading(false);
            })
            .catch((error) => console.error('상품 목록 조회 실패', error));
    };

    // 🟢 상태 변경
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.id);
        setCurrentPage(1);
    };

    // 카테고리 필터링된 중분류 목록
    const filteredMiddleCategories = useMemo(() => {
        if (filterTopCategory) {
            return middleCategories.filter(cat => String(cat.parentCategoryNo) === String(filterTopCategory));
        }
        return middleCategories;
    }, [filterTopCategory, middleCategories]);

    // 카테고리 필터링된 소분류 목록
    const filteredLowCategories = useMemo(() => {
        if (filterMiddleCategory) {
            return lowCategories.filter(cat => String(cat.parentCategoryNo) === String(filterMiddleCategory));
        }
        return lowCategories;
    }, [lowCategories, filterMiddleCategory]);

    // 🟡 대분류 변경 시 중분류 목록 가져오기
    const handleAddTopCategoryChange = (e) => {
        const selectedTop = e.target.value;
        setSelectedTopCategory(selectedTop);
        setSelectedMiddleCategory('');
        setSelectedLowCategory('');

        if (selectedTop) {
            axios.get(`/api/category/middle/${selectedTop}`)
                .then((response) => {
                    setAddMiddleCategories(response.data); // Add Mode 중분류 목록 업데이트
                })
                .catch((error) => {
                    console.error('Add Mode: 중분류 목록 조회 실패', error);
                });
        } else {
            setAddMiddleCategories([]);
        }
    }


    // 🟡 중분류 변경 시 소분류 목록 가져오기
    const handleAddMiddleCategoryChange = (e) => {
        const selectedMiddle = e.target.value;
        setSelectedMiddleCategory(selectedMiddle);
        setSelectedLowCategory('');

        if (selectedMiddle) {
            axios.get(`/api/category/low/${selectedMiddle}/${selectedTopCategory}/`)
                .then((response) => {
                    setAddLowCategories(response.data); // Add Mode 용 소분류 목록 업데이트
                })
                .catch((error) => {
                    console.error('Add Mode: 소분류 목록 조회 실패', error);
                });
        } else {
            setAddLowCategories([]);
        }
    }

    // 소분류 선택 시
    const handleLowCategoryChange = (e) => {
        const selectedLow = e.target.value;
        setSelectedLowCategory(selectedLow);

        setNewProductData(prevData => ({
            ...prevData,
            categoryNo: selectedLow !== '' ? Number(selectedLow) : null  // 소분류 선택시 categoryNo 설정
        }));
    }

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





    // 카테고리 필터링 (수정)

    const handleFilterTopCategoryChangeForEdit = (e) => {
        const selectedTopCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            topCategoryNo: selectedTopCategoryNo,
            middleCategoryNo: '',
            lowCategoryNo: '',
            categoryNo: '',
        }));

        axios.get(`/api/category/middle/${selectedTopCategoryNo}`)
            .then(response => {
                setFilteredEditMiddleCategories(response.data);
                setFilteredEditLowCategories([]);
            })
            .catch(error => console.error('중분류 목록 조회 실패', error));
    };

    const handleFilterMiddleCategoryChangeForEdit = (e) => {
        const selectedMiddleCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            middleCategoryNo: selectedMiddleCategoryNo,
            lowCategoryNo: '',
            categoryNo: '',
        }));

        axios.get(`/api/category/low/${selectedMiddleCategoryNo}/${editableProduct.topCategoryNo}`)
            .then(response => {
                setFilteredEditLowCategories(response.data); //
            })
            .catch(error => console.error('소분류 목록 조회 실패', error));
    };

    const handleFilterLowCategoryChangeForEdit = (e) => {
        const selectedLowCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            lowCategoryNo: selectedLowCategoryNo,
            categoryNo: selectedLowCategoryNo, // 최종 선택된 카테고리 번호 설정
        }));
    };

    // 페이지 변경
    const handlePageChange = (pageNumber) => {
        const newPage = Math.min(pageNumber, totalPages);
        setCurrentPage(newPage);
    };

    // 페이지당 항목 수 변경
    const handleItemsPerPageChange = (e) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue < 1) {
            alert('페이지당 항목 수는 최소 1 이상이어야 합니다.');
            setItemsPerPage(10); // 기본값으로 설정
        } else {
            setItemsPerPage(parsedValue);
        }
        setCurrentPage(1);
    };

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

    return {
        products,
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        isAddMode,
        setIsAddMode,
        newProductData,
        handleAddNewProduct,
        handleInputChange,
        handleCancelAdd,
        isEditMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleCancelEdit,
        handleDeleteSelected,
        filterLowCategory,
        filterMiddleCategory,
        filterTopCategory,
        filteredMiddleCategories,
        filteredLowCategories,
        handleFilterLowCategoryChange,
        handleFilterMiddleCategoryChange,
        handleFilterTopCategoryChange,
        selectedLowCategory,
        selectedMiddleCategory,
        selectedTopCategory,
        lowCategories,
        middleCategories,
        topCategories,
        handleLowCategoryChange,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        handlePageChange,
        handleItemsPerPageChange,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        productDetail,
        selectedProductCd,
        paginationNumbers,
        handlePreviousPageGroup,
        handleNextPageGroup,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        addFilteredMiddleCategories,
        addFilteredLowCategories,
        filteredEditMiddleCategories,
        filteredEditLowCategories,
        handleFilterTopCategoryChangeForEdit,
        handleFilterMiddleCategoryChangeForEdit,
        handleFilterLowCategoryChangeForEdit,
        handleStatusChange,
        selectedStatus,
        isLoading,
        handleRestore,
        handlePageInputChange,
        handleSort,
        sortColumn,
        sortDirection,
        addMiddleCategories,
        addLowCategories,
        handleAddMiddleCategoryChange,
        handleAddTopCategoryChange,
        pageInputValue,
    };
}
