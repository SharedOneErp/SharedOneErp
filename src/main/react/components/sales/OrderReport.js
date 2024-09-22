import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../../resources/static/css/sales/OrderReport.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function OrderReport() {
    const [chartData, setChartData] = useState(null);  // 초기 상태를 null로 설정
    const [startDate, setStartDate] = useState("2024-07-01");  // 기본 시작 날짜 (String 형식)
    const [endDate, setEndDate] = useState("2024-09-30");      // 기본 끝 날짜 (String 형식)
    const [selectedOrderType, setSelectedOrderType] = useState('totalOrders'); // 선택된 주문 유형 저장
    const [message, setMessage] = useState(''); // 메시지를 저장할 상태 변수(임시)

    const defaultData = [0, 0, 0];  // 데이터가 없을 때 사용할 기본값

    // 총 주문건수 API 호출
    const fetchTotalOrders = () => {
        axios.get('/api/orderReport/totalOrders', {
            params: { startDate: startDate, endDate: endDate }
        })
            .then(response => {
                console.log("API 응답:", response.data);  // 응답 데이터 구조 확인
                console.log("응답 데이터 타입:", typeof response.data);
                const totalOrders = response.data;

                // 총 주문건수를 9월에 반영
                const processedData = [0, 0, 0];  // 7월, 8월, 9월의 기본값은 0
                processedData[2] = totalOrders;  // 9월에 해당하는 값만 할당

                // 차트 데이터 설정
                setChartData({
                    labels: ['24년 7월', '24년 8월', '24년 9월'],
                    datasets: [{
                        label: '총 주문건수',
                        data: processedData,  // 7월, 8월, 9월에 대한 데이터 반영
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                });
            })
            .catch(error => {
                console.error('총 주문건수 API 호출 에러:', error.response || error);
                setChartData({
                    labels: ['24년 7월', '24년 8월', '24년 9월'],
                    datasets: [{
                        label: '총 주문건수',
                        data: defaultData,  // 기본값으로 처리
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                });
            });
    };


    // 라디오 버튼 값에 따라 적절한 API 호출
    const handleOrderTypeChange = (e) => {
        const value = e.target.value;
        setSelectedOrderType(value);
        setChartData(null); // 차트를 제거하여 빈 화면 표시
        setMessage('');     // 메시지 초기화

        if (value === 'totalOrders') {
            fetchTotalOrders();
        } else {
            // 해당 주문 유형에 따른 메시지 설정
            if (value === 'productOrders') {
                setMessage("상품별 주문건수 화면");
            } else if (value === 'customerOrders') {
                setMessage("고객별 주문건수 화면");
            } else if (value === 'employeeOrders') {
                setMessage("담당자별 주문건수 화면");
            }
        }
    };

    // 처음 렌더링될 때 총 주문건수를 불러옴
    useEffect(() => {
        fetchTotalOrders(); // 초기에는 총 주문건수 데이터를 불러옴
    }, [startDate, endDate]);  // startDate와 endDate 변경 시 다시 호출

    return (
        <Layout currentMenu="orderReport">
            <main className="main-content menu_order_report">
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">주문 현황 보고서</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            <div className="radio_box">
                                <span>구분</span>
                                <input
                                    type="radio"
                                    id="totalOrders"
                                    name="orderType"
                                    value="totalOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'totalOrders'}
                                />
                                <label htmlFor="totalOrders">총 주문건수</label>
                                <input
                                    type="radio"
                                    id="productOrders"
                                    name="orderType"
                                    value="productOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'productOrders'}
                                />
                                <label htmlFor="productOrders">상품별 주문건수</label>
                                <input
                                    type="radio"
                                    id="customerOrders"
                                    name="orderType"
                                    value="customerOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'customerOrders'}
                                />
                                <label htmlFor="customerOrders">고객별 주문건수</label>
                                <input
                                    type="radio"
                                    id="employeeOrders"
                                    name="orderType"
                                    value="employeeOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'employeeOrders'}
                                />
                                <label htmlFor="employeeOrders">담당자별 주문건수</label>
                            </div>
                        </div>
                        <div className="right">
                            <select className='box' onChange={(e) => setStartDate(e.target.value)}>
                                <option value="2024-07-01">최근 3개월</option>
                                <option value="2024-01-01">최근 3반기</option>
                                <option value="2021-01-01">최근 3년</option>
                            </select>
                        </div>
                    </div>

                    <div className="table_wrap">
                        {selectedOrderType === 'totalOrders' ? (
                            chartData ? (
                                <Bar data={chartData} options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: '최근 주문 현황' }
                                    }
                                }} />
                            ) : (
                                <p>Loading chart data...</p>
                            )
                        ) : (
                            <p>{message}</p>
                        )}
                    </div>
                </div>
            </main>
        </Layout>
    );
}

// 페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderReport />
    </BrowserRouter>
);

export default OrderReport;
