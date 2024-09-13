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
    const [selectAll, setSelectAll] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    useEffect(() => {
        pageEmployees(0);
    }, []);

//    const handleRegiClick = () => {
//        window.location.href = "/employeeRegister";
//    }; 페이지이동,, 이제는 안씀

//    const showTwentyEmployees = () => {
//        pageEmployees(page);
//
//    }; 조회버튼을 눌러야 조회,, 이제는 안씀

    //서희씨 처럼 화면에 몇개 보여줄지 유저가 선택하게 할까 하다가 자료가 너무 많으면 가독성이 떨어지지않나해서 일단 20개만 보이게 해놨습니다
    const pageEmployees = (page) => {
        axios.get(`/api/employeeList?page=${page}&size=20`)
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setSelectedEmployees(new Array(response.data.content.length).fill(false));
            })

    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSelectedEmployees(new Array(employees.length).fill(newSelectAll));
    };

    const handleSelect = (index) => {
        const updatedSelection = [...selectedEmployees];
        updatedSelection[index] = !updatedSelection[index];
        setSelectedEmployees(updatedSelection);

        if (updatedSelection.includes(false)) {
            setSelectAll(false);
        } else {
            setSelectAll(true);
        }
    };

    const checkedDelete = () => {
        const selectedId = employees
            .filter((_, index) => selectedEmployees[index])  // 체크된 직원만 필터링
            .map(employee => employee.employeeId);  // 해당 직원의 ID만 추출

        if (selectedId.length > 0) {
            // 서버로 삭제 요청 보내기
            axios.post('/api/deleteEmployees', { id: selectedId })
                .then(response => {
                alert('삭제가 완료되었습니다.');
                pageEmployees(page);  // 데이터 갱신
            })
                .catch(error => {
                console.error('삭제 중 발생된 에러 : ', error);
            });
        } else {
            alert('삭제할 직원을 선택해주세요.');
        }
    };

    const PageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
                setPage(newPage);
                pageEmployees(newPage);
            }
    };



    return (
        <Layout currentMenu="employee"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_employee">
            <h1>직원 목록</h1>
            {/*<button className="filter-button" onClick={showTwentyEmployees}>조회</button>*/}
            {/*<button className="filter-button">수정</button>*/}
            {/*<button className="filter-button" onClick={handleRegiClick}>등록</button>*/}
            <button className="filter-button" onClick={() => checkedDelete}>삭제</button>

            <table className="employee-table">
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll}/></th>
                        <th>직원아이디</th>
                        <th>이름</th>
                        <th>연락처</th>
                        {/*<th>이메일</th>*/}
                        <th>권한</th>
                        <th>등록일자</th>
                        <th>수정일자</th>
                        <th>삭제여부</th>
                        <th>삭제일자</th>
                        <th>상세정보수정</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map((employee,index) => (
                            <tr key={employee.employeeId}>
                                <td><input type="checkbox" checked={selectedEmployees[index] || false} onChange={() => handleSelect(index)}/></td>
                                <td>{employee.employeeId}</td>
                                <td>{employee.employeeName}</td>
                                <td>{employee.employeeTel}</td>
                                {/*<td>{employee.employeeEmail}</td>*/}
                                <td>{employee.employeeRole}</td>
                                <td>{formatDate(employee.employeeInsertDate)}</td>
                                <td>{employee.employeeUpdateDate ? format(employee.employeeUpdateDate,'yyyy-MM-dd HH:mm') : '-'}</td>
                                <td>{employee.employeeDeleteYn}</td>
                                <td>{employee.employeeDeleteDate ? format(employee.employeeDeleteDate,'yyyy-MM-dd HH:mm') : '-'}</td>
                                <td><button className = "modifyBtn">수정하기</button></td>
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
            </main>
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