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
    const [startDate, setStartDate] = useState("");  // 기본 시작 날짜 (String 형식)
    const [endDate, setEndDate] = useState("");      // 기본 끝 날짜 (String 형식,조회하는 당일)
    const [selectedOrderType, setSelectedOrderType] = useState('totalOrders'); // 선택된 주문 유형 저장
    const [message, setMessage] = useState(''); // 메시지를 저장할 상태 변수

    const defaultData = [0, 0, 0];  // 데이터가 없을 때 사용할 기본값(y축에 아무것도 안뜸)

    //오늘 날짜를 종료날짜로
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    //날짜범위 계싼
    const calculateStartDate = (period) => {
        const today = new Date();
        let startDate;

        if (period === "3months") {
            today.setMonth(today.getMonth() - 2); // 3개월 전
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (period === "3halfYears") {
            today.setMonth(today.getMonth() - 17); // 18개월 전 (3반기)
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (period === "3years") {
            startDate = new Date(today.getFullYear() - 2, 0, 1); // 3년 전 1월 1일
        }

        return startDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
    };

    //차트에 보여줄 년월을 동적으로 생성
    const generateLabels = (period) => {
        const today = new Date();
        const labels = [];

        if (period === "3months") {
            for (let i = 2; i >= 0; i--) {
                const targetMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const year = targetMonth.getFullYear().toString().slice(-2); // 연도 마지막 2자리
                const month = targetMonth.getMonth() + 1; // 월 (0부터 시작하므로 +1)
                labels.push(`${year}년 ${month}월`);
            }
        } else if (period === "3halfYears") {
            const today = new Date();
            let currentYear = today.getFullYear();
            let currentHalf = today.getMonth() < 6 ? 1 : 2; // 상반기: 1, 하반기: 2
    
            for (let i = 2; i >= 0; i--) {
                let half = currentHalf - i;
                let year = currentYear;
    
                while (half <= 0) {
                    half += 2;
                    year -= 1;
                }
    
                const halfLabel = half === 1 ? '상반기' : '하반기';
                labels.push(`${year}년 ${halfLabel}`);
            }
        } else if (period === "3years") {
            for (let i = 2; i >= 0; i--) {
                const year = today.getFullYear() - i; // 최근 3년
                labels.push(`${year}년`);
            }
        }

        return labels;
    };

    // 🔴 총 주문건수 API 호출
    const fetchTotalOrders = (period) => {

        const today = getTodayDate();
        const calculatedStartDate = calculateStartDate(period);

        let apiUrl = `/api/orderReport/orders?periodType=monthly`; // 기본적으로 최근 3개월 주문 건수 호출
        if (period === "3months") {
            apiUrl = `/api/orderReport/orders?periodType=monthly`; // 최근 3개월
        } else if (period === "3halfYears") {
            apiUrl = `/api/orderReport/orders?periodType=halfyearly`; // 최근 3반기
        } else if (period === "3years") {
            apiUrl = `/api/orderReport/orders?periodType=yearly`; // 최근 3년
        }

        // 🔴 API 요청
        axios.get(apiUrl, {
            params: { startDate: calculatedStartDate, endDate: today }
        })
            .then(response => {
                console.log("API 응답:", response.data);  // 응답 데이터 구조 확인
                console.log("응답 데이터 타입:", typeof response.data); // 응답 데이터 타입 확인

                let processedData = { counts: [], amounts: [] };  // 주문 건수와 금액을 각각 저장
                const currentMonth = new Date().getMonth() + 1;  // 현재 월 (1부터 시작)
                const currentYear = new Date().getFullYear(); // 현재 연도  

                if (period === "3months") {
                    // 최근 3개월 데이터를 처리
                    processedData = { counts: [0, 0, 0], amounts: [0, 0, 0] };  // 초기값

                    response.data.forEach(([month, count, totalAmount]) => {
                        const monthDiff = currentMonth - month;  // 현재 월과 응답 월의 차이 계산
                        if (monthDiff === 2) {
                            processedData.counts[0] = count;  // 두 달 전 건수
                            processedData.amounts[0] = totalAmount;  // 두 달 전 금액
                        } else if (monthDiff === 1) {
                            processedData.counts[1] = count;  // 지난 달 건수
                            processedData.amounts[1] = totalAmount;  // 지난 달 금액
                        } else if (monthDiff === 0) {
                            processedData.counts[2] = count;  // 이번 달 건수
                            processedData.amounts[2] = totalAmount;  // 이번 달 금액
                        }
                    });
                } else if (period === "3halfYears") {
                    // 최근 3반기 데이터를 처리
                    processedData = { counts: [0, 0, 0], amounts: [0, 0, 0] };  // 초기값
                
                    const labels = generateLabels(period); // 라벨 생성
                
                    // 라벨과 데이터를 매핑하기 위한 객체 생성
                    const labelMap = {};
                    labels.forEach((label, index) => {
                        labelMap[label] = index; // 예: {'2023년 하반기': 0, '2024년 상반기': 1, '2024년 하반기': 2}
                    });
                
                    response.data.forEach(([halfYear, year, count, totalAmount]) => {
                        const halfLabel = halfYear === 'FirstHalf' ? '상반기' : '하반기';
                        const label = `${year}년 ${halfLabel}`;
                
                        const index = labelMap[label];
                        if (index !== undefined) {
                            processedData.counts[index] = count;
                            processedData.amounts[index] = totalAmount;
                        }
                    });
                } else if (period === "3years") {
                    // 최근 3년 데이터를 처리
                    processedData = { counts: [0, 0, 0], amounts: [0, 0, 0] };  // 초기값

                    response.data.forEach(([year, count, totalAmount]) => {
                        const yearDiff = currentYear - year;  // 현재 년도와 응답 년도의 차이 계산
                        if (yearDiff === 2) {
                            processedData.counts[0] = count;  // 2년 전 건수
                            processedData.amounts[0] = totalAmount;  // 2년 전 금액
                        } else if (yearDiff === 1) {
                            processedData.counts[1] = count;  // 1년 전 건수
                            processedData.amounts[1] = totalAmount;  // 1년 전 금액
                        } else if (yearDiff === 0) {
                            processedData.counts[2] = count;  // 현재 년도 건수
                            processedData.amounts[2] = totalAmount;  // 현재 년도 금액
                        }
                    });
                }

                // 차트 보여줄 값 동적으로 생성(위의 generateLabels 호출)
                const labels = generateLabels(period);

                // 🔴 차트 데이터 및 옵션 설정 -> Chart.js에서 이중 Y축을 사용, 주문 건수와 총 금액을 동일한 차트에 균형 있게 표시
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: '총 주문건수',
                            data: processedData.counts,  // 주문 건수 데이터
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-orders'  // 주문 건수 Y축
                        },
                        {
                            label: '총 주문금액',
                            data: processedData.amounts,  // 주문 금액 데이터
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-amounts'  // 주문 금액 Y축
                        }
                    ]
                });

            })
            .catch(error => {
                console.error('총 주문건수 API 호출 에러:', error.response || error);
                // 에러 발생 시 차트 데이터를 초기화하여 차트를 숨김
                setChartData(null);
                console.log('차트를 불러오는 데 실패했습니다. 나중에 다시 시도해 주세요.');
            });

    };

    // 주문 필터 데이터 호출
    const fetchOrdersByFilter = (filterType) => {
        const startDate = calculateStartDate("3months");
        const endDate = getTodayDate();

        axios.get(`/api/orderReport/ordersByFilter`, {
            params: { filterType, startDate, endDate }
        })
            .then(response => {
                const processedData = {
                    counts: response.data.map(item => item[1]), // 주문 건수
                    amounts: response.data.map(item => item[2]) // 주문 금액
                };

                const labels = response.data.map(item => item[0]); // 담당자, 고객사, 상품 이름

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: '총 주문건수',
                            data: processedData.counts,  // 주문 건수 데이터
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-orders'  // 주문 건수 Y축
                        },
                        {
                            label: '총 주문금액',
                            data: processedData.amounts,  // 주문 금액 데이터
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            yAxisID: 'y-amounts'  // 주문 금액 Y축
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('API 에러:', error.response || error);
                setChartData(null);
            });
    };

    // 기간에 따른 날짜 변경 처리
    const handleDateRangeChange = (e) => {
        const value = e.target.value;
        setStartDate(calculateStartDate(value)); // 시작일 동적으로 설정
        setEndDate(getTodayDate()); // 오늘 날짜를 종료일로 설정
        fetchTotalOrders(value); // 새로운 기간에 맞춰 주문 데이터를 가져옴
    };

    // 라디오 버튼 값에 따라 적절한 API 호출
    const handleOrderTypeChange = (e) => {
        const value = e.target.value;
        setSelectedOrderType(value);
        setChartData(null); // 차트를 제거하여 빈 화면 표시
        setMessage('');     // 메시지 초기화

        if (value === 'totalOrders') {
            fetchTotalOrders("3months");
        } else {
            fetchOrdersByFilter(value);
        }
    };

    // 처음 렌더링될 때 총 주문건수를 불러옴
    useEffect(() => {
        fetchTotalOrders("3months"); // 초기에는 총 주문건수 데이터를 불러옴
    }, []);

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
                                <label htmlFor="totalOrders">전체</label>
                                <input
                                    type="radio"
                                    id="employeeOrders"
                                    name="orderType"
                                    value="employeeOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'employeeOrders'}
                                />
                                <label htmlFor="employeeOrders">담당자별</label>
                                <input
                                    type="radio"
                                    id="customerOrders"
                                    name="orderType"
                                    value="customerOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'customerOrders'}
                                />
                                <label htmlFor="customerOrders">고객별</label>
                                <input
                                    type="radio"
                                    id="productOrders"
                                    name="orderType"
                                    value="productOrders"
                                    onChange={handleOrderTypeChange}
                                    checked={selectedOrderType === 'productOrders'}
                                />
                                <label htmlFor="productOrders">상품별</label>
                            </div>
                        </div><div className="right">
                            {selectedOrderType === 'totalOrders' && (
                                <select className='box' onChange={handleDateRangeChange}>
                                    <option value="3months">최근 3개월</option>
                                    <option value="3halfYears">최근 3반기</option>
                                    <option value="3years">최근 3년</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="table_wrap">
                        {chartData ? (
                            <Bar data={chartData} options={{
                                responsive: true,
                                plugins: {
                                    legend: { position: 'top' },
                                    title: {
                                        display: true,
                                        text: selectedOrderType === 'employeeOrders'
                                            ? '최근 3개월 간 담당자별 주문 현황'
                                            : selectedOrderType === 'customerOrders'
                                                ? '최근 3개월 간 고객별 주문 현황'
                                                : selectedOrderType === 'productOrders'
                                                    ? '최근 3개월 간 상품별 주문 현황'
                                                    : '전체 주문 현황' // 기본값
                                    }
                                },
                                scales: {
                                    yOrders: {
                                        type: 'linear',
                                        position: 'left',
                                        display: false,
                                        title: { display: true, text: '총 주문건수' },
                                        ticks: { beginAtZero: true }
                                    },
                                    yAmounts: {
                                        type: 'linear',
                                        position: 'right',
                                        display: false,
                                        title: { display: true, text: '총 주문금액' },
                                        ticks: { beginAtZero: true },
                                        grid: { drawOnChartArea: false }
                                    }
                                }
                            }} />
                        ) : (
                            <div className="loading">
                                <span></span> {/* 첫 번째 원 */}
                                <span></span> {/* 두 번째 원 */}
                                <span></span> {/* 세 번째 원 */}
                            </div>
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
