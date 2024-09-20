import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/OrderReport.css'; // 개별 CSS 스타일 적용
import axios from 'axios';



function OrderReport() {
   


    return (
        <Layout currentMenu="orderReport">
            <main className="main-content menu_order_report">
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">영업 현황 보고서</div>
                </div>
                <div className="menu_content">
                    <div className="middle-container">
                        여기엔 그래프, y축은 건수, x축은 월별,디폴트는 최근 3개월
                    </div>

                    <div>
                        <button>총 주문건수</button>
                        <button>상품별 주문건수</button>
                        <button>고객별 주문건수</button>
                        <button>담당자별 주문건수</button>
                    </div>
                    
                    <select>
                        <option>최근 3개월 </option>
                        <option>최근 3반기</option>
                        <option>최근 3년</option>
                    </select>

                    <div>
                            <button>1</button>
                            <button>2</button>
                            <button>3</button>
                            <button>4</button>
                            <button>5</button>
                    </div>
                    
                </div>
            </main>

        </Layout>

    )
}
//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderReport />
    </BrowserRouter>
);