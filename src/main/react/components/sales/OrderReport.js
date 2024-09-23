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
              for (let i = 2; i >= 0; i--) {  // 2부터 0까지 역순으로 반복
                  let endMonth = new Date(today.getFullYear(), today.getMonth() - i * 6, 1);
                  let startMonth = new Date(endMonth);
                  startMonth.setMonth(startMonth.getMonth() - 5);  // 6개월 전

                  const startYear = startMonth.getFullYear();
                  const endYear = endMonth.getFullYear();
                  const startMonthNum = startMonth.getMonth() + 1;
                  const endMonthNum = endMonth.getMonth() + 1;

                  // 새로운 반기 구간 라벨을 배열의 뒤에 추가 (최신 반기가 X축의 오른쪽으로 가도록)
                  labels.push(`${startYear}년 ${startMonthNum}월 ~ ${endYear}년 ${endMonthNum}월`);
              }

        } else if (period === "3years") {
            for (let i = 2; i >= 0; i--) {
                const year = today.getFullYear() - i; // 최근 3년
                labels.push(`${year}년`);
            }
        }

        return labels;
    };

    // 총 주문건수 API 호출
    const fetchTotalOrders = (period) => {

        const today = getTodayDate();
        const calculatedStartDate = calculateStartDate(period);

        let apiUrl = '/api/orderReport/monthlyOrders'; // 기본적으로 최근3개월 주문 건수 호출
        if (period === "3months") {
            apiUrl = '/api/orderReport/monthlyOrders'; // 최근 3개월
        } else if (period === "3halfYears") {
            apiUrl = '/api/orderReport/halfYearlyOrders'; // 최근 3반기
        } else if (period === "3years") {
            apiUrl = '/api/orderReport/yearlyOrders'; // 최근 3년
        }

        axios.get(apiUrl, {
            params: { startDate: calculatedStartDate, endDate: today }
        })
            .then(response => {
                console.log("API 응답:", response.data);  // 응답 데이터 구조 확인
                console.log("응답 데이터 타입:", typeof response.data); // 응답 데이터 타입 확인

                let processedData = [];
                const currentMonth = new Date().getMonth() + 1;  // 현재 월 (1부터 시작)
                const currentYear = new Date().getFullYear(); // 현재 연도  

                if (period === "3months") {
                    // 최근 3개월 데이터를 처리
                    processedData = [0, 0, 0]; // 초기값

                    response.data.forEach(([month, count]) => {
                        const monthDiff = currentMonth - month;  // 현재 월과 응답 월의 차이 계산
                        if (monthDiff === 2) {
                            processedData[0] = count;  // 두 달 전 데이터
                        } else if (monthDiff === 1) {
                            processedData[1] = count;  // 지난 달 데이터
                        } else if (monthDiff === 0) {
                            processedData[2] = count;  // 이번 달 데이터
                        }
                    });
                } else if (period === "3halfYears") {
                    // 최근 3반기 데이터를 처리
                    response.data.forEach(([halfYear, year, count]) => {
                        // 반기 구간을 현재 달 기준으로 동적으로 처리
                        const startMonth = (currentMonth - 5 + 12) % 12; // 현재 달로부터 5개월 전 시작
                        const endMonth = currentMonth; // 현재 달까지의 데이터

                        if (year === currentYear && startMonth <= endMonth) {
                            processedData[2] = count;  // 가장 최근 반기 데이터
                        } else if (year === currentYear - 1 && startMonth > endMonth) {
                            processedData[1] = count;  // 그 이전 반기 데이터
                        } else {
                            processedData[0] = count;  // 그 이전 반기 데이터
                        }
                    });
                } else if (period === "3years") {
                    // 최근 3년 데이터를 처리
                    processedData = [0, 0, 0]; // 초기값

                    response.data.forEach(([year, count]) => {
                        const yearDiff = currentYear - year;  // 현재 년도와 응답 년도의 차이 계산
                        if (yearDiff === 2) {
                            processedData[0] = count;  // 2년 전 데이터
                        } else if (yearDiff === 1) {
                            processedData[1] = count;  // 1년 전 데이터
                        } else if (yearDiff === 0) {
                            processedData[2] = count;  // 현재 년도 데이터
                        }
                    });
                }

                //차트 보여줄 값 동적으로 생성(위의 generateLabels 호출)
                const labels = generateLabels(period);

                // 차트 데이터 설정
                setChartData({
                    labels: labels,
                    datasets: [{
                        label: '총 주문건수',
                        data: processedData,  // 데이터 반영
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                });
            })
            .catch(error => {
                console.error('총 주문건수 API 호출 에러:', error.response || error);
                const labels = generateLabels(period);  // 여기에서도 period 전달
                setChartData({
                    labels: labels,
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
                            <select className='box' onChange={handleDateRangeChange}>
                                <option value="3months">최근 3개월</option>
                                <option value="3halfYears">최근 3반기</option>
                                <option value="3years">최근 3년</option>
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
                                        title: { display: true, text: '주문 현황' }
                                    }
                                }} />
                            ) : (
                                <p>차트 불러오는중</p>
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
