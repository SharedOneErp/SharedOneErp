// src/components/product/ProductPrice.js
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 파일 임포트
import {formatDate} from '../../util/dateUtils'; // 날짜 포맷 함수
import DatePicker from 'react-datepicker'; // 날짜 선택 컴포넌트
import 'react-datepicker/dist/react-datepicker.css'; // 날짜 선택 스타일 임포트
// import ProductPriceModal from './ProductPriceModal'; // 상품 검색 모달 컴포넌트
import {useHooksList} from './ProductPriceHooks'; // 가격 관리에 필요한 상태 및 로직을 처리하는 훅

// 컴포넌트(고객사별 상품 가격 관리)
function ProductPrice() {

    const {
        priceList,               // [1] 가격 리스트 상태
    } = useHooksList();          // 커스텀 훅 사용

    return (
        <Layout currentMenu="productPrice">
            <div className="menu_product_price">
                <div className="menu_title">고객사별 상품 가격 관리</div>
                <div className="menu_content">
                    <div className="search_wrap">
                    </div>
                    <div className="list_count_wrap">
                        <span>전체 100건</span>
                        <span>페이지당 : </span>
                        <select>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    <div className="table_wrap">
                        <table>
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>고객사</th>
                                <th>상품</th>
                                <th>가격</th>
                                <th>적용기간</th>
                                <th>등록일시</th>
                                <th>수정일시</th>
                            </tr>
                            </thead>
                            <tbody>
                            {priceList.map((m_price) => (
                                <tr key={m_price.priceNo}>
                                    {/* 가격 번호 */}
                                    <td>{m_price.priceNo}</td>
                                    {/* 고객 이름 */}
                                    <td>{m_price.customerName}</td>
                                    {/* 제품 이름 + 카테고리 */}
                                    <td>
                                        <p>{m_price.productNm}</p>
                                        <p>({m_price.categoryNm})</p>
                                    </td>
                                    {/* 고객별 가격 */}
                                    <td>{m_price.priceCustomer.toLocaleString()}</td>
                                    {/* 적용 기간 */}
                                    <td>{formatDate(m_price.priceStartDate)} ~ {formatDate(m_price.priceEndDate)}</td>
                                    {/* 등록일시 */}
                                    <td>{formatDate(m_price.priceInsertDate)}</td>
                                    {/* 수정일시 */}
                                    <td>{formatDate(m_price.priceUpdateDate)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/*<div className="approval-page">*/}
                    {/*    <button className="approval-page1">1</button>*/}
                    {/*    <button className="approval-page2">2</button>*/}
                    {/*    <button className="approval-page3">3</button>*/}
                    {/*    <button className="approval-page4">4</button>*/}
                    {/*    <button className="approval-page5">5</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ProductPrice/>
    </BrowserRouter>
);

