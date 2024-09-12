import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/Main.css';
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/hr/EmployeeList.css';
import axios from 'axios';
import {formatDate} from '../../util/dateUtils'
import {add,format} from 'date-fns';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleRegiClick = () => {
        window.location.href = "/employeeRegister";
    };

    const showTwentyEmployees = () => {
        pageEmployees(page);

    };

    //서희씨 처럼 화면에 몇개 보여줄지 유저가 선택하게 할까 하다가 자료가 너무 많으면 가독성이 떨어지지않나해서 일단 20개만 보이게 해놨습니다
    const pageEmployees = (page) => {
        axios.get(`/api/employeeList?page=${page}&size=20`)
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
            })

    };

    const PageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
                setPage(newPage);
                pageEmployees(newPage);
            }
    };



    return (
        <Layout currentMenu="employeeList"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <h1>직원 목록</h1>
            <button className="filter-button" onClick={showTwentyEmployees}>조회</button>
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
                        <th>삭제여부</th>
                        <th>삭제일자</th>
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
                                <td>{employee.employeeUpdateDate ? format(employee.employeeUpdateDate,'yyyy-MM-dd HH:mm') : '-'}</td>
                                <td>{employee.employeeDeleteYn}</td>
                                <td>{employee.employeeDeleteDate ? format(employee.employeeDeleteDate,'yyyy-MM-dd HH:mm') : '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">직원 데이터를 조회해보세요</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => PageChange(page - 1)} disabled={page === 0}>이전</button>
                {[...Array(totalPages).keys()].map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => PageChange(pageNum)}
                        disabled={pageNum === page}
                    >
                        {pageNum + 1}
                    </button>
                ))}
                <button onClick={() => PageChange(page + 1)} disabled={page === totalPages - 1}>다음</button>
            </div>
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