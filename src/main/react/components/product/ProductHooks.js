import {useEffect, useMemo, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useHooksList = () => {


    const [products, setProducts] = useState([]);     // 상품 목록 저장 state
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록 state
    const [filteredProducts, setFilteredProducts] = useState([]); // 필터링된 상품 목록

    const [isAdding, setIsAdding] = useState(false); // 상품 등록시 한 줄 추가
    const [newProductData, setNewProductData] = useState({
        productCd: '',
        productNm: '',
        categoryNo: null,
    });

    // 상품 수정 state
    const [editMode, setEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({});

    // 원본 카테고리 목록 상태
    const [fullMiddleCategories, setFullMiddleCategories] = useState([]);
    const [fullLowCategories, setFullLowCategories] = useState([]);

    // 카테고리 (필터) state
    const [filterTopCategory, setFilterTopCategory] = useState('');
    const [filterMiddleCategory, setFilterMiddleCategory] = useState('');
    const [filterLowCategory, setFilterLowCategory] = useState('');

    // 등록 카테고리 state
    const [selectedLowCategory, setSelectedLowCategory] = useState('');
    const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
    const [selectedTopCategory, setSelectedTopCategory] = useState('');

    // 카테고리 목록 상태
    const [topCategories, setTopCategories] = useState([]);
    const [middleCategories, setMiddleCategories] = useState([]);
    const [lowCategories, setLowCategories] = useState([]);

    // 페이지
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수
    const [totalItems, setTotalItems] = useState(0); // 총 아이템 수

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

    // 상품 목록과 카테고리 목록을 서버에서 받아오는 함수
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
                setFullMiddleCategories(response.data.middleCategories || []);
                setFullLowCategories(response.data.lowCategories || []);
            })
            .catch((error) => console.error('전체 상품 목록 조회 실패', error));

    }, [currentPage, itemsPerPage, filterTopCategory, filterMiddleCategory, filterLowCategory]);

    useEffect(() => {
        filterProducts();
    }, [products, filterTopCategory, filterMiddleCategory, filterLowCategory]);

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

        if (filterTopCategory) {
            filtered = filtered.filter(product => String(product.topCategoryNo) === String(filterTopCategory));
        }

        if (filterMiddleCategory) {
            filtered = filtered.filter(product => String(product.middleCategoryNo) === String(filterMiddleCategory));
        }

        if (filterLowCategory) {
            filtered = filtered.filter(product => String(product.lowCategoryNo) === String(filterLowCategory));
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
                setProducts([...products, response.data]);
                setIsAdding(false);
            })
            .catch(error => console.error('상품 추가 실패:', error.response.data));
    };

    // 등록 모드 취소 버튼 클릭 시 처리할 함수
    const handleCancelAdd = () => {
        setIsAdding(false); // 추가 행 숨기기
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
        setEditMode(product.productCd); // 수정할 상품의 코드 저장
        setEditableProduct(product); // 수정할 상품의 데이터 저장
    };

    // 상품 수정 확인
    const handleConfirmClick = () => {
        // 사용자에게 확인 메시지를 보여줍니다.
        const isConfirmed = window.confirm('상품을 수정하시겠습니까?');

        // 사용자가 취소를 누르면 아무 작업도 하지 않습니다.
        if (!isConfirmed) {
            return;
        }

        const updatedProduct = {
            productCd: editableProduct.productCd,
            productNm: editableProduct.productNm,
            categoryNo: editableProduct.categoryNo
        };

        axios.put('/api/products/update', updatedProduct, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('업데이트 성공:', response.data);
                // 수정 성공 메시지 표시
                alert('상품이 수정되었습니다.');
                setEditMode(null); // 수정 모드 종료
                setProducts(products.map(p => p.productCd === response.data.productCd ? response.data : p));
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

    // 카테고리 필터링 (검색)dd

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
        const selectedTopCategoryNo = e.target.value;
        setFilterTopCategory(selectedTopCategoryNo);
        setFilterMiddleCategory('');
        setFilterLowCategory('');
        setCurrentPage(1);
    };

    // 중분류 변경시
    const handleFilterMiddleCategoryChange = (e) => {
        const selectedMiddle = e.target.value;
        console.log('선택된 중분류:', selectedMiddle);
        setFilterMiddleCategory(selectedMiddle);
        setFilterLowCategory('');
        setCurrentPage(1);

        const selectedMiddleCategory = fullMiddleCategories.find(cat => String(cat.categoryNo) === String(selectedMiddle));

        if (selectedMiddleCategory) {
            const relatedTopCategoryNo = selectedMiddleCategory.parentCategoryNo;

            // 대분류 자동 설정
            setFilterTopCategory(relatedTopCategoryNo);
        }

    };

    useEffect(() => {
        if (filterMiddleCategory) {
            console.log('선택된 중분류:', filterMiddleCategory);
        }
    }, [filterMiddleCategory]);

    // 소분류 변경시
    const handleFilterLowCategoryChange = (e) => {
        const selectedLow = e.target.value;
        setFilterLowCategory(selectedLow);
        setCurrentPage(1);

        // 중분류 및 대분류 자동 설정
        const selectedLowCategory = fullLowCategories.find(
            cat => String(cat.categoryNo) === String(selectedLow)
        );

        if (selectedLowCategory) {
            const relatedMiddle = String(selectedLowCategory.parentCategoryNo);
            setFilterMiddleCategory(relatedMiddle);

            const selectedMiddleCategory = fullMiddleCategories.find(
                cat => String(cat.categoryNo) === relatedMiddle
            );

            if (selectedMiddleCategory) {
                const relatedTop = String(selectedMiddleCategory.parentCategoryNo);
                setFilterTopCategory(relatedTop);
            }
        }
    };

    // 상품 목록에서 카테고리 이름 표시
    const getCategoryNameByNo = (categoryNo) => {
        const category = [...topCategories, ...fullMiddleCategories, ...fullLowCategories].find(
            cat => String(cat.categoryNo) === String(categoryNo)
        );
        return category ? category.categoryNm : '';
    };


    // 카테고리 필터링(등록)
    const topCategoriesRegister = [...new Set(products.map(product => product.topCategory))];
    const middleCategoriesRegister = [...new Set(products
        .filter(product => product.topCategory === selectedTopCategory || !selectedTopCategory)
        .map(product => product.middleCategory))];
    const lowCategoriesRegister = [...new Set(products
        .filter(product => product.middleCategory === selectedMiddleCategory || !selectedMiddleCategory)
        .map(product => product.lowCategory))];


    // 소분류 선택 시 중분류 및 대분류를 고정하는 함수
    const handleLowCategoryChange = (e, isEditing = false) => {
        const selectedLow = e.target.value;
        setSelectedLowCategory(selectedLow);

        const relatedMiddle = products.find(product => product.lowCategory === selectedLow)?.middleCategory || '';
        const relatedTop = products.find(product => product.lowCategory === selectedLow)?.topCategory || '';
        const relatedCategoryNo = products.find(product => product.lowCategory === selectedLow)?.categoryNo || null;

        setSelectedMiddleCategory(relatedMiddle);
        setSelectedTopCategory(relatedTop);

        if (isEditing) {
            // 수정 모드
            setEditableProduct((prevProduct) => ({
                ...prevProduct,
                lowCategory: selectedLow,
                middleCategory: relatedMiddle,
                topCategory: relatedTop,
                categoryNo: relatedCategoryNo
            }));
        } else {
            // 등록 모드
            setNewProductData((prevData) => ({
                ...prevData,
                categoryNo: relatedCategoryNo
            }));
        }
    };

    // 중분류 선택 시 해당 중분류에 따른 대분류 설정
    const handleMiddleCategoryChange = (e, isEditing = false) => {
        const selectedMiddle = e.target.value;
        setSelectedMiddleCategory(selectedMiddle);

        const relatedTop = products.find(product => product.middleCategory === selectedMiddle)?.topCategory || '';
        const relatedCategoryNo = products.find(product => product.middleCategory === selectedMiddle)?.categoryNo || null;

        setSelectedTopCategory(relatedTop);

        if (isEditing) {
            // 수정 모드
            setEditableProduct((prevProduct) => ({
                ...prevProduct,
                middleCategory: selectedMiddle,
                topCategory: relatedTop,
                categoryNo: relatedCategoryNo
            }));
        } else {
            // 등록 모드
            setNewProductData((prevData) => ({
                ...prevData,
                categoryNo: relatedCategoryNo
            }));
        }
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
        lowCategoriesRegister,
        filteredMiddleCategories,
        filteredLowCategories,
        middleCategoriesRegister,
        topCategoriesRegister,
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
    };
};