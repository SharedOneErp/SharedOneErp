import {useEffect, useState} from "react";
import {formatDate} from '../../util/dateUtils';
import axios from 'axios';

export const useHooksList = () => {

    const [products, setProducts] = useState([]);     // 상품 목록 저장 state
    const [selectedProducts, setSelectedProducts] = useState([]); // 선택된 상품 목록 state

    // 상품 수정 state
    const [editMode, setEditMode] = useState(null);
    const [editableProduct, setEditableProduct] = useState({});

    // 상품 목록을 서버에서 받아오는 함수
    useEffect(() => {
        axios.get('/api/products/productList')
            .then(response => setProducts(response.data))
            .catch(error => console.error('전체 상품 목록 조회 실패', error));
    }, []);

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

    // 상품 수정
    const handleEditClick = (product) => {
        setEditMode(product.productCd); // 수정할 상품의 코드 저장
        setEditableProduct(product); // 수정할 상품의 데이터 저장
    };

    // 상품 수정 확인
    const handleConfirmClick = () => {
        axios.put(`http://localhost:8787/api/products/update`, {
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

    return {
        products,
        selectedProducts,
        handleAllSelectProducts,
        handleSelectProduct,
        editMode,
        editableProduct,
        handleEditClick,
        handleConfirmClick,
        handleDeleteSelected
    };
};