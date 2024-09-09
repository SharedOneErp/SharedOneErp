import React, {useState} from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import '../../../resources/static/css/Main.css' //css파일 임포트
import Layout from "../../layout/Layout";
import {BrowserRouter, useNavigate} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import '../../../resources/static/css/hr/EmployeeList.css'; // 개별 CSS 스타일 적용


function EmployeeList() {


    const handleRegiClick = () => {
        window.location.href = "/employeeRegister";
    };
    return (
            <Layout>
            <h1>직원 목록</h1>
            <button className="filter-button" >조회</button>
            <button className="filter-button" >수정</button>
            <button className="filter-button" onClick={handleRegiClick}>등록</button>
            <button className="filter-button" >삭제</button>

            <table className="order-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>직원아이디</th>
                        <th>이름</th>
                        <th>연락처</th>
                        <th>이메일</th>
                        <th>권한</th>
                        <th>등록일자</th>
                        <th>수정일자</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>


</Layout>
)
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <EmployeeList/>
    </BrowserRouter>
);