import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/OrderReport.css'; // 개별 CSS 스타일 적용
import axios from 'axios';
import {Bar} from 'react-chartjs-2'; //차트 사용
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,} from 'chart.js'; //차트 사용

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); //chartjs에서 쓰는 요소들을 ㅁ등록
// X축, Y축, 막대차트, 차트제목, 차트에서 데이터를 설명하는 팝업(?) 박스, 범례(작은 설명?)

function OrderReport() {
   
    const data = {
        labels: ['24년 7월', '24년 8월', '24년 9월'],  // x축에 표시될 값 (월별)
        datasets: [
            {
                label: '주문 현황',  // 막대 이름
                data: [50, 100, 75],   // y축에 표시될 값 (각 월별 주문 건수) ,, 서버에서 받아와야
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // 막대 색상
                borderColor: 'rgba(75, 192, 192, 1)',        // 막대 테두리 색상
                borderWidth: 1                              // 막대 테두리 두께
            },
        ],
    };
    
    const options = {
        responsive: true,  // 반응형 설정
        plugins: {
            legend: {
                position: 'top',  // 범례 위치
            },
            title: {
                display: true,
                text: '최근 3개월 주문현황',  // 차트 제목
            },
        },
    };


    return (
        <Layout currentMenu="orderReport">
            <main className="main-content menu_order_report">
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">영업 현황 보고서</div>
                </div>
                <div className="menu_content">
                    <div className="middle-container">
                        <Bar data={data} options={options} />
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