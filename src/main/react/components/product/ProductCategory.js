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
    const [categoryLevel, setCategoryLevel] = useState('대분류'); // 카테고리 레벨 (대분류/중분류/소분류)
    const [insertedTopList, setInsertedTopList] = useState([]);
    const [insertedMidList, setInsertedMidList] = useState([]);
    const [insertedLowList, setInsertedLowList] = useState([]);

    // 모달 관련
    const [showModal, setShowModal] = useState(false);

    //대분류조회  //중분류조회  //소분류조회
    const [getTopCategory, setGetTopCategory] = useState([]);
    const [getMidCategory, setGetMidCategory] = useState([]);
    const [getLowCategory, setGetLowCategory] = useState([]);

    //새로운 카테고리 등록
    const [insertTop, setInsertTop] = useState('');//대분류 추가
    const [insertMid, setInsertMid] = useState('');//중분류 추가
    const [insertLow, setInsertLow] = useState('');//소분류 추가

    //선택된 카테고리 저장
    const [selectedTopCategory, setSelectedTopCategory] = useState(null);
    const [selectedMidCategory, setSelectedMidCategory] = useState(null);

    // 선택 카테고리 호버 저장
    const [hoverTop, setHoverTop] = useState(null);
    const [hoverMid, setHoverMid] = useState(null);
    const [hoverLow, setHoverLow] = useState(null);


    // 전체목록 조회
    useEffect(() => {
        fetch('/api/category/all')
            .then(response => response.json())
            .then(data => setCategory(data))
            .catch(error => console.error('카테고리 목록을 불러오는 데 실패했습니다.', error))
    }, []);

    // 대분류 조회
    useEffect(() => {
        fetch('/api/category/top')
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                const topCategory = Array.isArray(data) ? data : [data];
                setGetTopCategory(topCategory);
            })
            .catch(error => console.error('대분류 목록을 불러오는데 실패했습니다.', error));
    }, []);

    // 중분류 조회
    useEffect(() => {
        if (selectedTopCategory) {
            setGetLowCategory([]);
            fetch(`/api/category/middle/${selectedTopCategory}`)
                .then(response => response.json())
                .then(data => setGetMidCategory(data))
                .catch(error => console.error('중분류 목록을 불러오는데 실패했습니다.', error));
        } else {
            setGetLowCategory([]);
        }
    }, [selectedTopCategory]); //selectedTopCategory가 변경될 때마다 실행

    //소분류 조회
    useEffect(() => {
        if (selectedTopCategory && selectedMidCategory) {

            fetch(`api/category/low/${selectedMidCategory}/${selectedTopCategory}`)
                .then(response => response.json())
                .then(data => setGetLowCategory(data))
                .catch(error => console.error('소분류 목록을 불러오는데 실패했습니다.', error));
        } else {
            setGetLowCategory([]);
        }
    }, [selectedTopCategory , selectedMidCategory]);


    ///////////////////////////////////////////////////////////////////////////////////////////////////

    // 체크표시 state
    const [products, setProducts] = useState([]); // 전체 상품 목록
    const [selectedProducts, setSelectedProducts] = useState([]); // 체크된 상품 목록


    // 전체 선택 체크표시
    const handleAllSelectCategory = (checked) => {
        if (checked) {
            const allProductCds = products.map(product => product.productCd);
            setSelectedProducts(allProductCds);
        } else {
            setSelectedProducts([]);
        }
    };

    // 

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    //대중소분류 추가 함수

    const handleInsert = (e, categoryLevel) => {
        const value = e.target.value; // 3 카테고리를 동시 관리 위함

        if (categoryLevel === 1) {
            setInsertTop(value);
        } else if (categoryLevel === 2) {
            setInsertMid(value);
        } else if (categoryLevel === 3) {
            setInsertLow(value);
        }
    }


    //대분류 추가 버튼
    const handleAddButton = (categoryLevel) => {

        let categoryName = ''; //변경필요 때문 let사용
        let parentCategoryNo = null;

        if (categoryLevel === 1) {
            if (!insertTop) {
                alert('대분류 값을 입력하세요');
                return;
            }
            categoryName = insertTop;

        } else if (categoryLevel === 2) {
            if (!insertMid) {
                alert('중분류 값을 입력하세요');
                return;
            }
            categoryName = insertMid;
            parentCategoryNo = selectedTopCategory;

        } else if (categoryLevel == 3) {
            if (!insertLow) {
                alert('소분류 값을 입력하세요');
                return;
            }
            categoryName = insertLow;
            parentCategoryNo = selectedMidCategory;
        }

        fetch('/api/category/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryNm: categoryName,
                categoryLevel: categoryLevel,
                parentCategoryNo: parentCategoryNo
            }),
        })
            .then(response => response.json())
            .then(data => {
                //카테고리레벨에 따른 리스트 업데이트
                if (categoryLevel === 1) {
                    setGetTopCategory(prevCategory => [...prevCategory, data]);
                    setInsertedTopList([...insertedTopList, data]);
                    setInsertTop('');
                    alert('대분류 카테고리가 추가되었습니다.')
                } else if (categoryLevel === 2) {
                    setGetMidCategory(prevCategory => [...prevCategory, data]);
                    setInsertedMidList([...insertedMidList, data]);
                    setInsertMid('');
                    alert('중분류 카테고리가 추가되었습니다.')
                } else if (categoryLevel === 3) {
                    setGetLowCategory(prevCategory => [...prevCategory, data]);
                    setInsertedLowList([...insertedLowList, data]);
                    setInsertLow('');
                    alert('소분류 카테고리가 추가되었습니다.')
                }
            })
            .catch(error => console.error('카테고리 추가 실패:', error));


    };


    //중분류 추가 버튼
    const handleMidAddButton = () => {
        if (!insertMid) {
            alert('중분류 값을 입력하세요')
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////


    // 모달 열기
    const openModal = () => {
        setShowModal(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // 대분류 li 선택했을 떄
    function handleTopClick(categoryNo) {
        setSelectedTopCategory(categoryNo);
    }
    useEffect(() => {
        if (selectedTopCategory) {
            console.log("선택된 대분류 번호: " + selectedTopCategory);
        }
    }, [selectedTopCategory]);

    // 중분류 li 선택했을 때
    function handleMidClick(categoryNo) {
        setSelectedMidCategory(categoryNo);
    }
    useEffect(() => {
        if (selectedMidCategory) {
            console.log("선택된 중분류 번호:" + selectedMidCategory);
        }
    }, [selectedMidCategory]);


    // 대분류 클릭 hover저장
    function handleHover(categoryNo) {
        setHoverTop(categoryNo);
    }



    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_category">
                <div className="top-container">
                    <h2>상품 카테고리 관리</h2>
                </div>

                <div className="middle-container">
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
                                    <td>{category.categoryLevel === 1 ? "대분류" :
                                        category.categoryLevel === 2 ? "중분류" :
                                            category.categoryLevel === 3 ? "소분류" : "ㆍ"
                                    }</td>
                                    <td>{category.parentCategoryNo ? category.parentCategoryNo : 'ㆍ'}</td>
                                    <td>{category.categoryNm}</td>
                                    <td>{formatDate(category.categoryInsertDate)}</td>
                                    <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : 'ㆍ'}</td>
                                </tr>


                            ))}


                        </tbody>
                    </table>
                    {/* <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div> */}

                    <div className="button-container">
                        <button className="filter-button" onClick={openModal}>등록</button>
                        <button className="filter-button">수정</button>
                        <button className="filter-button" >삭제</button>
                    </div>

                </div>
                {showModal && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <h2>카테고리 등록</h2>
                            <button className='close-button' onClick={closeModal}>X</button>

                            <div className='category-form'>
                                {/* 대분류 */}
                                <div className='category-column'>
                                    <h4>대분류</h4>
                                    <div className='input-button'>
                                        <input type='text' placeholder='대분류 검색' className='input-field' />
                                        <button className='search-button'>검색</button>
                                    </div>
                                    <br />

                                    <div className='list-form'>
                                        <ul className='category-list' >
                                            {getTopCategory.map((category) => (
                                                <li key={category.categoryNo}
                                                    onClick={() => { handleTopClick(category.categoryNo) }}
                                                    onMouseOver={() => { handleHover(category.categoryNo) }}
                                                >
                                                    {category.categoryNm}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className='input-button'>
                                        <input type='text' placeholder='새 대분류 추가' className='input-field' onChange={(e) => { handleInsert(e, 1) }} value={insertTop} />
                                        <button type='submit' className='register-button' onClick={() => { handleAddButton(1) }} >등록</button>
                                    </div>
                                </div>

                                {/* 중분류 */}
                                <div className='category-column'>
                                    <h4>중분류</h4>
                                    <div className='input-button'>
                                        <input type='text' placeholder='중분류 검색' className='input-field' />
                                        <button className='search-button'>검색</button>
                                    </div>
                                    <br />

                                    <div className='list-form' style={{ position: 'relative' }}>
                                        {getMidCategory.length === 0 ? (
                                            <p style={{ position: 'absolute', top: '6%', left: '25%' }}>중분류가없습니다</p>
                                        ) : (
                                            <ul className='category-list'>
                                                {getMidCategory.map((category) => (
                                                    <li key={category.categoryNo}
                                                        onClick={() => handleMidClick(category.categoryNo)}
                                                    >
                                                        {category.categoryNm}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className='input-button'>
                                        <input type='text' placeholder='새 중분류 추가' className='input-field' onChange={(e) => { handleInsert(e, 2) }} value={insertMid} />
                                        <button type='submit' className='register-button' onClick={() => { handleAddButton(2) }} >등록</button>
                                    </div>
                                </div>

                                {/* 소분류 */}
                                <div className='category-column'>
                                    <h4>소분류</h4>
                                    <div className='input-button'>
                                        <input type='text' placeholder='소분류 검색' className='input-field' />
                                        <button className='search-button'>검색</button>
                                    </div>
                                    <br />

                                    <div className='list-form' style={{ position: 'relative' }}>
                                        {getLowCategory.length === 0 ? (
                                            <p style={{ position: 'absolute', top: '6%', left: '25%' }}>소분류가없습니다</p>
                                        ) : (
                                            <ul className='category-list'>
                                                {getLowCategory.map((category) => (
                                                    <li key={category.categoryNo}>
                                                        {category.categoryNm}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className='input-button'>
                                        <input type='text' placeholder='새 소분류 추가' className='input-field' onChange={(e) => { handleInsert(e, 3) }} value={insertLow} />
                                        <button type='submit' className='register-button' onClick={() => { handleAddButton(3) }} >등록</button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);