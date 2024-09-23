import {useEffect, useMemo, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useProductHooks = () => {

    // 1. Read

    // [1] 상품 state
    const [products, setProducts] = useState([]);     // 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록
    const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 목록

    // [2] 카테고리 state
    const [fullTopCategories, setFullTopCategories] = useState([]); // 대분류 전체 목록
    const [fullMiddleCategories, setFullMiddleCategories] = useState([]); // 중분류 전체 목록
    const [fullLowCategories, setFullLowCategories] = useState([]); // 소분류 전체 목록

    const [filterTopCategory, setFilterTopCategory] = useState(''); // 대분류 필터링
    const [filterMiddleCategory, setFilterMiddleCategory] = useState(''); // 중분류 필터링
    const [filterLowCategory, setFilterLowCategory] = useState(''); // 소분류 필터링

    const [topCategories, setTopCategories] = useState([]); // 대분류 상태
    const [middleCategories, setMiddleCategories] = useState([]); // 중분류 상태
    const [lowCategories, setLowCategories] = useState([]); // 소분류 상태

    // [3] 검색 state
    const [searchTerm, setSearchTerm] = useState('');

    // [4] 정렬 state
    const [sortColumn, setSortColumn] = useState('productCd'); // 정렬할 컬럼
    const [sortDirection, setSortDirection] = useState('asc'); // 정렬 방향


    // 2. Create

    // [1] 상품 state
    const [isAdding, setIsAdding] = useState(false);
    const [newProductData, setNewProductData] = useState({
        productCd: '',
        productNm: '',
        categoryNo: null,
    });

    // [2] 카테고리 state
    const [selectedLowCategory, setSelectedLowCategory] = useState('');
    const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
    const [selectedTopCategory, setSelectedTopCategory] = useState('');


    // 3. Update

    // [1] 상품 state
    const [isEditMode, setIsEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({
        productCd: '',
        productNm: '',
        categoryNo: '',
        topCategoryNo: '',
        middleCategoryNo: '',
        lowCategoryNo: '',
    });


    // 4. 페이지 state
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지 당 아이템 수
    const [totalItems, setTotalItems] = useState(0); // 총 상품 수


    // 5. 모달 state

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

    // useEffect (productList)
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
                },
            })
            .then((response) => {
                console.log('데이터:', response.data)

                // 상품 데이터가 있을 경우에만 map 함수 호출
                const productsWithCategoryNames = (response.data.content || []).map(product => ({
                    ...product,
                    topCategory: product.topCategoryNo,
                    middleCategory: product.middleCategoryNo,
                    lowCategory: product.lowCategoryNo,
                }));

                // 상품 목록 및 필터링된 상품 목록 업데이트
                setProducts(productsWithCategoryNames);
                setFilteredProducts(productsWithCategoryNames);

                // // 카테고리 데이터 처리 (카테고리 데이터가 없을 경우 빈 배열로 처리)
                // const uniqueTopCategories = Array.from(new Set((response.data.topCategories || []).map(cat => cat.categoryNm)));
                // setTopCategories(uniqueTopCategories);
                // setFullTopCategories(response.data.topCategories || []);
                // setFullMiddleCategories(response.data.middleCategories || []);
                // setFullLowCategories(response.data.lowCategories || []);

                // 페이지 정보 업데이트
                setTotalItems(response.data.totalItems || 0);
                setTotalPages(response.data.totalPages || 0);
                setLoading(false);


            })
            .catch((error) => {
                console.error('전체 상품 목록 조회 실패', error);
                setLoading(false);
            });
    }, [sortColumn, sortDirection, currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory, selectedStatus]);

    // // 상품 목록 조회
    // useEffect(() => {
    //     setLoading(true);
    //     axios
    //         .get('/api/products/productList', {
    //             params: {
    //                 page: currentPage - 1,
    //                 size: itemsPerPage,
    //                 topCategoryNo: filterTopCategory || null,
    //                 middleCategoryNo: filterMiddleCategory || null,
    //                 lowCategoryNo: filterLowCategory || null,
    //                 status: selectedStatus,
    //                 sortColumn,
    //                 sortDirection,
    //             },
    //         })
    //         .then((response) => {
    //             console.log(response.data)
    //             const pageData = response.data;
    //             setProducts(pageData.content || []);
    //             setTotalItems(pageData.totalElements || 0);
    //             setTotalPages(pageData.totalPages || 0);
    //             setLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error('상품 목록 조회 실패', error);
    //             setLoading(false);
    //         });
    // }, [sortColumn, sortDirection, currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory, selectedStatus]);

    useEffect(() => {
        filterProducts();
    }, [products, filterTopCategory, filterMiddleCategory, filterLowCategory, searchTerm]);

    // 카테고리 조회 useEffect
    useEffect(() => {
        setLoading(true);

        // 대분류 API 호출
        axios.get('/api/category/top')
            .then((response) => {
                setFullTopCategories(response.data);      // 전체 대분류 목록
                setTopCategories(response.data);          // 대분류 필터 목록
                console.log('대분류 데이터:', response.data);
            })
            .catch((error) => console.error('대분류 조회 실패', error));

        // 대분류 선택 시 중분류 API 호출
        if (filterTopCategory) {
            axios.get(`/api/category/middle/${filterTopCategory}`)
                .then((response) => {
                    setMiddleCategories(response.data);  // 중분류 데이터 설정
                    setFilterMiddleCategory('');        // 중분류 초기화
                    console.log('중분류 조회:', response.data);
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
                    console.log('소분류 조회:', response.data);
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

        if (filterTopCategory) {
            filtered = filtered.filter(product => product.topCategoryNo === parseInt(filterTopCategory));
        }

        if (filterMiddleCategory) {
            filtered = filtered.filter(product => product.middleCategoryNo === parseInt(filterMiddleCategory));
        }

        if (filterLowCategory) {
            filtered = filtered.filter(product => product.lowCategoryNo === parseInt(filterLowCategory));
        }

        setFilteredProducts(filtered);
    };

    // 필터링된 상품 목록 업데이트
    useEffect(() => {
        filterProducts();
    }, [filterTopCategory, filterMiddleCategory, filterLowCategory, products]);


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

    // // 필터링된 상품 목록 조회
    // const filterProducts = () => {
    //     let filtered = products;
    //
    //     // 카테고리 필터링
    //     if (filterTopCategory) {
    //         filtered = filtered.filter(product => String(product.topCategoryNo) === String(filterTopCategory));
    //     }
    //     if (filterMiddleCategory) {
    //         filtered = filtered.filter(product => String(product.middleCategoryNo) === String(filterMiddleCategory));
    //     }
    //     if (filterLowCategory) {
    //         filtered = filtered.filter(product => String(product.lowCategoryNo) === String(filterLowCategory));
    //     }
    //
    //     // 검색어 필터링 (상품명 또는 상품번호)
    //     if (searchTerm) {
    //         filtered = filtered.filter(product =>
    //             product.productNm.includes(searchTerm) || product.productCd.includes(searchTerm)
    //         );
    //     }
    //
    //     setFilteredProducts(filtered);
    // };

    // 정렬 함수
    const handleSort = (column) => {
        let mappedColumn = column;
        switch(column){
            case 'topCategory':
                mappedColumn = 'topCategoryNo';
                break;
            case 'middleCategory':
                mappedColumn = 'middleCategoryNo';
                break;
            case 'lowCategory':
                mappedColumn = 'lowCategoryNo';
                break;
            // 필요에 따라 다른 컬럼도 매핑
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
    //
    // // 정렬된 데이터를 서버에서 가져오기
    // useEffect(() => {
    //     const fetchSortedProducts  = () => {
    //         axios
    //             .get('/api/products/sort', {
    //                 params: {
    //                     sortColumn,
    //                     sortDirection,
    //                     page: currentPage, // 페이지 번호
    //                     size: itemsPerPage, // 페이지 당 아이템 수
    //                 },
    //             })
    //             .then((response) => {
    //                 console.log(`정렬 컬럼: ${sortColumn}, 방향: ${sortDirection}`);
    //                 if (response.data && response.data.products) {
    //                     const sortedProductsWithCategoryNames = response.data.products.map(product => ({
    //                         ...product,
    //                         topCategory: product.topCategory,
    //                         middleCategory: product.middleCategory,
    //                         lowCategory: product.lowCategory,
    //                     }));
    //
    //                     console.log(sortedProductsWithCategoryNames);
    //
    //                     setFilteredProducts(sortedProductsWithCategoryNames);
    //                     setTotalItems(response.data.totalItems || 0);
    //                 } else {
    //                     console.error('서버에서 상품 목록 받아오기 실패');
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('정렬 상품 목록 조회 실패', error);
    //             })
    //             .finally(() => {
    //                 setLoading(false);
    //             });
    //     };
    //
    //     if (sortColumn) {
    //         fetchSortedProducts();
    //     }
    // }, [sortColumn, sortDirection, currentPage, itemsPerPage]);

    // useEffect(() => {
    //     let sortedProducts = [...filteredProducts]; // 필터링된 데이터 복사
    //
    //     if (sortColumn) {
    //         sortedProducts.sort((a, b) => {
    //             let aValue = a[sortColumn];
    //             let bValue = b[sortColumn];
    //
    //             if (sortColumn.includes('Date')) {
    //                 aValue =new Date(aValue);
    //                 bValue = new Date(bValue);
    //             }
    //
    //             if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    //             if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    //             return 0;
    //         });
    //     }
    //     setFilteredProducts(sortedProducts); // 정렬된 데이터로 업데이트
    // }, [sortColumn, sortDirection, filteredProducts]); // 정렬 관련 상태가 변경될 때마다 정렬 재적용

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

    // 등록 버튼 클릭 시 처리할 함수
    const handleAddNewProduct = () => {
        if (!newProductData.productCd || !newProductData.productNm) {
            alert('상품 코드와 상품명을 입력해주세요.');
            return;
        }

        // 필요한 데이터만 추출하여 전송
        const cleanedProductData = {
            productCd: newProductData.productCd,
            productNm: newProductData.productNm,
            categoryNo: newProductData.categoryNo
        };

        console.log(cleanedProductData);

        axios.post('/api/products/add', cleanedProductData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                alert('상품이 성공적으로 등록되었습니다.');

                // 상품 등록 후 상품 목록을 다시 불러오기
                axios.get('/api/products/productList', {
                    params: {
                        page: currentPage,
                        size: itemsPerPage,
                        topCategoryNo: filterTopCategory || null,
                        middleCategoryNo: filterMiddleCategory || null,
                        lowCategoryNo: filterLowCategory || null,
                        status: selectedStatus,
                    },
                })
                    .then((response) => {
                        const productsWithCategoryNames = response.data.content.map(product => ({
                            ...product,
                            topCategory: product.topCategoryNo,
                            middleCategory: product.middleCategoryNo,
                            lowCategory: product.lowCategoryNo,
                        }));
                        setProducts(productsWithCategoryNames);
                        setFilteredProducts(productsWithCategoryNames);
                        setTotalItems(response.data.totalItems || 0);
                    })
                    .catch((error) => console.error('상품 목록 갱신 실패', error));

                // 등록 상태 초기화 및 입력 데이터 초기화
                setIsAdding(false);
                setNewProductData({
                    productCd: '',
                    productNm: '',
                    categoryNo: null,
                });
                setSelectedTopCategory('');
                setSelectedMiddleCategory('');
                setSelectedLowCategory('');

            })
            .catch(error => console.error('상품 추가 실패:', error.response.data));
    };

    // 등록 모드 취소 버튼 클릭 시 처리할 함수
    const handleCancelAdd = () => {
        setIsAdding(false);

        setSelectedTopCategory('');
        setSelectedMiddleCategory('');
        setSelectedLowCategory('');

        setNewProductData({
            productCd: '',
            productNm: '',
            categoryNo: null,
        });
    };

    // 입력 필드의 변경을 처리하는 함수
    const handleInputChange = (e) => {
        const {name, value} = e.target;

       if (isEditMode) {
            // 수정 모드
            setEditableProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (isAdding) {
            // 등록 모드
            setNewProductData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // 페이지 입력 필드의 변경을 처리하는 함수
    const handlePageInputChange = (e) => {
        const value = e.target.value;
        const page = !isNaN(value) && value > 0 ? Number(value) : 1;
        setCurrentPage(page);
    }

    // 상품 수정
    const handleEditClick = (product) => {
        setIsEditMode(product.productCd);
        setEditableProduct({
            productCd: product.productCd,
            productNm: product.productNm,
            categoryNo: product.categoryNo || '',
            topCategoryNo: product.topCategoryNo || '',
            middleCategoryNo: product.middleCategoryNo || '',
            lowCategoryNo: product.lowCategoryNo || '',
        });
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
            categoryNo: editableProduct.categoryNo ? Number(editableProduct.categoryNo) : null
        };

        console.log(updatedProduct)

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
                    },
                })
                    .then((response) => {
                        const productsWithCategoryNames = response.data.content.map(product => ({
                            ...product,
                            topCategory: product.topCategoryNo,
                            middleCategory: product.middleCategoryNo,
                            lowCategory: product.lowCategoryNo,
                        }));
                        setProducts(productsWithCategoryNames);
                        setFilteredProducts(productsWithCategoryNames);
                        setTotalItems(response.data.totalItems || 0);
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

    const fetchProducts = () => {
        axios.get('/api/products/productList', {
            params: {
                page: currentPage,
                size: itemsPerPage,
                topCategoryNo: filterTopCategory || null,
                middleCategoryNo: filterMiddleCategory || null,
                lowCategoryNo: filterLowCategory || null,
                status: selectedStatus,
            },
        })
            .then((response) => {
                const productsWithCategoryNames = response.data.content.map(product => ({
                    ...product,
                    topCategory: product.topCategoryNo,
                    middleCategory: product.middleCategoryNo,
                    lowCategory: product.lowCategoryNo,
                    productDeleteYn: product.productDeleteDate ? 'Y' : 'N',
                }));
                setProducts(productsWithCategoryNames);
                setFilteredProducts(productsWithCategoryNames);
                setTotalItems(response.data.totalItems || 0);
                setLoading(false);
            })
            .catch((error) => console.error('상품 목록 조회 실패', error));
    };

    // 🟢 상태 변경
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.id);
        setCurrentPage(1);
    };

    useEffect(() => {
        // 대분류로 변경될 때 중분류와 소분류 초기화
        if (filterTopCategory === '') {
            setMiddleCategories(fullMiddleCategories);
            setLowCategories(fullLowCategories);
        }
    }, [filterTopCategory, fullMiddleCategories, fullLowCategories]);

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


    // 대분류 변경시
    // const handleFilterTopCategoryChange = (e) => {
    //     const selectedTop = e.target.value;
    //     setFilterTopCategory(selectedTop);
    //     setFilterMiddleCategory('');
    //     setFilterLowCategory('');
    //     setCurrentPage(1);
    // };

    // 중분류 변경시
    // const handleFilterMiddleCategoryChange = (e) => {
    //     const selectedMiddle = e.target.value;
    //     setFilterMiddleCategory(selectedMiddle);
    //     setFilterLowCategory('');
    //     setCurrentPage(1);
    //
    //     const selectedMiddleCategory = fullMiddleCategories.find(cat => String(cat.categoryNo) === String(selectedMiddle));
    //
    //     if (selectedMiddleCategory) {
    //         const relatedTopCategoryNo = selectedMiddleCategory.parentCategoryNo;
    //     }
    //
    // };


    // // 소분류 변경시
    // const handleFilterLowCategoryChange = (e) => {
    //     const selectedLow = e.target.value;
    //     setFilterLowCategory(selectedLow);
    //     setCurrentPage(1);
    //
    //     // 중분류 및 대분류 자동 설정
    //     const selectedLowCategory = fullLowCategories.find(
    //         cat => String(cat.categoryNo) === String(selectedLow)
    //     );
    // };

    // 상품 목록에서 카테고리 이름 표시
    const getCategoryNameByNo = (categoryNo) => {
        if (!categoryNo) {
            return '-';  // 분류가 없는 경우 '-' 출력
        }
        const category = [...topCategories, ...fullMiddleCategories, ...fullLowCategories].find(
            cat => String(cat.categoryNo) === String(categoryNo)
        );
        return category ? category.categoryNm : '-';
    };


    // 카테고리 필터링 (등록)

    // 중분류 필터링 (등록)
    const addFilteredMiddleCategories = useMemo(() => {
        if (selectedTopCategory) {
            return fullMiddleCategories.filter(cat => String(cat.parentCategoryNo) === String(selectedTopCategory));
        }
        return [];
    }, [selectedTopCategory, fullMiddleCategories]);

    // 소분류 필터링 (등록)
    const addFilteredLowCategories = useMemo(() => {
        if (selectedMiddleCategory) {
            return fullLowCategories.filter(cat => String(cat.parentCategoryNo) === String(selectedMiddleCategory));
        }
        return [];
    }, [selectedMiddleCategory, fullLowCategories]);

    // 대분류 선택 시
    const handleTopCategoryChange = (e) => {
        const selectedTop = e.target.value;
        setSelectedTopCategory(selectedTop);
        setSelectedMiddleCategory('');
        setSelectedLowCategory('');
    }

    // 중분류 선택 시
    const handleMiddleCategoryChange = (e) => {
        const selectedMiddle = e.target.value;
        setSelectedMiddleCategory(selectedMiddle);
        setSelectedLowCategory('');
    };

    // 소분류 선택 시
    const handleLowCategoryChange = (e) => {
        const selectedLow = e.target.value;
        setSelectedLowCategory(selectedLow);

        setNewProductData(prevData => ({
            ...prevData,
            categoryNo: selectedLow !== '' ? Number(selectedLow) : null  // 소분류 선택시 categoryNo 설정
        }));
    }

    // 카테고리 필터링 (수정)

    // 중분류 필터링 (수정)
    const filteredEditMiddleCategories = useMemo(() => {
        if (editableProduct.topCategoryNo) {
            return fullMiddleCategories.filter(cat => String(cat.parentCategoryNo) === String(editableProduct.topCategoryNo));
        }
        return [];
    }, [editableProduct.topCategoryNo, fullMiddleCategories]);

    // 소분류 필터링 (수정)
    const filteredEditLowCategories = useMemo(() => {
        if (editableProduct.middleCategoryNo) {
            return fullLowCategories.filter(cat => String(cat.parentCategoryNo) === String(editableProduct.middleCategoryNo));
        }
        return [];
    }, [editableProduct.middleCategoryNo, fullLowCategories]);

    // 대분류 변경시 (수정)
    const handleFilterTopCategoryChangeForEdit = (e) => {
        const selectedTopCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            topCategoryNo: selectedTopCategoryNo,
            middleCategoryNo: '',
            lowCategoryNo: '',
            categoryNo: '',
        }));
    };

    // 중분류 변경시 (수정)
    const handleFilterMiddleCategoryChangeForEdit = (e) => {
        const selectedMiddleCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            middleCategoryNo: selectedMiddleCategoryNo,
            lowCategoryNo: '',
            categoryNo: '',
        }));
    };

    // 소분류 변경시 (수정)
    const handleFilterLowCategoryChangeForEdit = (e) => {
        const selectedLowCategoryNo = e.target.value;
        setEditableProduct(prev => ({
            ...prev,
            lowCategoryNo: selectedLowCategoryNo,
            categoryNo: selectedLowCategoryNo,
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
        const newItemsPerPage = !isNaN(value) && value > 0 ? parseInt(value) : 0;  // 0이 기본값으로 설정됨
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // 총 페이지 수 계산
    // const totalPages = totalItems > 0 && itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

    const paginationNumbers = useMemo(() => {
        const maxPagesToShow = 5;
        const currentPageGroup = Math.floor((currentPage) / maxPagesToShow);
        const startPage = currentPageGroup * maxPagesToShow + 1; // 시작 페이지
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages); // 끝 페이지

        console.log('시작 페이지:', startPage, '끝 페이지:', endPage, '전체 페이지:', totalPages);

        if (totalPages === 0) {
            return [];
        }

        return [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);
    }, [currentPage, totalPages]);

    useEffect(()  => {
        console.log('페이지 넘버:', paginationNumbers);
    }, [paginationNumbers]);

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
        isAdding,
        setIsAdding,
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
        handleMiddleCategoryChange,
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
        getCategoryNameByNo,
        searchTerm,
        setSearchTerm,
        handleTopCategoryChange,
        fullTopCategories,
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
    };
}
