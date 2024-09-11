import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/Main.css';
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/hr/EmployeeList.css';
import axios from 'axios';
import {formatDate} from '../../util/dateUtils'

function EmployeeList() {
    const [employees, setEmployees] = useState([]);

    const handleRegiClick = () => {
        window.location.href = "/employeeRegister";
    };

    const handleSearchEmployees = () => {
        axios.get('/api/employeeList')
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data);
            })

    };
    


    return (
        <Layout currentMenu="employeeList"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <h1>직원 목록</h1>
            <button className="filter-button" onClick={handleSearchEmployees}>조회</button>
            <button className="filter-button">수정</button>
            <button className="filter-button" onClick={handleRegiClick}>등록</button>
            <button className="filter-button">삭제</button>

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
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <tr key={employee.employeeId}>
                                <td><input type="checkbox" /></td>
                                <td>{employee.employeeId}</td>
                                <td>{employee.employeeName}</td>
                                <td>{employee.employeeTel}</td>
                                <td>{employee.employeeEmail}</td>
                                <td>{employee.employeeRole}</td>
                                <td>{formatDate(employee.employeeInsertDate)}</td>
                                <td>{formatDate(employee.employeeUpdateDate)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">직원 데이터를 조회해보세요</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Layout>
    );
}

// 페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <EmployeeList />
    </BrowserRouter>
);
