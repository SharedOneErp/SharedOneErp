import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import { BrowserRouter } from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/OrderReport.css'; // 개별 CSS 스타일 적용
import axios from 'axios';



const Category = ({ label, option }) => {
    return (
        <div>
            <label>{label}</label>
            <select className='category-box'>
                {option.map((option, index) => (
                    <option key={index} >{option}</option>
                ))}
            </select>
        </div>
    )
}

function OrderReport() {
    // chartjs 사용
    // const [topCategory, setTopCategory] = useState([]);
    // const [middleCategory, setMiddleCategory] = useState([]);
    // const [lowCategory, setLowCategory] = useState([]);
    // const [selectedTopCategory, setSelectedTopCategory] = useState(null);
    // const [selectedMiddleCategory, setSelectedMiddleCategory] = useState(null);
    
    // useEffect(() => {
    //     axios.get('/api/category/top')
    //     .then(response => {
    //         console.log(response.data);
            
    //     })
    // },[]);


    return (
        <Layout currentMenu="orderReport">

            <div className="top-container">
                <h2>영업 실적 보고서</h2>
                <p>영업 관리</p>
            </div>
            <div>
                <div className="middle-container">
                    <form className='search-container'>
                        <select className='approval-select'>
                            <option>부서명</option>
                            <option>담당자</option>
                        </select>
                        <input type='text' className='search-box' placeholder='검색어를 입력하세요' />
                        <button type='submit' className='search-button'>검색</button>
                    </form>

                    <div className='select-category'>
                        <Category label="품목대분류" option={["대1", "대2", "대3"]} />
                        <Category label="품목중분류" option={["중1", "중2", "중3"]} />
                        <Category label="품목소분류" option={["소1", "소2", "소3"]} />

                        <div>
                            <label>품목명</label>
                            <input type='text' placeholder='검색어 입력' className='category-search' />
                            <button type='submit' className='search-button2'>검색</button>
                        </div>
                    </div>



                    <div className='date-container'>
                        <select className='date-select'>
                            <option>연별</option>
                            <option>월별</option>
                            <option>일별</option>
                        </select>

                        <div className='date-form'>
                            <input type='date' className='date-input' value='2024-01-01' />
                            <p>~</p>
                            <input type='date' className='date-input' value='2024-12-31' />
                        </div>
                    </div>
                </div>

                <div className='table-container'>
                    <table className='report-table'>
                        <thead>
                            <tr>
                                <th>기간</th>
                                <th>2024-04</th>
                                <th>2024-05</th>
                                <th>2024-06</th>
                                <th>2024-07</th>
                                <th>2024-08</th>
                                <th>2024-09</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>품목코드</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>품목명</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>팀명</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>담당자</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <th>영업매출</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {/* 데이터를 동적으로 추가 */}
                        </tbody>
                    </table>
                </div>

                <div className='bottom-container'>
                    <div className="approval-page">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                    </div>

                    <div className='graph-form'>
                        <select className='graph-select'>
                            <option>막대 그래프</option>
                            <option>꺾은선 그래프</option>
                        </select>
                        <button className='search-button3'>그래프보기</button>
                    </div>

                    <div className='excel-print'>
                        <button type='button' className='search-button4'>Excel 내보내기</button>
                        <button type='button' className='search-button4'>인쇄</button>
                    </div>

                </div>













            </div>




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