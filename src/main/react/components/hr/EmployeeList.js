import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/common/Main.css';
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

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    //모달 관련(기본은 안보이게) 
    const[showModifyModal, setShowModifyModal] = useState(false);
    const[showInsertModal, setShowInsertModal] = useState(false);

    //초기화면은 재직자만
    useEffect(() => {
        pageEmployeesN(0);
    }, []);

    //등록기능
    const [newEmployee, setNewEmployee] = useState({
        employeeId: '',
        employeePw: '',
        employeeName: '',
        employeeEmail: '',
        employeeTel: '',
        employeeRole: ''
    });

//    const handleRegiClick = () => {
//        window.location.href = "/employeeRegister";
//    }; 페이지이동,, 이제는 안씀

//    const showTwentyEmployees = () => {
//        pageEmployees(page);
//
//    }; 조회버튼을 눌러야 조회,, 이제는 안씀

    //재직자만
    const pageEmployeesN = (page) => {
        axios.get(`/api/employeeList?page=${page}&size=20`)
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setSelectedEmployees(new Array(response.data.content.length).fill(false));

            })

    };

    //퇴직자만
    const pageEmployeesY = (page) => {
        axios.get(`/api/employeeListY?page=${page}&size=20`)
            .then(response => {
            console.log('응답 데이터:', response.data);
            setEmployees(response.data.content);
            setTotalPages(response.data.totalPages);
            setSelectedEmployees(new Array(response.data.content.length).fill(false));
        })

    };

    //전체직원
    const pageAllEmployees = (page) => {
        axios.get(`/api/allEmployees?page=${page}&size=20`)
            .then(response => {
            console.log('전체 직원 조회 응답 데이터:', response.data);
            setEmployees(response.data.content);
            setTotalPages(response.data.totalPages);
            setSelectedEmployees(new Array(response.data.content.length).fill(false));
        });
    };

    //전체 체크박스
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setSelectedEmployees(new Array(employees.length).fill(newSelectAll));
    };

    //개별 체크박스
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

    const PageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            pageEmployees(newPage);
        }
    };

    // 퇴직자 포함한 전체 직원 조회 시 페이징 처리
    const PageChangeAllEmployees = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
            pageAllEmployees(newPage);  // 퇴직자 포함한 조회로 페이지 변경
        }
    };

    //체크된것만 논리적 삭제
    const checkedDelete = () => {
        const selectedId = employees
            .filter((_, index) => selectedEmployees[index])
            .map(employee => employee.employeeId);

        if (selectedId.length > 0) {
            // 서버로 삭제 요청 보내기
            axios.post('/api/deleteEmployees', selectedId)
                .then(response => {
                alert('삭제가 완료되었습니다.');
                pageEmployeesN(page);
            })
                .catch(error => {
                console.error('삭제 중 발생된 에러 : ', error);
            });
        } else {
            alert('삭제할 직원을 선택해주세요.');
        }
        console.log('삭제할 직원 id : ', selectedId) // 아이디 잘찍히나 확인
    };

    ////////////// 모달 ///////

    //정보수정모달열기
    const openModifyModal = () => {
        const selectedIndex = selectedEmployees.findIndex(selected => selected);
        if (selectedIndex === -1) {
            alert('수정할 직원을 선택해주세요.');
            return;
        }

        const employeeToModify = employees[selectedIndex];
        setSelectedEmployee(employeeToModify);
        setShowModifyModal(true);
    };

    //정보수정모달닫기
    const closeModifyModal = () => {
        setShowModifyModal(false);
        setSelectedEmployee(null);
    };


    // 수정된 직원 정보 저장 및 서버로 전송
    const handleModifySubmit = () => {
        if (!validateEmployeeData(selectedEmployee)) return;

        axios.put(`/api/updateEmployee/${selectedEmployee.employeeId}`, selectedEmployee)
            .then(() => {
                alert('직원 정보가 성공적으로 수정되었습니다.');
                setShowModifyModal(false);
                pageEmployeesN(page);
            })
            .catch(error => {
                console.error('수정 중 에러 발생:', error);
                alert('직원 정보 수정 중 에러가 발생했습니다.');
            });
    };

    // 선택된 직원의 필드 수정
    const handleEmployeeChange = (field, value) => {
        setSelectedEmployee(prevEmployee => ({
            ...prevEmployee,
            [field]: value
        }));
    };

    //수정모달에서 삭제
    const handleDelete = () => {
        if (selectedEmployee) {
            axios.put(`/api/deleteEmployee/${selectedEmployee.employeeId}`)
                .then(response => {
                    alert('직원이 삭제되었습니다.');
                    closeModifyModal();
                    pageEmployeesN(page);  // 삭제 후 재직자 목록 갱신
                })
                .catch(error => {
                    console.error('삭제 중 에러 발생:', error);
                    alert('직원 삭제 중 에러가 발생했습니다.');
                });
        }
    };

