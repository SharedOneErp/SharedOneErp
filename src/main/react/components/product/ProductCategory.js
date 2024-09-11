import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductCategory.css'; // 개별 CSS 스타일 적용
import { formatDate } from "../../util/dateUtils";

// 컴포넌트
function ProductCategory() {

    const [category, setCategory] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]); // 선택된 카테고리
    const [selectedTopCategory, setSelectedTopCategory] = useState('');
    const [selectedMidCategory, setSelectedMidCategory] = useState('');
    const [categoryLevel, setCategoryLevel] = useState('대분류'); // 카테고리 레벨 (대분류/중분류/소분류)
    const [insertTop, setInsertTop] = useState('');//대분류 추가
    const [insertMid, setInsertMid] = useState('');//중분류 추가
    const [insertLow, setInsertLow] = useState('');//소분류 추가
    const [insertedList, setInsertedList] = useState([]);

    useEffect(() => {
        fetch('/api/category/all')
            .then(response => response.json())
            .then(data => setCategory(data))
            .catch(error => console.error('카테고리 목록을 불러오는 데 실패했습니다.', error))
    }, []);

    // 상품 목록 저장 state
    const [products, setProducts] = useState([]); // 전체 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 체크된 상품 목록



    // 전체 선택
    const handleAllSelectCategory = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    // 상품 선택
    const handleSelectCategory = (categoryNo) => {
        setSelectedProducts(prevSelected => {
            if (prevSelected.includes(categoryNo)) {
                return prevSelected.filter(cd => cd !== categoryNo);
            } else {
                const newSelectedCategory = [...prevSelected, categoryNo];
                console.log('선택된 카테고리', newSelectedCategory);
                return newSelectedCategory;
            }
        });
    };

    //대분류 추가 함수
    const handleInsertTop = (e) => {
        setInsertTop(e.target.value);
    }

    //대분류 추가 버튼
    const handleAddButton = () => {
        if (!insertTop) {
            alert('대분류 값을 입력하세요');
            return;
        }

        fetch('/api/category/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryNm: insertTop,
                categoryLevel: 1
            }),
        })
            .then(response => response.json())
            .then(data => {
                setInsertedList([...insertedList, data]);
                setInsertTop('');
            })
            .catch(error => console.error('카테고리 추가 실패:', error));

            alert('대분류 카테고리가 추가되었습니다.')
    };



    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <div className="top-container">
                <h2>상품 카테고리 관리</h2>
            </div>

            <div className="middle-container">
                <form className="search-box-container">
                    <div style={{ marginBottom: "10px" }}>
                        <span style={{ marginRight: "5px" }}>카테고리 </span>

                    </div>

                    <div>

                        <input type="text" className="search-box" placeholder="대분류 카테고리명을 입력하세요"
                            onChange={handleInsertTop}
                        />
                        <button type='submit' className="search-button" onClick={handleAddButton}>등록</button>
                        <br />
                        <select>
                            <option>대분류1</option>
                            <option>대분류2</option>
                        </select>
                        <input type="text" className="search-box" placeholder="중분류 카테고리명을 입력하세요" />
                        <button type="submit" className="search-button">등록</button>
                        <br />
                        <select>
                            <option>대분류1</option>
                            <option>대분류2</option>
                        </select>
                        <select>
                            <option>중분류1</option>
                            <option>중분류2</option>
                        </select>
                        <input type="text" className="search-box" placeholder="소분류 카테고리명을 입력하세요" />
                        <button type="submit" className="search-button">등록</button>
                    </div>
                </form>
            </div>
            <div className="bottom-container">
                {/* <label>
                    <p>전체 {products.length}건 페이지 당:</p>
                    <select>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label> */}
                <table className="approval-list">
                    <thead>
                        <tr className='table-tr'>
                            <th><input type="checkbox"
                                onChange={(e) => handleAllSelectCategory(e.target.checked)} /></th>
                            <th>카테고리 번호</th>
                            <th>카테고리 레벨</th>
                            <th>상위 카테고리</th>
                            <th>카테고리 이름</th>
                            <th>카테고리 등록일시</th>
                            <th>카테고리 수정일시</th>
                        </tr>
                    </thead>
                    <tbody className="approval-list-content">
                        {category.map((category, index) => (
                            <tr key={category.categoryNo}
                                className={selectedCategory.includes(category.categoryNo) ? 'selected' : ''}>
                                <td><input type="checkbox"
                                    onChange={() => handleSelectCategory(category.categoryNo)}
                                    checked={selectedCategory.includes(category.categoryNo)} /></td>
                                <td>{category.categoryNo}</td>
                                <td>{category.categoryLevel}</td>
                                <td>{category.parentCategoryNo ? category.parentCategoryNo : 'ㆍ'}</td>
                                <td>{category.categoryNm}</td>
                                <td>{formatDate(category.categoryInsertDate)}</td>
                                <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : 'ㆍ'}</td>
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
                    <button className="filter-button">수정</button>
                    <button className="filter-button" >삭제</button>
                </div>

            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);