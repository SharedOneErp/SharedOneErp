import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/common/Main.css';
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/hr/EmployeeList.css';
import axios from 'axios';
import { formatDate } from '../../util/dateUtils'
import { add, format } from 'date-fns';
import { useDebounce } from '../common/useDebounce';

function EmployeeList() {
    const [loading, setLoading] = useState(false); // 🔴 로딩 상태 추가
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [currentView, setCurrentView] = useState('employeesN');

    //검색한 직원을 배열로
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    // const debouncedFilteredEmployees = useDebounce(filteredEmployees,1000);
    //검색
    const [searchEmployee, setSearchEmployee] = useState('');
    const debouncedSearchEmployee = useDebounce(searchEmployee, 300);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    //모달 관련(기본은 안보이게) 
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [showInsertModal, setShowInsertModal] = useState(false);

    // 🟡 초기화면은 재직자만
    useEffect(() => {
        pageEmployeesN(1);
    }, []);

    // 🟡 검색된 직원만 화면에 나오게끔
    useEffect(() => {
        if (debouncedSearchEmployee === '') {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(employee => employee.employeeName.includes(debouncedSearchEmployee));
            setFilteredEmployees(filtered);
        }
    }, [debouncedSearchEmployee, employees])

    // 등록기능
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

    // 재직자만
    const pageEmployeesN = (page) => {
        setLoading(true); // 로딩 시작
        axios.get(`/api/employeeList?page=${page}&size=20`)
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setSelectedEmployees(new Array(response.data.content.length).fill(false));
                setLoading(false); // 로딩 종료
            })

    };

    //퇴직자만
    const pageEmployeesY = (page) => {
        setLoading(true); // 로딩 시작
        axios.get(`/api/employeeListY?page=${page}&size=20`)
            .then(response => {
                console.log('응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setSelectedEmployees(new Array(response.data.content.length).fill(false));
                setLoading(false); // 로딩 종료
            })

    };

    //전체직원
    const pageAllEmployees = (page) => {
        setLoading(true); // 로딩 시작
        axios.get(`/api/allEmployees?page=${page}&size=20`)
            .then(response => {
                console.log('전체 직원 조회 응답 데이터:', response.data);
                setEmployees(response.data.content);
                setTotalPages(response.data.totalPages);
                setSelectedEmployees(new Array(response.data.content.length).fill(false));
                setLoading(false); // 로딩 종료
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

    //페이지바뀔때
    const PageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            if (currentView === 'employeesN') {
                pageEmployeesN(newPage);  // 재직자만 보기
            } else if (currentView === 'employeesY') {
                pageEmployeesY(newPage);  // 퇴직자만 보기
            } else if (currentView === 'allEmployees') {
                pageAllEmployees(newPage);  // 전체 직원 보기
            }
        }
    };

    // 퇴직자 포함한 전체 직원 조회 시 페이징 처리
    const PageChangeAllEmployees = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            pageAllEmployees(newPage);  // 퇴직자 포함한 조회로 페이지 변경
        }
    };

    // 체크된 것만 논리적 삭제
    const checkedDelete = () => {
        const selectedId = employees
            .filter((_, index) => selectedEmployees[index])  // 선택된 직원만 필터링
            .map(employee => employee.employeeId);  // 선택된 직원의 ID를 추출

        if (selectedId.length === 0) {
            // 체크된 항목이 없을 때는 바로 경고 메시지 표시
            window.showToast("삭제할 직원을 선택해주세요.", 'error');
            return;  // 더 이상 진행하지 않음
        }

        // 선택된 항목이 있을 때만 삭제 확인을 물음
        window.confirmCustom('선택한 직원을 삭제하시겠습니까?').then(result => {
            if (result) {
                // 서버로 삭제 요청 보내기
                axios.post('/api/deleteEmployees', selectedId)
                    .then(response => {
                        window.showToast("삭제가 완료되었습니다.");
                        pageEmployeesN(1);  // 삭제 후 페이지 갱신
                    })
                    .catch(error => {
                        console.error('삭제 중 발생된 에러 : ', error);
                    });

                console.log('삭제할 직원 id : ', selectedId);  // 선택된 직원 ID 로그 출력
            }
        });
    };

    ////////////// 모달 ///////////

    //정보수정모달열기
    const openModifyModal = (employee) => {
        // const selectedIndex = selectedEmployees.findIndex(selected => selected);
        // if (selectedIndex === -1) {
        //     window.showToast('수정할 직원을 선택해주세요.', 'error');
        //     return;
        // }

        // const employeeToModify = employees[selectedIndex];
        //        if(!employee) {
        //            console.error('선택된 직원정보가 없습니다');
        //            return;
        //        }
        //        console.log(employee)
        setSelectedEmployee(employee);
        setShowModifyModal(true);
    };

    //정보수정모달닫기
    const closeModifyModal = () => {
        setShowModifyModal(false);
        setSelectedEmployee(null);
    };

    // 🟢 모달 배경 클릭 시 창 닫기(수정)
    const handleModifyBackgroundClick = (e) => {
        if (e.target.className === 'modal_overlay') {
            closeModifyModal();
        }
    };

    // 수정된 직원 정보 저장 및 서버로 전송
    const handleModifySubmit = () => {
        if (!validateEmployeeData(selectedEmployee)) return;

        axios.put(`/api/updateEmployee/${selectedEmployee.employeeId}`, selectedEmployee)
            .then(() => {
                window.showToast("직원 정보가 성공적으로 수정되었습니다.");
                setShowModifyModal(false);
                pageEmployeesN(page);
            })
            .catch(error => {
                console.error('수정 중 에러 발생:', error);
                window.showToast('직원 정보 수정 중 에러가 발생했습니다.', 'error');
            });
    };

    // 선택된 직원의 정보 수정
    const handleEmployeeChange = (field, value) => {
        setSelectedEmployee(prevEmployee => ({
            ...prevEmployee,
            [field]: value
        }));
    };

    //수정모달에서 삭제(논리적)
    const handleDelete = () => {
        window.confirmCustom("정말 삭제하시겠습니까?").then(result => {
            if (result) {
                if (selectedEmployee) {
                    axios.put(`/api/deleteEmployee/${selectedEmployee.employeeId}`)
                        .then(response => {
                            window.showToast('직원이 삭제되었습니다.');
                            closeModifyModal();
                            pageEmployeesN(1);  // 삭제 후 재직자 목록 갱신
                        })
                        .catch(error => {
                            console.error('삭제 중 에러 발생:', error);
                            window.showToast('직원 삭제 중 에러가 발생했습니다.', 'error');
                        });
                }
            }
        });
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

    //등록모달 닫기
    const closeInsertModal = () => {
        setShowInsertModal(false);
    };

    // 🟢 모달 배경 클릭 시 창 닫기(등록)
    const handleInsertBackgroundClick = (e) => {
        if (e.target.className === 'modal_overlay') {
            closeInsertModal();
        }
    };

    //직원등록(버튼누를시 중복검사)
    const InsertSubmit = () => {

        if (newEmployee.employeeRole === '') {
            window.showToast('권한을 선택해주세요.', 'error');
            return;
        }

        if (!validateEmployeeData(newEmployee)) {
            return;
        }

        axios.get('/api/checkEmployeeId', { params: { employeeId: newEmployee.employeeId } })
            .then(response => {
                if (response.data) {

                    window.showToast('이미 존재하는 아이디입니다.', 'error');
                } else {

                    axios.post('/api/registerEmployee', newEmployee)
                        .then(response => {
                            window.showToast('직원 등록이 완료되었습니다.');
                            closeInsertModal();
                            setNewEmployee({
                                employeeId: '',
                                employeePw: '',
                                employeeName: '',
                                employeeEmail: '',
                                employeeTel: '',
                                employeeRole: ''
                            });
                            pageEmployeesN(1); // 첫 페이지로 갱신
                        })
                        .catch(error => {
                            console.error('발생한 에러 : ', error);
                            window.showToast('직원 등록 중 에러발생', 'error');
                        });
                }
            })
            .catch(error => {
                console.error('ID 중복 체크 중 에러 발생:', error);
                window.showToast('ID 중복 체크 중 에러가 발생했습니다.', 'error');
            });
    };

    //유효성검사(등록,수정 전부다 이걸로씀)
    const validateEmployeeData = (employeeData) => {
        const phoneRegex = /^\d{3}-\d{4}-\d{4}$/; // 000-0000-0000 형식
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // xxx@xxx.xxx 형식
        const allowedRoles = ['admin', 'staff', 'manager'];

        if (!phoneRegex.test(employeeData.employeeTel)) {
            window.showToast('연락처는 000-0000-0000 형식으로 입력해주세요.', 'error');
            return false;
        }

        if (!emailRegex.test(employeeData.employeeEmail)) {
            window.showToast('유효한 이메일 형식으로 입력해주세요.', 'error');
            return false;
        }

        //        if (!allowedRoles.includes(employeeData.employeeRole.toLowerCase())) {
        //            window.showToast('권한은 admin, staff, manager 중 하나를 입력해주세요.');
        //            return false;
        //        }


        return true;
    };

    // 검색어 삭제 버튼 클릭 공통 함수
    const handleSearchDel = (setSearch) => {
        setSearch(''); // 공통적으로 상태를 ''로 설정
    };

    // 🟣 렌더링
    return (
        <Layout currentMenu="employee"> {/* 레이아웃 컴포넌트, currentMenu는 현재 선택된 메뉴를 나타냄 */}
            <main className="main-content menu_employee">
                <div className="menu_title">
                    <div className="sub_title">직원 관리</div>
                    <div className="main_title">직원 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            <div className={`search_box ${searchEmployee ? 'has_text' : ''}`}>
                                <label className={`label_floating ${searchEmployee ? 'active' : ''}`}>이름 입력</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    value={searchEmployee}
                                    onChange={(e) => setSearchEmployee(e.target.value)}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {searchEmployee && (
                                    <button
                                        className="btn-del"
                                        onClick={() => handleSearchDel(setSearchEmployee)} // 공통 함수 사용
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <div className="radio_box">
                                <span>상태</span>
                                <input
                                    type="radio"
                                    id="all"
                                    name="filterType"
                                    value="allEmployees"
                                    checked={currentView === 'allEmployees'}
                                    onClick={() => { setCurrentView('allEmployees'); setPage(1); pageAllEmployees(1); }}
                                />
                                <label htmlFor="all">전체</label>
                                <input
                                    type="radio"
                                    id="active"
                                    name="filterType"
                                    value="employeesN"
                                    checked={currentView === 'employeesN'}
                                    onClick={() => { setCurrentView('employeesN'); setPage(1); pageEmployeesN(1); }}
                                />
                                <label htmlFor="active">정상</label>
                                <input
                                    type="radio"
                                    id="deleted"
                                    name="filterType"
                                    value="employeesY"
                                    checked={currentView === 'employeesY'}
                                    onClick={() => { setCurrentView('employeesY'); setPage(1); pageEmployeesY(1); }}
                                />
                                <label htmlFor="deleted">삭제</label>
                            </div>
                        </div>
                        <div className="right">
                            <button className="box color" onClick={openInsertModal}><i className="bi bi-plus-circle"></i> 등록하기</button>
                        </div>
                    </div>
                    <div className="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    {/* 전체 선택 체크박스 */}
                                    <th>
                                        <label className="chkbox_label">
                                            <input
                                                type="checkbox" className="chkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                            <i className="chkbox_icon">
                                                <i className="bi bi-check-lg"></i>
                                            </i>
                                        </label>
                                    </th>
                                    <th>번호</th>
                                    <th>아이디</th>
                                    <th>이름</th>
                                    <th>연락처</th>
                                    {/*<th>이메일</th>*/}
                                    <th>권한</th>
                                    <th>등록일시</th>
                                    <th>수정일시</th>
                                    <th>삭제일시</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr className="tr_empty">
                                        <td colSpan="10"> {/* 로딩 애니메이션 중앙 배치 */}
                                            <div className="loading">
                                                <span></span> {/* 첫 번째 원 */}
                                                <span></span> {/* 두 번째 원 */}
                                                <span></span> {/* 세 번째 원 */}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (searchEmployee ? filteredEmployees : employees).length === 0 ? (
                                    // 조회된 결과가 없을 때 tr_empty 표시
                                    <tr className="tr_empty">
                                        <td colSpan="10">
                                            <div className="no_data">
                                                <i className="bi bi-exclamation-triangle"></i>
                                                조회된 결과가 없습니다.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    //고객 리스트 표시
                                    (searchEmployee ? filteredEmployees : employees).map((employee, index) => (
                                        <tr key={employee.employeeId}
                                            className={
                                                selectedEmployees[index]
                                                    ? ('selected_row')  // 선택된 행
                                                    : ''
                                            }
                                        >
                                            <td>
                                                {/* 삭제된 상태에 따라 조건부 렌더링 및 admin 여부 확인 */}
                                                {employee.employeeDeleteYn !== 'Y' ? (
                                                    employee.employeeId === 'admin' ? (
                                                        <i class="bi bi-pin-angle-fill"></i>
                                                    ) : (
                                                        <label className="chkbox_label">
                                                            <input
                                                                type="checkbox"
                                                                className="chkbox"
                                                                checked={selectedEmployees[index] || false}
                                                                onChange={() => handleSelect(index)}
                                                            />
                                                            <i className="chkbox_icon">
                                                                <i className="bi bi-check-lg"></i>
                                                            </i>
                                                        </label>
                                                    )
                                                ) : (
                                                    <span className="label_del">삭제</span>
                                                )}

                                            </td>
                                            <td>{(page - 1) * 20 + index + 1}</td>
                                            <td>{employee.employeeId}</td>
                                            <td>{employee.employeeName}</td>
                                            <td>{employee.employeeTel}</td>
                                            <td>
                                                {/* employeeRole에 따라 label 레벨을 다르게 적용 */}
                                                {employee.employeeRole === 'admin' && (
                                                    <span className="label_level level-1">admin</span>
                                                )}
                                                {employee.employeeRole === 'manager' && (
                                                    <span className="label_level level-2">manager</span>
                                                )}
                                                {employee.employeeRole === 'staff' && (
                                                    <span className="label_level level-3">staff</span>
                                                )}
                                            </td>
                                            <td>{employee.employeeInsertDate ? format(employee.employeeInsertDate, 'yyyy-MM-dd HH:mm') : '-'}</td>
                                            <td>{employee.employeeUpdateDate ? format(employee.employeeUpdateDate, 'yyyy-MM-dd HH:mm') : '-'}</td>
                                            <td>{employee.employeeDeleteDate ? format(employee.employeeDeleteDate, 'yyyy-MM-dd HH:mm') : '-'}</td>
                                            <td>
                                                {/* 삭제된 상태에 따라 클릭 이벤트와 스타일 적용 */}
                                                <div className="btn_group">
                                                    <button
                                                        className="box small"
                                                        onClick={employee.employeeDeleteYn !== 'Y' ? () => openModifyModal(employee) : null}
                                                        style={{
                                                            opacity: employee.employeeDeleteYn === 'Y' ? 0 : 1,
                                                            cursor: employee.employeeDeleteYn === 'Y' ? 'default' : 'pointer'
                                                        }}
                                                    >
                                                        수정하기
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="pagination-container">
                        <div className="pagination-sub left">
                            <button className="box" onClick={checkedDelete}><i className="bi bi-trash3"></i>선택 삭제</button>
                        </div>

                        {/* 가운데: 페이지네이션 */}
                        <div className="pagination">
                            {/* '처음' 버튼 */}
                            {page > 1 && (
                                <button className="box icon first" onClick={() => PageChange(1)}>
                                    <i className="bi bi-chevron-double-left"></i>
                                </button>
                            )}

                            {/* '이전' 버튼 */}
                            {page > 1 && (
                                <button className="box icon left" onClick={() => PageChange(page - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            )}

                            {/* 페이지 번호 블록 */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                                const startPage = Math.floor((page - 1) / 5) * 5 + 1;
                                const currentPage = startPage + index; // page 대신 currentPage로 변경
                                return (
                                    currentPage <= totalPages && (
                                        <button
                                            key={currentPage}
                                            onClick={() => PageChange(currentPage)}
                                            className={currentPage === page ? 'box active' : 'box'} // 비교 시 page 대신 currentPage 사용
                                        >
                                            {currentPage}
                                        </button>
                                    )
                                );
                            })}

                            {/* '다음' 버튼 */}
                            {page < totalPages && (
                                <button className="box icon right" onClick={() => PageChange(page + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            )}

                            {/* '끝' 버튼 */}
                            {page < totalPages && (
                                <button className="box icon last" onClick={() => PageChange(totalPages)}>
                                    <i className="bi bi-chevron-double-right"></i>
                                </button>
                            )}
                        </div>

                        <div className="pagination-sub right"></div>
                    </div>
                </div>
            </main>

            {showModifyModal && (
                <div className="modal_overlay" onMouseDown={handleModifyBackgroundClick}>
                    <div className='modal_container edit'>
                        <div className="header">
                            <div>직원 정보 수정</div>
                            <button className="btn_close" onClick={closeModifyModal}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                        </div>
                        <div className="edit_wrap">
                            <div className='edit_form'>
                                <div className='field_wrap'>
                                    <label>아이디</label>
                                    <input
                                        type='text'
                                        className='box disabled'
                                        value={selectedEmployee.employeeId}
                                        disabled
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>비밀번호</label>
                                    <input
                                        type='password'
                                        className='box'
                                        placeholder='비밀번호를 입력해주세요'
                                        value={selectedEmployee.employeePw}
                                        onChange={(e) => handleEmployeeChange('employeePw', e.target.value)}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>이름</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='이름을 입력해주세요'
                                        value={selectedEmployee.employeeName}
                                        onChange={(e) => handleEmployeeChange('employeeName', e.target.value)}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>이메일</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='이메일을 입력해주세요'
                                        value={selectedEmployee.employeeEmail}
                                        onChange={(e) => handleEmployeeChange('employeeEmail', e.target.value)}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>연락처</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='연락처를 입력해주세요'
                                        value={selectedEmployee.employeeTel}
                                        onChange={(e) => handleEmployeeChange('employeeTel', e.target.value)}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>권한</label>
                                    <select
                                        className='box'
                                        value={selectedEmployee.employeeRole}
                                        onChange={(e) => handleEmployeeChange('employeeRole', e.target.value)}
                                    >
                                        <option value="">권한을 선택해주세요</option>
                                        <option value="admin">admin</option>
                                        <option value="staff">staff</option>
                                        <option value="manager">manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="box blue" onClick={handleModifySubmit}>수정</button>
                                <button className="box red" onClick={handleDelete}>삭제</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showInsertModal && (
                <div className="modal_overlay" onMouseDown={handleInsertBackgroundClick}>
                    <div className='modal_container edit'>
                        <div className="header">
                            <div>직원 정보 등록</div>
                            <button className="btn_close" onClick={closeInsertModal}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                        </div>
                        <div className="edit_wrap">
                            <div className='edit_form'>
                                <div className='field_wrap'>
                                    <label>아이디</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='아이디를 입력해주세요'
                                        value={newEmployee.employeeId}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>비밀번호</label>
                                    <input
                                        type='password'
                                        className='box'
                                        placeholder='비밀번호를 입력해주세요'
                                        value={newEmployee.employeePw}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeePw: e.target.value })}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>이름</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='이름을 입력해주세요'
                                        value={newEmployee.employeeName}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeName: e.target.value })}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>이메일</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='이메일을 입력해주세요'
                                        value={newEmployee.employeeEmail}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeEmail: e.target.value })}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>연락처</label>
                                    <input
                                        type='text'
                                        className='box'
                                        placeholder='연락처를 입력해주세요'
                                        value={newEmployee.employeeTel}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeTel: e.target.value })}
                                    />
                                </div>
                                <div className='field_wrap'>
                                    <label>권한</label>
                                    <select
                                        className='box'
                                        value={newEmployee.employeeRole}
                                        onChange={(e) => setNewEmployee({ ...newEmployee, employeeRole: e.target.value })}
                                    >
                                        <option value="">권한을 선택해주세요</option>
                                        <option value="admin">admin</option>
                                        <option value="staff">staff</option>
                                        <option value="manager">manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button className="box blue" onClick={InsertSubmit}>등록</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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