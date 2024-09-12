import {useEffect, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useHooksList = () => {

    // 현재 시간 포맷팅
    const formatDateForLocalDateTime = (date) => {
        return date.toISOString().slice(0, 23);
    };


    const [products, setProducts] = useState([]);     // 상품 목록 저장 state
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록 state

    const [isAdding, setIsAdding] = useState(false); // 상품 등록시 한 줄 추가
    const [newProductData, setNewProductData] = useState({
        productCd: '',
        productNm: '',
        topCategory: '',
        middleCategory: '',
        lowCategory: '',
        productInsertDate: null,
        productUpdateDate: null
    });

    // 상품 수정 state
    const [editMode, setEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({});

    // 검색 카테고리 state
    const [filterTopCategory, setFilterTopCategory] = useState('');
    const [filterMiddleCategory, setFilterMiddleCategory] = useState('');
    const [filterLowCategory, setFilterLowCategory] = useState('');

    // 등록 카테고리 state
    const [selectedLowCategory, setSelectedLowCategory] = useState('');
    const [selectedMiddleCategory, setSelectedMiddleCategory] = useState('');
    const [selectedTopCategory, setSelectedTopCategory] = useState('');

    // 상품 목록을 서버에서 받아오는 함수
    useEffect(() => {
        axios.get('/api/products/productList')
            .then(response => setProducts(response.data))
            .catch(error => console.error('전체 상품 목록 조회 실패', error));
    }, [])

    // 상품 전체선택
    const handleAllSelectProducts = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
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
        const currentDateTime = formatDateForLocalDateTime(new Date());

        const newProduct = {
            ...newProductData,
            productInsertDate: currentDateTime,
            productUpdateDate: currentDateTime
        };
        console.log(newProduct)

        axios.post('/api/products/add', newProduct, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setProducts([...products, response.data]);
                setIsAdding(false); // 추가 상태 종료
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
        axios.put('/api/products/update', {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                console.log('업데이트 성공:', response.data);
                confirm('상품을 수정하시겠습니까?');
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


    // 카테고리 필터링 (검색)
    const handleFilterLowCategoryChange = (e) => {
        const selectedLow = e.target.value;
        setFilterLowCategory(selectedLow);

        const relatedMiddle = products.find(product => product.lowCategory === selectedLow)?.middleCategory || '';
        const relatedTop = products.find(product => product.lowCategory === selectedLow)?.topCategory || '';

        setFilterMiddleCategory(relatedMiddle);
        setFilterTopCategory(relatedTop);
    };

    const handleFilterMiddleCategoryChange = (e) => {
        const selectedMiddle = e.target.value;
        setFilterMiddleCategory(selectedMiddle);

        const relatedTop = products.find(product => product.middleCategory === selectedMiddle)?.topCategory || '';
        setFilterTopCategory(relatedTop);
    };

    // 카테고리 필터링(등록)
    const topCategories = [...new Set(products.map(product => product.topCategory))];
    const middleCategories = [...new Set(products
        .filter(product => product.topCategory === selectedTopCategory || !selectedTopCategory)
        .map(product => product.middleCategory))];
    const lowCategories = [...new Set(products
        .filter(product => product.middleCategory === selectedMiddleCategory || !selectedMiddleCategory)
        .map(product => product.lowCategory))];

    // 소분류 선택 시 해당 소분류에 따른 중분류 및 대분류 설정
    const handleLowCategoryChange = (e, isEditing = false) => {
        const selectedLow = e.target.value;
        setSelectedLowCategory(selectedLow);

        const relatedMiddle = products.find(product => product.lowCategory === selectedLow)?.middleCategory || '';
        const relatedTop = products.find(product => product.lowCategory === selectedLow)?.topCategory || '';

        setSelectedMiddleCategory(relatedMiddle);
        setSelectedTopCategory(relatedTop);

        if (isEditing) {
            // 수정
            setEditableProduct((prevProduct) => ({
                ...prevProduct,
                lowCategory: selectedLow,
                middleCategory: relatedMiddle,
                topCategory: relatedTop,
            }));
        } else {
            // 등록
            setNewProductData((prevData) => ({
                ...prevData,
                lowCategory: selectedLow,
                middleCategory: relatedMiddle,
                topCategory: relatedTop,
            }));
        }
    };

    // 중분류 선택 시 해당 중분류에 따른 대분류 설정
    const handleMiddleCategoryChange = (e, isEditing = false) => {
        const selectedMiddle = e.target.value;
        setSelectedMiddleCategory(selectedMiddle);

        const relatedTop = products.find(product => product.middleCategory === selectedMiddle)?.topCategory || '';
        setSelectedTopCategory(relatedTop);

        if (isEditing) {
            // 수정
            setEditableProduct((prevProduct) => ({
                ...prevProduct,
                middleCategory: selectedMiddle,
                topCategory: relatedTop,
            }));
        } else {
            // 등록
            setNewProductData((prevData) => ({
                ...prevData,
                middleCategory: selectedMiddle,
                topCategory: relatedTop,
            }));
        }
    };

    return {
        formatDateForLocalDateTime,
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
        setFilterLowCategory,
        setFilterMiddleCategory,
        setFilterTopCategory,
        handleFilterLowCategoryChange,
        handleFilterMiddleCategoryChange,
        selectedLowCategory,
        selectedMiddleCategory,
        selectedTopCategory,
        lowCategories,
        middleCategories,
        topCategories,
        handleLowCategoryChange,
        handleMiddleCategoryChange
    };
};