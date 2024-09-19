import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/common/Main.css'; // 공통 CSS 파일
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/customer/CustomerList.css';
import axios from 'axios';

// 고객 등록 모달창
function CustomerRegisterModal({ show, onClose, onSave, customerData }) {
    const [form, setForm] = useState({
        customerName: '',                    // 고객사 이름
        customerTel: '',                     // 고객사 연락처
        customerRepresentativeName: '',      // 대표자명
        customerBusinessRegNo: '',           // 사업자 등록번호
        customerAddr: '',                    // 사업장 주소
        customerFaxNo: '',                   // 팩스번호
        customerManagerName: '',             // 담당자명
        customerManagerEmail: '',            // 담당자 이메일
        customerManagerTel: '',              // 담당자 연락처
        customerCountryCode: '',             // 국가코드
        customerType: '',                    // 거래처분류
        customerEtaxInvoiceYn: '',           // 전자세금계산서 여부
        customerTransactionStartDate: '',    // 거래 시작일
        customerTransactionEndDate: ''       // 거래 종료일
    });

    // 고객 데이터 변경 시 폼 업데이트
    useEffect(() => {
        if (customerData) {
            setForm(customerData); // 기존 고객 데이터를 폼에 반영
        } else {
            // 새 고객 등록 시 폼 초기화
            setForm({
                customerName: '',
                customerTel: '',
                customerRepresentativeName: '',
                customerBusinessRegNo: '',
                customerAddr: '',
                customerFaxNo: '',
                customerManagerName: '',
                customerManagerEmail: '',
                customerManagerTel: '',
                customerCountryCode: '',
                customerType: '',
                customerEtaxInvoiceYn: '',
                customerTransactionStartDate: '',
                customerTransactionEndDate: ''
            });
        }
    }, [customerData]);

    // 입력 값 변경 시 폼 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 폼 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();

        //필수 필드 값 검증
        if (!form.customerName) {
            alert('고객사 이름은 필수 입력 항목입니다.');
            return;
        }
        if (!form.customerBusinessRegNo) {
            alert('사업자 등록번호는 필수 입력 항목입니다.');
            return;
        }

        if (window.confirm('등록하시겠습니까?')) {
            onSave(form);
            onClose();
        }
    };

    if (!show) return null; // 모달 표시 여부 체크

    return (
        <div className="modal-overlay register-modal-overlay">
            <div className="modal-content register-modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{customerData ? '고객 정보 수정' : '고객 등록'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="register-form">
                        <div className="left-column">
                            <div className="form-group">
                                <label>고객사 이름(*)</label>
                                <input type="text" name="customerName" value={form.customerName || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>고객사 연락처</label>
                                <input type="text" name="customerTel" value={form.customerTel || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>대표자명</label>
                                <input type="text" name="customerRepresentativeName"
                                    value={form.customerRepresentativeName || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>사업자 등록번호(*)</label>
                                <input type="text" name="customerBusinessRegNo" value={form.customerBusinessRegNo || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>사업장 주소</label>
                                <input type="text" name="customerAddr" value={form.customerAddr || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>팩스번호</label>
                                <input type="text" name="customerFaxNo" value={form.customerFaxNo || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>담당자명</label>
                                <input type="text" name="customerManagerName" value={form.customerManagerName || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>담당자 이메일</label>
                                <input type="email" name="customerManagerEmail" value={form.customerManagerEmail || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>담당자 연락처</label>
                                <input type="text" name="customerManagerTel" value={form.customerManagerTel || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>국가코드</label>
                                <select name="customerCountryCode" value={form.customerCountryCode || ''}
                                    onChange={handleInputChange}>
                                    <option value="KR">한국 (+82)</option>
                                    <option value="US">미국 (+1)</option>
                                    <option value="JP">일본 (+81)</option>
                                    <option value="CN">중국 (+86)</option>
                                </select>
                            </div>
                        </div>
                        <div className="right-column">
                            <div className="form-group">
                                <label>거래처분류</label>
                                <select name="customerType" value={form.customerType || ''}
                                    onChange={handleInputChange}>
                                    <option value="01">01. 고객기업</option>
                                    <option value="02">02. 협력기업</option>
                                    <option value="03">03. 본사기업</option>
                                    <option value="04">04. 기타기업</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>전자세금계산서 여부</label>
                                <select name="customerEtaxInvoiceYn" value={form.customerEtaxInvoiceYn || ''}
                                    onChange={handleInputChange}>
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>거래 시작일</label>
                                <input type="date" name="customerTransactionStartDate"
                                    value={form.customerTransactionStartDate || ''}
                                    onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>거래 종료일</label>
                                <input type="date" name="customerTransactionEndDate"
                                    value={form.customerTransactionEndDate || ''}
                                    onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">등록</button>
                </form>
            </div>
        </div>
    );
}

// 고객 상세 정보 모달창
function CustomerDetailModal({ show, onClose, customer, onSave, onDelete }) {

    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 여부
    const [editableCustomer, setEditableCustomer] = useState(customer || {}); // 편집 가능한 고객 데이터

    // 고객 데이터 변경 시 상태 업데이트
    useEffect(() => {
        if (customer) {
            setEditableCustomer(customer);
        }
    }, [customer]);

    // 편집 모드 토글 함수
    const toggleEditMode = () => {
        if (!isEditMode) {
            if (window.confirm('수정하시겠습니까?')) {
                setIsEditMode(true);
            }
        }
    };

    // 저장 처리 함수
    const handleSave = () => {
        if (window.confirm('저장하시겠습니까?')) {
            onSave(editableCustomer);
            onClose();
        }
    };

    // 입력 값 변경 시 상태 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableCustomer((prev) => ({ ...prev, [name]: value }));
    };

    if (!show || !customer) return null; // 모달 표시 여부 체크

    return (
        <div className="modal-overlay detail-modal-overlay">
            <div className="modal-content detail-modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>고객 상세 정보</h2>
                <div className="detail-form">
                    <div className="form-group">
                        <label>고객사 이름</label>
                        <input type="text" name="customerName" value={editableCustomer.customerName || ''}
                            onChange={handleChange} readOnly={!isEditMode} />
                    </div>
                    <div className="form-group">
                        <label>고객사 연락처</label>
                        <input type="text" name="customerTel" value={editableCustomer.customerTel || ''}
                            onChange={handleChange} readOnly={!isEditMode} />
                    </div>
                    <div className="form-group">
                        <label>대표자명</label>
                        <input
                            type="text"
                            name="customerRepresentativeName"
                            value={editableCustomer.customerRepresentativeName || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>사업자 등록번호</label>
                        <input
                            type="text"
                            name="customerBusinessRegNo"
                            value={editableCustomer.customerBusinessRegNo || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>사업장 주소</label>
                        <input
                            type="text"
                            name="customerAddr"
                            value={editableCustomer.customerAddr || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>팩스 번호</label>
                        <input
                            type="text"
                            name="customerFaxNo"
                            value={editableCustomer.customerFaxNo || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>고객사 담당자명</label>
                        <input
                            type="text"
                            name="customerManagerName"
                            value={editableCustomer.customerManagerName || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>고객사 담당자 이메일</label>
                        <input
                            type="text"
                            name="customerManagerEmail"
                            value={editableCustomer.customerManagerEmail || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>고객사 담당자 연락처</label>
                        <input
                            type="text"
                            name="customerManagerTel"
                            value={editableCustomer.customerManagerTel || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>국가 코드</label>
                        <select name="customerCountryCode" value={editableCustomer.customerCountryCode || ''}
                            onChange={handleChange} disabled={!isEditMode}>
                            <option value="KR">한국 (+82)</option>
                            <option value="US">미국 (+1)</option>
                            <option value="JP">일본 (+81)</option>
                            <option value="CN">중국 (+86)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>거래처분류</label>
                        <select name="customerType" value={editableCustomer.customerType || ''} onChange={handleChange}
                            disabled={!isEditMode}>
                            <option value="01">01. 고객기업</option>
                            <option value="02">02. 협력기업</option>
                            <option value="03">03. 본사기업</option>
                            <option value="04">04. 기타기업</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>전자세금계산서 여부</label>
                        <input
                            type="text"
                            name="customerEtaxInvoiceYn"
                            value={editableCustomer.customerEtaxInvoiceYn ? 'Y' : 'N'}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>거래 시작일</label>
                        <input type="date" name="customerTransactionStartDate"
                            value={editableCustomer.customerTransactionStartDate || ''} onChange={handleChange}
                            readOnly={!isEditMode} />
                    </div>
                    <div className="form-group">
                        <label>거래 종료일</label>
                        <input type="date" name="customerTransactionEndDate"
                            value={editableCustomer.customerTransactionEndDate || ''} onChange={handleChange}
                            readOnly={!isEditMode} />
                    </div>
                </div>
                <div className="modal-footer">
                    {isEditMode ? (
                        <button className="save-button" onClick={handleSave}>저장</button>
                    ) : (
                        <button className="edit-button" onClick={toggleEditMode}>수정</button>
                    )}
                    <button className="delete-button" onClick={onDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
}

// 고객 리스트
function CustomerList() {
    const [filter, setFilter] = useState(''); // 검색어 상태
    const [itemsPerPage] = useState(20); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 고객 정보
    const [showRegisterModal, setShowRegisterModal] = useState(false); // 등록 모달 표시 여부
    const [showDetailModal, setShowDetailModal] = useState(false); // 상세 모달 표시 여부
    const [selectedCustomers, setSelectedCustomers] = useState([]); // 선택된 고객 번호 리스트
    const [customers, setCustomers] = useState([]); // 전체 고객 리스트
    const [displayedCustomers, setDisplayedCustomers] = useState([]); // 화면에 표시할 고객 리스트
    const [sortColumn, setSortColumn] = useState(null); // 정렬할 컬럼
    const [sortOrder, setSortOrder] = useState('asc'); // 정렬 순서

    // 고객 목록 데이터 가져오기
    useEffect(() => {
        axios.get('/api/customer/getList')
            .then(response => {
                console.log(response); // 응답 데이터 확인
                if (Array.isArray(response.data)) {
                    setCustomers(response.data); // 전체 고객 데이터 저장
                    // 초기에는 삭제되지 않은 고객만 표시
                    setDisplayedCustomers(response.data.filter(customer => customer.customerDeleteYn === 'N'));
                } else {
                    console.error("Error: Expected an array but got ", typeof response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching customer data:", error);
            });
    }, []);

    // 전체 고객사(삭제 포함) 표시 함수
    const showAllCustomers = () => {
        setDisplayedCustomers(customers);
    };

    // 삭제된 고객사만 표시 함수
    const showDeletedCustomers = () => {
        setDisplayedCustomers(customers.filter(customer => customer.customerDeleteYn === 'Y'));
    };

    // 삭제되지 않은 고객사만 표시 함수
    const showActiveCustomers = () => {
        setDisplayedCustomers(customers.filter(customer => customer.customerDeleteYn === 'N'));
    };

    // 고객 정렬 함수
    const sortCustomers = (column) => {
        const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedCustomers = [...displayedCustomers].sort((a, b) => {
            const aValue = a[column] ? a[column].toString() : '';
            const bValue = b[column] ? b[column].toString() : '';
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        setDisplayedCustomers(sortedCustomers);
        setSortColumn(column);
        setSortOrder(order);
    };

    // 고객 선택 처리 함수 (체크박스)
    const handleSelectCustomer = (customerNo) => {
        setSelectedCustomers(prevSelected =>
            prevSelected.includes(customerNo)
                ? prevSelected.filter(id => id !== customerNo)
                : [...prevSelected, customerNo]
        );
    };

    // 선택된 고객 삭제 처리 함수
    const handleDeleteAll = () => {
        if (selectedCustomers.length === 0) {
            alert('삭제할 고객을 선택하세요.');
            return;
        }

        if (window.confirm('선택한 고객을 모두 삭제하시겠습니까?')) {
            selectedCustomers.forEach(customerNo => {
                axios.delete(`/api/customer/delete/${customerNo}`)
                    .then(() => {
                        setCustomers(customers.filter(c => c.customerNo !== customerNo));
                        setDisplayedCustomers(displayedCustomers.filter(c => c.customerNo !== customerNo));
                    })
                    .catch(error => console.error('고객 삭제 중 오류:', error));
            });
            setSelectedCustomers([]); // 선택한 고객 초기화
        }
    };

    // 검색어 삭제 버튼 클릭 처리 함수 (검색어 초기화 전용)
    const handleFilterReset = () => {
        setFilter(''); // 검색어 초기화
    };

    // 고객 저장 처리 함수 (등록 및 수정)
    const handleSaveCustomer = (customerData) => {
        if (selectedCustomer) {
            // 수정 로직
            if (window.confirm('수정하시겠습니까?')) {
                axios.put(`/api/customer/update/${selectedCustomer.customerNo}`, customerData)
                    .then(response => {
                        setCustomers(customers.map(c => c.customerNo === selectedCustomer.customerNo ? response.data : c));
                        setDisplayedCustomers(displayedCustomers.map(c => c.customerNo === selectedCustomer.customerNo ? response.data : c));
                        setShowRegisterModal(false);
                    })
                    .catch(error => console.error('고객 수정 중 오류:', error));
            }
        } else {
            // 등록 로직
            if (window.confirm('등록하시겠습니까?')) {
                axios.post('/api/customer/register', customerData)
                    .then(response => {
                        setCustomers([...customers, response.data]);
                        setDisplayedCustomers([...displayedCustomers, response.data]);
                        setShowRegisterModal(false);
                    })
                    .catch(error => console.error('고객 등록 중 오류:', error));
            }
        }
    };

    // 고객 삭제 처리 함수
    const handleDeleteCustomer = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/api/customer/delete/${selectedCustomer.customerNo}`)
                .then(() => {
                    setCustomers(customers.filter(c => c.customerNo !== selectedCustomer.customerNo));
                    setDisplayedCustomers(displayedCustomers.filter(c => c.customerNo !== selectedCustomer.customerNo));
                    setShowDetailModal(false);
                })
                .catch(error => console.error('고객 삭제 중 오류:', error));
        }
    };

    // 검색어 삭제 버튼 클릭 처리 함수
    const handleSearchDel = () => {
        setFilter(''); // 검색어 초기화
    };


    // 고객 등록 모달 열기
    const openRegisterModal = () => {
        setSelectedCustomer(null); // 새 고객 등록 시 기존 선택된 고객 정보 초기화
        setShowRegisterModal(true);
    };

    // 고객 등록 모달 닫기
    const closeRegisterModal = () => setShowRegisterModal(false);

    // 고객 상세 모달 열기
    const openDetailModal = (customer) => {
        setSelectedCustomer(customer); // 선택된 고객 정보 설정
        setShowDetailModal(true); // 상세 모달창 띄우기
    };

    // 고객 상세 모달 닫기
    const closeDetailModal = () => setShowDetailModal(false);

    // 검색어 적용된 고객 리스트
    const filteredCustomers = displayedCustomers.filter(customer => {
        const searchText = filter.toLowerCase();
        return (
            (customer.customerName ? customer.customerName.toLowerCase() : '').includes(searchText) ||
            (customer.customerBusinessRegNo ? customer.customerBusinessRegNo.toLowerCase() : '').includes(searchText) ||
            (customer.customerCountryCode ? customer.customerCountryCode.toLowerCase() : '').includes(searchText) ||
            (customer.customerManagerName ? customer.customerManagerName.toLowerCase() : '').includes(searchText)
        );
    });

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <Layout currentMenu="customer">
            <main className="main-content menu_customer">
                <div className="menu_title">
                    <div className="sub_title">고객 관리</div>
                    <div className="main_title">고객사 목록</div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            {/* 검색어 입력 */}
                            <div className={`search_box ${filter ? 'has_text' : ''}`}>
                                {/* <label className={`label_floating ${customerSearchText ? 'active' : ''}`}>고객사</label> */}
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    placeholder="고객명, 사업자 등록번호, 국가코드, 담당자명"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                {/* 검색어 삭제 버튼 */}
                                {filter && (
                                    <button
                                        className="btn-del"
                                        onClick={handleSearchDel}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <button className="box" onClick={showAllCustomers}>전체 고객사(삭제포함)</button>
                            <button className="box" onClick={showDeletedCustomers}>삭제된 고객사</button>
                            <button className="box" onClick={showActiveCustomers}>삭제되지 않은 고객사</button>
                        </div>
                        <div className="right">
                            <button className="box color" onClick={openRegisterModal}>
                                <i className="bi bi-plus-circle"></i> 등록하기
                            </button>
                        </div>
                    </div>
                    <div className="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedCustomers.length === filteredCustomers.length}
                                            onChange={(e) => setSelectedCustomers(e.target.checked ? filteredCustomers.map(c => c.customerNo) : [])}
                                        />
                                    </th>
                                    <th onClick={() => sortCustomers('customerNo')}>No</th>
                                    <th onClick={() => sortCustomers('customerName')}>고객명</th>
                                    <th onClick={() => sortCustomers('customerBusinessRegNo')}>사업자 등록번호</th>
                                    <th onClick={() => sortCustomers('customerCountryCode')}>국가코드</th>
                                    <th onClick={() => sortCustomers('customerManagerName')}>담당자명</th>
                                    <th>상세내역</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers
                                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                    .map((customer, index) => (
                                        <tr key={customer.customerNo}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedCustomers.includes(customer.customerNo)}
                                                onChange={() => handleSelectCustomer(customer.customerNo)}
                                            />
                                            </td>
                                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td>{customer.customerName ? customer.customerName : ''}</td>
                                            <td>{customer.customerBusinessRegNo ? customer.customerBusinessRegNo : ''}</td>
                                            <td>{customer.customerCountryCode ? customer.customerCountryCode : ''}</td>
                                            <td>{customer.customerManagerName ? customer.customerManagerName : ''}</td>
                                            <td>
                                                <button onClick={() => openDetailModal(customer)}>내역보기</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* 페이지네이션 컴포넌트 사용 */}
                {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    isLoading={isLoading}
                    pageInputValue={pageInputValue}
                    handlePage={handlePage}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                    handlePageInputChange={handlePageInputChange}
                /> */}

                <div className="pagination-container">
                    <div className="pagination-sub left">
                        <button className="box" onClick={handleDeleteAll}><i className="bi bi-trash3"></i>선택 삭제</button>
                    </div>
                    {/* 가운데: 페이지네이션 */}
                    <div className="pagination">
                        {/* '처음' 버튼 */}
                        {currentPage > 1 && (
                            <button className="box icon first" onClick={() => setCurrentPage(1)}>
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                        )}

                        {/* '이전' 버튼 */}
                        {currentPage > 1 && (
                            <button className="box icon left" onClick={() => setCurrentPage(currentPage - 1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        )}

                        {/* 페이지 번호 블록 */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                            const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
                            const page = startPage + index;
                            return (
                                page <= totalPages && (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={currentPage === page ? 'box active' : 'box'}
                                    >
                                        {page}
                                    </button>
                                )
                            );
                        })}

                        {/* '다음' 버튼 */}
                        {currentPage < totalPages && (
                            <button className="box icon right" onClick={() => setCurrentPage(currentPage + 1)}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        )}

                        {/* '끝' 버튼 */}
                        {currentPage < totalPages && (
                            <button className="box icon last" onClick={() => setCurrentPage(totalPages)}>
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        )}
                    </div>
                    <div className="pagination-sub right"></div>
                </div>

                {/* 모달창 */}
                <CustomerDetailModal
                    show={showDetailModal}
                    onClose={closeDetailModal}
                    customer={selectedCustomer}
                    onSave={handleSaveCustomer}
                    onDelete={handleDeleteCustomer}
                />
                <CustomerRegisterModal
                    show={showRegisterModal}
                    onClose={closeRegisterModal}
                    onSave={handleSaveCustomer}
                    customerData={selectedCustomer}
                />
            </main>
        </Layout>
    );
}

// 최종 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <CustomerList />
    </BrowserRouter>
);
