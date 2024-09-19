import {useEffect, useMemo, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useHooksList = () => {

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
    const [editMode, setEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({
        productCd: '',
        productNm: '',
        categoryNo: '',
        topCategoryNo: '',
        middleCategoryNo: '',
        lowCategoryNo: '',
    });


    // 4. 페이지 state
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수
    const [totalItems, setTotalItems] = useState(0); // 총 아이템 수


    // 5. 모달 state


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

    // useEffect (productList)
    useEffect(() => {
        axios
            .get('/api/products/productList', {
                params: {
                    page: currentPage,
                    size: itemsPerPage,
                    topCategoryNo: filterTopCategory || null, // 대분류 필터
                    middleCategoryNo: filterMiddleCategory || null, // 중분류 필터
                    lowCategoryNo: filterLowCategory || null, // 소분류 필터
                },
            })
            .then((response) => {
                const productsWithCategoryNames = response.data.products.map(product => ({
                    ...product,
                    topCategory: product.topCategoryNo,
                    middleCategory: product.middleCategoryNo,
                    lowCategory: product.lowCategoryNo,
                }));
                setProducts(productsWithCategoryNames);
                setFilteredProducts(productsWithCategoryNames);
                setTotalItems(response.data.totalItems || 0);
                setTopCategories(response.data.topCategories || []);
                setFullTopCategories(response.data.topCategories || []);
                setFullMiddleCategories(response.data.middleCategories || []);
                setFullLowCategories(response.data.lowCategories || []);
            })
            .catch((error) => console.error('전체 상품 목록 조회 실패', error));

    }, [currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory]);

    useEffect(() => {
        filterProducts();
    }, [products, filterTopCategory, filterMiddleCategory, filterLowCategory, searchTerm]);

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

    // 필터링된 상품 목록 조회
    const filterProducts = () => {
        let filtered = products;

        // 카테고리 필터링
        if (filterTopCategory) {
            filtered = filtered.filter(product => String(product.topCategoryNo) === String(filterTopCategory));
        }
        if (filterMiddleCategory) {
            filtered = filtered.filter(product => String(product.middleCategoryNo) === String(filterMiddleCategory));
        }
        if (filterLowCategory) {
            filtered = filtered.filter(product => String(product.lowCategoryNo) === String(filterLowCategory));
        }

        // 검색어 필터링 (상품명 또는 상품번호)
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.productNm.includes(searchTerm) || product.productCd.includes(searchTerm)
            );
        }

        setFilteredProducts(filtered);
    };

    // 상품 개별선택
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
                    },
                })
                    .then((response) => {
                        const productsWithCategoryNames = response.data.products.map(product => ({
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
        if (editMode) {
            // 수정 모드
            setEditableProduct({...editableProduct, [name]: value});
        } else if (isAdding) {
            // 추가 모드
            setNewProductData({...newProductData, [name]: value});
        }
    };

    // 상품 수정
    const handleEditClick = (product) => {
        setEditMode(product.productCd);
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
                    },
                })
                    .then((response) => {
                        const productsWithCategoryNames = response.data.products.map(product => ({
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

                setEditMode(null);
                setEditableProduct({});
            })
            .catch(error => console.error('업데이트 실패:', error));
    };

    // 수정 모드 취소 시 원래 상태로 돌아가도록 하는 함수
    const handleCancelEdit = () => {
        setEditMode(null); // 수정 모드 종료
        setEditableProduct({}); // 수정된 데이터 초기화
    };

    // 선택 상품 삭제
    const handleDeleteSelected = () => {
        if (selectedProducts.length === 0) {
            alert('삭제할 상품을 선택해주세요.');
            return;
        }
        if (!window.confirm('상품을 정말 삭제하시겠습니까?')) {
            return;
        }
        axios.delete('/api/products/productDelete', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: selectedProducts
        })
            .then(response => {
                alert('상품이 삭제되었습니다.');
                setProducts(response.data);
                setSelectedProducts([]);
            })
            .catch(error => console.error('상품 삭제 실패:', error));
    };

    useEffect(() => {
        // 대분류로 변경될 때 중분류와 소분류 초기화
        if (filterTopCategory === '') {
            setMiddleCategories(fullMiddleCategories);
            setLowCategories(fullLowCategories);
        }
    }, [filterTopCategory, fullMiddleCategories, fullLowCategories]);

    // // 카테고리 번호로 이름 찾기
    // const categoryNoToNameMap = useMemo(() => {
    //     const map = {};
    //     [...topCategories, ...fullMiddleCategories, ...fullLowCategories].forEach(category => {
    //         map[String(category.categoryNo)] = category.categoryNm;
    //     });
    //     return map;
    // }, [topCategories, fullMiddleCategories, fullLowCategories]);
    //
    // // 카테고리 이름으로 번호 찾기
    // const categoryNameToNoMap = useMemo(() => {
    //     const map = {};
    //     [...topCategories, ...fullMiddleCategories, ...fullLowCategories].forEach(category => {
    //         map[category.categoryNm] = String(category.categoryNo);
    //     });
    //     return map;
    // }, [topCategories, fullMiddleCategories, fullLowCategories]);

    // 카테고리 필터링 (검색)

    // 필터링된 중분류 목록
    const filteredMiddleCategories = useMemo(() => {
        if (filterTopCategory) {
            const parentCategoryNo = filterTopCategory;
            return fullMiddleCategories.filter(cat => String(cat.parentCategoryNo) === String(parentCategoryNo));
        }
        return fullMiddleCategories;
    }, [filterTopCategory, fullMiddleCategories]);

    // 필터링된 소분류 목록
    const filteredLowCategories = useMemo(() => {
        if (filterMiddleCategory) {
            const parentCategoryNo = filterMiddleCategory;
            return fullLowCategories.filter(cat => String(cat.parentCategoryNo) === String(parentCategoryNo));
        } else if (filterTopCategory) {
            const parentCategoryNo = filterTopCategory;
            const middleCategoriesUnderTop = fullMiddleCategories.filter(cat => String(cat.parentCategoryNo) === String(parentCategoryNo));
            const middleCategoryNos = middleCategoriesUnderTop.map(cat => cat.categoryNo);
            return fullLowCategories.filter(cat => middleCategoryNos.includes(cat.parentCategoryNo));
        }
        return fullLowCategories;
    }, [filterTopCategory, filterMiddleCategory, fullLowCategories, fullMiddleCategories]);

    // 대분류 변경시
    const handleFilterTopCategoryChange = (e) => {
        const selectedTop = e.target.value;
        setFilterTopCategory(selectedTop);
        setFilterMiddleCategory('');
        setFilterLowCategory('');
        setCurrentPage(1);
    };

    // 중분류 변경시
    const handleFilterMiddleCategoryChange = (e) => {
        const selectedMiddle = e.target.value;
        setFilterMiddleCategory(selectedMiddle);
        setFilterLowCategory('');
        setCurrentPage(1);

        const selectedMiddleCategory = fullMiddleCategories.find(cat => String(cat.categoryNo) === String(selectedMiddle));

        if (selectedMiddleCategory) {
            const relatedTopCategoryNo = selectedMiddleCategory.parentCategoryNo;

            // // 대분류 자동 설정
            // setFilterTopCategory(relatedTopCategoryNo);
        }

    };

    // 소분류 변경시
    const handleFilterLowCategoryChange = (e) => {
        const selectedLow = e.target.value;
        setFilterLowCategory(selectedLow);
        setCurrentPage(1);

        // 중분류 및 대분류 자동 설정
        const selectedLowCategory = fullLowCategories.find(
            cat => String(cat.categoryNo) === String(selectedLow)
        );

        // if (selectedLowCategory) {
        //     const relatedMiddle = String(selectedLowCategory.parentCategoryNo);
        //     setFilterMiddleCategory(relatedMiddle);
        //
        //     const selectedMiddleCategory = fullMiddleCategories.find(
        //         cat => String(cat.categoryNo) === relatedMiddle
        //     );
        //
        //     if (selectedMiddleCategory) {
        //         const relatedTop = String(selectedMiddleCategory.parentCategoryNo);
        //         setFilterTopCategory(relatedTop);
        //     }
        // }
    };

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
        setCurrentPage(pageNumber);
    };

    // 페이지당 항목 수 변경
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // 페이지당 항목 수를 변경하면 첫 페이지로 이동
    };

    // 총 페이지 수 계산
    const totalPages = totalItems > 0 && itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

    const paginationNumbers = useMemo(() => {
        const maxPagesToShow = 5;
        const currentPageGroup = Math.floor((currentPage - 1) / maxPagesToShow);
        const startPage = currentPageGroup * maxPagesToShow + 1;
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        return [...Array(endPage - startPage + 1)].map((_, i) => startPage + i);
    }, [currentPage, totalPages]);

    const handlePreviousPageGroup = () => {
        if (currentPage > 1) {
            setCurrentPage(Math.max(1, paginationNumbers[0] - 1));
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
            editMode,
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
            handleFilterLowCategoryChangeForEdit
        };
    }
