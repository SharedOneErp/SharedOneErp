import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductCategory.css'; // 개별 CSS 스타일 적용
import { formatDate } from "../../util/dateUtils";
import { useHooksList } from './ProductCategoryHooks'; // 상태 및 로직을 처리하는 훅
import CategoryModal from "../common/CategoryAddModal"; // 모달 컴포넌트 임포트
import { useDebounce } from '../common/useDebounce'; // useDebounce 훅 임포트

// 컴포넌트
function ProductCategory() {


    // 🔴 커스텀 훅을 통해 상태와 함수 불러오기
    const {
        category,
        categoryName,
        selectedCategory,
        categoryLevel,
        showModal,
        getTopCategory,
        getMidCategory,
        getLowCategory,
        insertTop,
        insertMid,
        insertLow,
        selectedTopCategory,
        selectedMidCategory,
        selectedLowCategory,
        insertedTopList,
        insertedMidList,
        insertedLowList,
        hoverTop,
        hoverMid,
        hoverLow,
        handleEditButton,
        handleDeleteButton,
        handleAllSelectCategory,
        handleSelectCategory,
        handleInsert,
        handleAddButton,
        openModal,
        closeModal,
        setSelectedTopCategory,
        setSelectedMidCategory,
        setSelectedLowCategory,
        handleTopClick,
        handleMidClick,
        handleLowClick,
        handleTopHover,
    } = useHooksList();


    // 대분류와 중분류의 열림/닫힘 상태를 저장하는 상태값
    const [collapsed, setCollapsed] = useState([]);
    const [collapsedTwo, setCollapsedTwo] = useState([]);

    // 대분류 클릭 시 열림/닫힘 상태 토글
    const toggleCollapse = (one) => {
        if (collapsed.includes(one)) {
            setCollapsed(collapsed.filter(item => item !== one));
        } else {
            setCollapsed([...collapsed, one]);
        }
    };

    // 중분류 클릭 시 열림/닫힘 상태 토글
    const toggleCollapseTwo = (two) => {
        if (collapsedTwo.includes(two)) {
            setCollapsedTwo(collapsedTwo.filter(item => item !== two));
        } else {
            setCollapsedTwo([...collapsedTwo, two]);
        }
    };

    // 대분류 모두 접기/펼치기
    const toggleAllCollapse = () => {
        if (collapsed.length === category.filter(cat => cat.categoryLevel === 1).length) {
            setCollapsed([]); // 모두 펼쳐졌다면 모두 접기
        } else {
            setCollapsed(category.filter(cat => cat.categoryLevel === 1).map(cat => cat.one)); // 모두 접기
        }
    };

    // 중분류 모두 접기/펼치기
    const toggleAllCollapseTwo = () => {
        if (collapsedTwo.length === category.filter(cat => cat.categoryLevel === 2).length) {
            setCollapsedTwo([]); // 모두 펼쳐졌다면 모두 접기
        } else {
            setCollapsedTwo(category.filter(cat => cat.categoryLevel === 2).map(cat => cat.two)); // 모두 접기
        }
    };
    return (
        <Layout currentMenu="productCategory"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_category">
                <div className="menu_title">
                    <div className="sub_title">상품 관리</div>
                    <div className="main_title">상품 카테고리 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 대분류/중분류 모두 접기 버튼 */}
                            <button className="box color_border" onClick={toggleAllCollapse}>
                                {collapsed.length === category.filter(cat => cat.categoryLevel === 1).length ? '대분류 모두 펼치기' : '대분류 모두 접기'}
                            </button>
                            <button className="box color_border" onClick={toggleAllCollapseTwo}>
                                {collapsedTwo.length === category.filter(cat => cat.categoryLevel === 2).length ? '중분류 모두 펼치기' : '중분류 모두 접기'}
                            </button>
                        </div>
                        <div className="right">
                            <button className="box color" onClick={openModal}><i class="bi bi-pencil-square"></i> 편집하기</button>
                        </div>
                    </div>
                    <div className="table_wrap" style={{ marginBottom: '15px' }}>
                        <table className="not_hover">
                            <thead>
                                <tr>
                                    <th>카테고리 레벨</th>
                                    <th>카테고리 이름</th>
                                    <th>카테고리 등록일시</th>
                                    <th>카테고리 수정일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.map((category) => {
                                    // 경로를 '>'로 나눈 후 첫 번째 부분과 나머지 부분을 따로 처리
                                    const [firstPath, ...restPaths] = category.paths.split(' > ');

                                    return (
                                        <React.Fragment key={category.categoryNo}>
                                            {/* 대분류인 경우 클릭 이벤트 추가 */}
                                            {category.categoryLevel === 1 && (
                                                <tr
                                                    id={`categoryNo_${category.categoryNo}`}
                                                    className={`level-one one-${category.one}`}
                                                    onClick={() => toggleCollapse(category.one)}
                                                >
                                                    <td>
                                                        <span className='level_title'>
                                                            대분류
                                                            {/* 대분류 접기/펼치기 아이콘 */}
                                                            <i className={`bi ${collapsed.includes(category.one) ? 'bi-caret-down-fill' : 'bi-caret-up-fill'}`}></i>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {firstPath}
                                                    </td>
                                                    <td>{formatDate(category.categoryInsertDate)}</td>
                                                    <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : '-'}</td>
                                                </tr>
                                            )}

                                            {/* 중분류는 대분류가 열려 있을 때만 표시하고 중분류 접기 기능 추가 */}
                                            {!collapsed.includes(category.one) && category.categoryLevel === 2 && (
                                                <tr
                                                    id={`categoryNo_${category.categoryNo}`}
                                                    className={`level-two one-${category.one} two-${category.two}`}
                                                    onClick={() => toggleCollapseTwo(category.two)}
                                                >
                                                    <td>
                                                        <span className='level_title'>
                                                            중분류
                                                            {/* 중분류 접기/펼치기 아이콘 */}
                                                            <i className={`bi ${collapsedTwo.includes(category.two) ? 'bi-caret-down-fill' : 'bi-caret-up-fill'}`}></i>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ marginLeft: '30px' }}>{`${restPaths.join(' > ')}`}</span>
                                                    </td>
                                                    <td>{formatDate(category.categoryInsertDate)}</td>
                                                    <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : '-'}</td>
                                                </tr>
                                            )}

                                            {/* 소분류는 대분류와 중분류가 열려 있을 때만 표시 */}
                                            {!collapsed.includes(category.one) && !collapsedTwo.includes(category.two) && category.categoryLevel === 3 && (
                                                <tr
                                                    id={`categoryNo_${category.categoryNo}`}
                                                    className={`level-three one-${category.one} two-${category.two} three-${category.three || 'none'}`}
                                                >
                                                    <td>소분류</td>
                                                    <td>
                                                        <span style={{ marginLeft: '60px' }}>{`${restPaths[restPaths.length - 1]}`}</span> {/* 마지막 경로만 출력 */}
                                                    </td>
                                                    <td>{formatDate(category.categoryInsertDate)}</td>
                                                    <td>{category.categoryUpdateDate ? formatDate(category.categoryUpdateDate) : '-'}</td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {
                showModal && (
                    <CategoryModal
                        // 필요한 props 전달
                        getTopCategory={getTopCategory}
                        getMidCategory={getMidCategory}
                        getLowCategory={getLowCategory}
                        selectedTopCategory={selectedTopCategory}
                        selectedMidCategory={selectedMidCategory}
                        selectedLowCategory={selectedLowCategory}
                        insertTop={insertTop}
                        insertMid={insertMid}
                        insertLow={insertLow}
                        handleInsert={handleInsert}
                        handleAddButton={handleAddButton}
                        handleEditButton={handleEditButton}
                        handleDeleteButton={handleDeleteButton}
                        handleTopClick={handleTopClick}
                        handleMidClick={handleMidClick}
                        handleLowClick={handleLowClick}
                        handleTopHover={handleTopHover}
                        closeModal={closeModal}
                    />
                )
            }
        </Layout >
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <ProductCategory /> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);