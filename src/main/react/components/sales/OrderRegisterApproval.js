import React from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import '../../Main.css' //css파일 임포트
import Layout from "../../layout/Layout";
import {BrowserRouter} from "react-router-dom"; //css파일 임포트
import '../../../resources/static/css/OrderRegisterApproval.css'; //css파일 임포트


function OrderRegisterApproval() {

    return (
        <Layout>
            <div className="top-container">
                <h2>주문 등록 승인</h2>
                <p>영업 관리</p>
            </div>
                <div className="middle-container">
                    <form className="search-box">
                    <select>
                        <option>담당자</option>
                        <option>거래처</option>
                    </select>
                        <input type="text" placeholder="검색어를 입력하세요"></input>
                        <button type="submit" className="search-button">검색</button>
                    </form>
                    <div className="approval-filter">
                    <button type="button">전체</button>
                    <button type="button">결재중</button>
                    <button type="button">결재완료</button>
                    <button type="button">반려</button>
                    </div>
                </div>
                <div className="bottom-container">
                    <label>
                        전체 100건 페이지 당:
                        <select>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </label>
                    <table className="approval-list">
                        <thead>
                        <td>선택</td>
                        <td>주문번호</td>
                        <td>거래처</td>
                        <td>물품</td>
                        <td>총액(원)</td>
                        <td>납품 요청일</td>
                        <td>주문 등록일</td>
                        <td>담당자</td>
                        <td>주문 상태</td>
                        <td>내역보기</td>
                        </thead>
                        <tbody>
                        <tr>
                            <td><input type="checkbox"/></td>
                            {/* 개별 선택용 체크박스 */}
                            <td>A001</td>
                            <td>카카오</td>
                            <td>의자 외 1건</td>
                            <td>999,999</td>
                            <td>2024-10-30</td>
                            <td>2024-9-3</td>
                            <td>홍길동</td>
                            <td>결재완료</td>
                            <td><a href="#">내역 보기</a></td>
                        </tr>
                        {/* 반복문으로 데이터 */}
                        </tbody>
                    </table>
                    <div className="approval-page">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>4</button>
                        <button>5</button>
                    </div>
                    <div className="bottom-button">
                        <button>승인</button>
                        <button>삭제</button>
                        <button>인쇄</button>
                    </div>
                </div>

        </Layout>

    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderRegisterApproval/>
    </BrowserRouter>
);