//////////////////여기부터는 등록모달////////////////////////////////////////////////

    //등록모달
    const openInsertModal = () => {
        setNewEmployee({
            employeeId: '',
            employeePw: '',
            employeeName: '',
            employeeEmail: '',
            employeeTel: '',
            employeeRole: ''
        });
        setShowInsertModal(true);
    };

    const closeInsertModal = () => {
        setShowInsertModal(false);
    };

    //직원등록
    const InsertSubmit = () => {
        
        if (!validateEmployeeData(newEmployee)) {
            return; 
        }

        
        axios.post('/api/registerEmployee', newEmployee)
            .then(response => {
                alert('직원 등록이 완료되었습니다.');
                closeInsertModal();  
                setNewEmployee({
                    employeeId: '',
                    employeePw: '',
                    employeeName: '',
                    employeeEmail: '',
                    employeeTel: '',
                    employeeRole: ''
                });
                pageEmployeesN(0);  
            })
            .catch(error => {
                console.error('발생한 에러 : ', error);
                alert('직원 등록 중 에러발생');
            });
    };

    //유효성검사(등록,수정 전부다 동일)
    const validateEmployeeData = (employeeData) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/; // 000-0000-0000 형식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // xxx@xxx.xxx 형식
        const allowedRoles = ['admin', 'staff', 'manager'];

        if (!phoneRegex.test(employeeData.employeeTel)) {
            alert('연락처는 000-0000-0000 형식으로 입력해주세요.');
            return false;
        }

        if (!emailRegex.test(employeeData.employeeEmail)) {
            alert('유효한 이메일 형식으로 입력해주세요.');
            return false;
        }

        if (!allowedRoles.includes(employeeData.employeeRole.toLowerCase())) {
            alert('권한은 admin, staff, manager 중 하나를 입력해주세요.');
            return false;
        }

        
        return true;
    };



    return (
        <Layout currentMenu="employee"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_employee">
            <h1>직원 목록</h1>
            {/*<button className="filter-button" onClick={showTwentyEmployees}>조회</button>*/}
            <div className="btn-wrap">
                <button className="filter-button" onClick={openInsertModal}>등록</button>
                <button className="filter-button" onClick={checkedDelete}>삭제</button>
                <button className="filter-button" onClick={() => pageAllEmployees(0)}>퇴직자포함한 직원보기</button>
                <button className="filter-button" onClick={() => pageEmployeesN(0)}>재직자만 보기</button>
                <button className="filter-button" onClick={() => pageEmployeesY(0)}>퇴직자만 보기</button>
            </div>

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
                                <td><button className='modifyModal-btn' onClick={openModifyModal}>수정하기</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10">직원이 없네요. 회사가 망했나봐요 ㅋ</td>
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

            {showModifyModal && (
                <div className='modal-overlay'>
                    <div className='modifyModal-content'>
                        <h2>정보수정모달</h2>
                        <button className='close-button' onClick={closeModifyModal}>X</button>
                        <table>
                            <thead className='modal-th'>
                                <tr>
                                    <th>아이디</th>
                                    <th>비밀번호</th>
                                    <th>이름</th>
                                    <th>이메일</th>
                                    <th>연락처</th>
                                    <th>권한</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span>{selectedEmployee.employeeId}</span></td>
                                    <td><input
                                        type='text'
                                        placeholder='비밀번호를 입력해주세요'
                                        value={selectedEmployee.employeePw}
                                        onChange={(e) => handleEmployeeChange('employeePw', e.target.value)}
                                    /></td>
                                    <td><input
                                        type='text'
                                        placeholder='이름을 입력해주세요'
                                        value={selectedEmployee.employeeName}
                                        onChange={(e) => handleEmployeeChange('employeeName', e.target.value)}
                                    /></td>
                                    <td><input
                                        type='text'
                                        placeholder='이메일을 입력해주세요'
                                        value={selectedEmployee.employeeEmail}
                                        onChange={(e) => handleEmployeeChange('employeeEmail', e.target.value)}
                                    /></td>
                                    <td><input
                                        type='text'
                                        placeholder='연락처를 입력해주세요'
                                        value={selectedEmployee.employeeTel}
                                        onChange={(e) => handleEmployeeChange('employeeTel', e.target.value)}
                                    /></td>
                                    <td><input
                                        type='text'
                                        placeholder='권한을 입력해주세요'
                                        value={selectedEmployee.employeeRole}
                                        onChange={(e) => handleEmployeeChange('employeeRole', e.target.value)}
                                    /></td>
                                    </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><button className='submit-button' onClick={handleModifySubmit}>수정</button></td>
                                    <td><button className='delete-button' onClick={handleDelete}>삭제</button></td>
                                </tr>
                            </tfoot>
                        </table>

                    </div>
                </div>
            )}

            {showInsertModal && (
                <div className='modal-overlay'>
                    <div className='insertModal-content'>
                        <h2>직원등록모달</h2>
                        
                        <div className='insert-form'>
                            <button className='close-button' onClick={closeInsertModal}>X</button>
                            <div className='insert-column'>
                                
                                <input
                                    type='text'
                                    placeholder='아이디를 입력해주세요'
                                    value={newEmployee.employeeId}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                                />
                                <input
                                    type='text'
                                    placeholder='비밀번호를 입력해주세요'
                                    value={newEmployee.employeePw}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeePw: e.target.value })}
                                />
                                <input
                                    type='text'
                                    placeholder='이름을 입력해주세요'
                                    value={newEmployee.employeeName}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeName: e.target.value })}
                                />
                                <input
                                    type='text'
                                    placeholder='이메일을 입력해주세요'
                                    value={newEmployee.employeeEmail}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeEmail: e.target.value })}
                                />
                                <input
                                    type='text'
                                    placeholder='연락처를 입력해주세요'
                                    value={newEmployee.employeeTel}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeTel: e.target.value })}
                                />
                                <input
                                    type='text'
                                    placeholder='권한을 입력해주세요'
                                    value={newEmployee.employeeRole}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeRole: e.target.value })}
                                />
                                <hr />
                                <button className='submit-button' onClick={InsertSubmit}>등록</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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