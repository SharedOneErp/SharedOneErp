import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductList.css';

function ProductList() {
    // 상품 목록 저장 state
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // 상품 수정 state
    const [editMode, setEditMode] = useState(null); // 수정 중인 상품 코드 저장
    const [editableProduct, setEditableProduct] = useState({}); // 수정 중인 상품의 임시 데이터 저장

    useEffect(() => {
        fetch('/api/products/productList')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('전체 상품 목록 조회 실패', error));
    }, []);

    const handleEditClick = (product) => {
        setEditMode(product.productCd); // 수정할 상품의 코드 저장
        setEditableProduct(product); // 수정할 상품의 데이터 저장
    };

    const handleConfirmClick = () => {
        console.log('업데이트 데이터:', JSON.stringify(editableProduct));
        fetch(`http://localhost:8787/api/products/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editableProduct)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                console.log('업데이트 성공:', data);
                confirm('상품을 수정하시겠습니까?');
                setEditMode(null); // 수정 모드 종료
                setProducts(products.map(p => p.productCd === data.productCd ? data : p));
            })
            .catch(error => console.error('업데이트 실패:', error));
    };

    const handleAllSelectProducts = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableProduct({ ...editableProduct, [name]: value });
    };

    const handleSelectProduct = (productCd) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(productCd)) {
                return prevSelected.filter(cd => cd !== productCd);
            } else {
                return [...prevSelected, productCd];
            }
        });
    };

    const handleDeleteSelected = () => {
        if (selectedProducts.length === 0) {
            alert('삭제할 상품을 선택해주세요.');
            return;
        }
        if (!confirm('상품을 정말 삭제하시겠습니까?')) {
            return;
        }
        fetch('http://localhost:8787/api/products/productDelete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(selectedProducts)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('상품 삭제 실패');
                }
                alert('상품이 삭제되었습니다.');
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setSelectedProducts([]);
            })
            .catch(error => console.error(error));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const [selectedTopCategory, setSeletedTopCategory] = useState('');
    const [selectedMiddleCategory, setSeletedMiddleCategory] = useState('');

    const topCategories = [...new Set(products.map(product => product.topCategory))];
    const middleCategories = [...new Set(products
        .filter(product => product.topCategory === selectedTopCategory)
        .map(product => product.middleCategory))];
    const lowCategories = [...new Set(products
        .filter(product => product.middleCategory === selectedMiddleCategory)
        .map(product => product.lowCategory))];

    return (
        <Layout currentMenu="productList">
            <div className="top-container">
                <h2>전체 상품 목록</h2>
            </div>
            <div className="middle-container">
                <form className="search-box-container">
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "5px" }}>카테고리 </span>
                        <select className="approval-select" onChange={e => setSeletedTopCategory(e.target.value)}>
                            <option>대분류</option>
                            {topCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <select className="approval-select" onChange={e => setSeletedMiddleCategory(e.target.value)}>
                            <option>중분류</option>
                            {middleCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <select className="approval-select">
                            <option>소분류</option>
                            {lowCategories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select className="approval-select">
                            <option>상품명</option>
                            <option>상품번호</option>
                        </select>
                        <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                        <button type="submit" className="search-button">검색</button>
                    </div>
                </form>
            </div>
            <div className="bottom-container">
                <label>
                    <p>전체 {products.length}건 페이지 당:</p>
                    <select>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>
                <table className="approval-list">
                    <thead>
                    <tr>
                        <th><input type="checkbox" onChange={(e) => handleAllSelectProducts(e.target.checked)} /></th>
                        <th>상품번호</th>
                        <th>상품명</th>
                        <th>대분류</th>
                        <th>중분류</th>
                        <th>소분류</th>
                        <th>상품 등록일</th>
                        <th>상품 수정일</th>
                        <th>상세</th>
                        <th>수정</th>
                    </tr>
                    </thead>
                    <tbody className="approval-list-content">
                    {products.map((product, index) => (
                        <tr key={product.productCd}
                            className={`${selectedProducts.includes(product.productCd) ? 'selected' : ''} ${editMode === product.productCd ? 'edit-mode-active' : ''}`}>
                            <td><input type="checkbox" onChange={() => handleSelectProduct(product.productCd)} checked={selectedProducts.includes(product.productCd)} /></td>
                            <td>{product.productCd}</td>
                            <td>
                                {editMode === product.productCd ? (
                                    <input type="text" name="productNm" value={editableProduct.productNm} onChange={handleInputChange} />
                                ) : (
                                    product.productNm
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="topCategory" value={editableProduct.topCategory} onChange={handleInputChange}>
                                        {topCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.topCategory
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="middleCategory" value={editableProduct.middleCategory} onChange={handleInputChange}>
                                        {middleCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.middleCategory
                                )}
                            </td>
                            <td>
                                {editMode === product.productCd ? (
                                    <select name="lowCategory" value={editableProduct.lowCategory} onChange={handleInputChange}>
                                        {lowCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                ) : (
                                    product.lowCategory
                                )}
                            </td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td>{formatDate(product.productInsertDate)}</td>
                            <td><a href={`/productDetail?no=${product.productCd}`}>상세</a></td>
                            <td>
                                {editMode === product.productCd ? (
                                    <button className="product-confirm-button" onClick={handleConfirmClick}>확인</button>
                                ) : (
                                    <button className="product-edit-button" onClick={() => handleEditClick(product)}>수정</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div>
                <div className="button-container">
                    <button className="filter-button" onClick={handleDeleteSelected}>삭제</button>
                    <button className="filter-button" onClick={() => window.location.href = '/product'}>등록</button>
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter><ProductList /></BrowserRouter>);
