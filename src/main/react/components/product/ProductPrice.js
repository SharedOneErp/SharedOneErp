import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 스타일 적용

// 컴포넌트(고객사별 상품 가격 관리)
function ProductPrice() {

    // useState
    const [priceList, setPriceList] = useState(''); // 가격 목록

    // useEffect
    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = async () => {
        try {
            const response = await fetch(`http://localhost:8787/api/price/getList`);
            if (!response.ok) throw new Error('데이터를 가져올 수 없습니다.');
            const data = await response.json();
            //setPriceList(data);
        } catch (error) {
            console.error('정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    return (
        <Layout currentMenu="productPrice">
            <div className="menu_product_price">
                <div className="menu_title">
                    <h3>고객사별 상품 가격 관리</h3>
                </div>
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
                            {/*{priceList.map((m_price, index) => (*/}
                            {/*    <tr key={index}>*/}
                            {/*        <td>{index + 1}</td>*/}
                            {/*        <td>{m_price.customer_no}</td>*/}
                            {/*        <td>{m_price.product_cd}</td>*/}
                            {/*        <td>{m_price.price_customer}</td>*/}
                            {/*        <td>{m_price.price_start_date} ~ {m_price.price_end_date}</td>*/}
                            {/*        <td>{m_price.price_insert_date}</td>*/}
                            {/*        <td>{m_price.price_update_date}</td>*/}
                            {/*    </tr>*/}
                            {/*))}*/}
                            </tbody>
                        </table>
                    </div>

                    <div className="approval-page">
                        <button className="approval-page1">1</button>
                        <button className="approval-page2">2</button>
                        <button className="approval-page3">3</button>
                        <button className="approval-page4">4</button>
                        <button className="approval-page5">5</button>
                    </div>
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
