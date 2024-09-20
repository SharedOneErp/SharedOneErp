import React, {useState, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/common/Main.css'; // 공통 CSS 파일
import Layout from "../../layout/Layout";
import {BrowserRouter} from "react-router-dom";
import '../../../resources/static/css/customer/CustomerList.css';
import axios from 'axios';

// 고객 등록 모달창
function CustomerRegisterModal({show, onClose, onSave, customerData}) {
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

    //모달 알림창 2번 뜨는거 방지
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    //모달이 열릴 때마다 폼 초기화
    useEffect(() => {
        if (show) {
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
        }
    }, [show, customerData]);    


    // 입력 값 변경 시 폼 상태 업데이트
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
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
        // 등록 확인 모달 표시
        setShowConfirmModal(true);
    };

    // 실제 저장 함수
    const handleConfirmSave = () => {
        onSave(form);
        onClose();
        setShowConfirmModal(false);
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
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 연락처</label>
                                <input type="text" name="customerTel" value={form.customerTel || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>대표자명</label>
                                <input type="text" name="customerRepresentativeName"
                                       value={form.customerRepresentativeName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>사업자 등록번호(*)</label>
                                <input type="text" name="customerBusinessRegNo" value={form.customerBusinessRegNo || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>사업장 주소</label>
                                <input type="text" name="customerAddr" value={form.customerAddr || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>팩스번호</label>
                                <input type="text" name="customerFaxNo" value={form.customerFaxNo || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>담당자명</label>
                                <input type="text" name="customerManagerName" value={form.customerManagerName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>담당자 이메일</label>
                                <input type="email" name="customerManagerEmail" value={form.customerManagerEmail || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>담당자 연락처</label>
                                <input type="text" name="customerManagerTel" value={form.customerManagerTel || ''}
                                       onChange={handleInputChange}/>
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
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>거래 종료일</label>
                                <input type="date" name="customerTransactionEndDate"
                                       value={form.customerTransactionEndDate || ''}
                                       onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">등록</button>
                </form>

                {/* 확인 모달 */}
                {showConfirmModal && (
                    <ConfirmationModal
                        message="등록하시겠습니까?"
                        onConfirm={handleConfirmSave}
                        onCancel={() => setShowConfirmModal(false)}
                    />
                )}
            </div>
        </div>
    );
}

// 고객 상세 정보 모달창
function CustomerDetailModal({show, onClose, customer, onSave, onDelete}) {

    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 여부
    const [editableCustomer, setEditableCustomer] = useState(customer || {}); // 편집 가능한 고객 데이터
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

    //모달이 열릴 때마다 편집 모드 초기화
    useEffect(() => {
        if (show) {
            setIsEditMode(false); // 편집 모드 초기화
            setEditableCustomer(customer || {});
        }
    }, [show, customer]);    

    // 편집 모드 토글 함수
    const toggleEditMode = () => {
        if (isEditMode) return;
        //수정 확인 모달 표시
        setShowEditConfirmModal(true);
    };

    // 수정 확인 모달에서 확인을 누르면
    const handleConfirmEdit = () => {
        setIsEditMode(true);
        setShowEditConfirmModal(false);
    };

    // 저장 처리 함수
    const handleSave = () => {
        // 저장 확인 모달 표시
        setShowSaveConfirmModal(true);
    };

    // 저장 확인 모달에서 확인을 누르면
    const handleConfirmSave = () => {
        onSave(editableCustomer);
        onClose();
        setShowSaveConfirmModal(false);
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
                               onChange={handleChange} readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group">
                        <label>고객사 연락처</label>
                        <input type="text" name="customerTel" value={editableCustomer.customerTel || ''}
                               onChange={handleChange} readOnly={!isEditMode}/>
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
                        <select name="customerEtaxInvoiceYn" value={editableCustomer.customerEtaxInvoiceYn || ''}
                                onChange={handleChange}
                                disabled={!isEditMode}>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>거래 시작일</label>
                        <input type="date" name="customerTransactionStartDate"
                               value={editableCustomer.customerTransactionStartDate || ''} onChange={handleChange}
                               readOnly={!isEditMode}/>
                    </div>
                    <div className="form-group">
                        <label>거래 종료일</label>
                        <input type="date" name="customerTransactionEndDate"
                               value={editableCustomer.customerTransactionEndDate || ''} onChange={handleChange}
                               readOnly={!isEditMode}/>
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

                {/* 수정 확인 모달 */}
                {showEditConfirmModal && (
                    <ConfirmationModal
                        message="수정하시겠습니까?"
                        onConfirm={handleConfirmEdit}
                        onCancel={() => setShowEditConfirmModal(false)}
                    />
                )}

                {/* 저장 확인 모달 */}
                {showSaveConfirmModal && (
                    <ConfirmationModal
                        message="저장하시겠습니까?"
                        onConfirm={handleConfirmSave}
                        onCancel={() => setShowSaveConfirmModal(false)}
                    />
                )}

            </div>
        </div>
    );
}

//모달창 확인 컴포넌트 추가
function ConfirmationModal({message, onConfirm, onCancel}) {
    return (
        <div className="modal-overlay confirm-modal-overlay">
            <div className="modal-content confirm-modal-content">
                <p>{message}</p>
                <div className="modal-footer">
                    <button className="confirm-button" onClick={onConfirm}>확인</button>
                    <button className="cancel-button" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}

//날짜 포맷팅 함수 추가(등록일시, 수정일시, 삭제일시)
const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

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
    const [filterType, setFilterType] = useState('active'); //전체고객사, 삭제된 고객사 구분

    const [displayedCustomers, setDisplayedCustomers] = useState([]); // 화면에 표시할 고객 리스트
    const [sortColumn, setSortColumn] = useState('null'); // 기본적으로 정렬 열을 null로 설정
    const [sortOrder, setSortOrder] = useState('asc'); // 기본 정렬은 오름차순

    const fetchData = () => {
        axios.get('/api/customer/getList')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCustomers(response.data);
                } else {
                    console.error("Error: Expected an array but got ", typeof response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching customer data:", error);
            });
    };

    // 고객 목록 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, [filterType]);

    // 전체 고객사(삭제 포함) 표시 함수
    const showAllCustomers = () => {
        setFilterType('all');
    };
    // 등록된 고객사만 표시 함수
    const showActiveCustomers = () => {
        setFilterType('active')
    };

    // 삭제된 고객사만 표시 함수
    const showDeletedCustomers = () => {
        setFilterType('deleted')
    };

    // 검색어와 필터 타입에 따라 고객 리스트 필터링
    const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
        // 필터링 로직 (filterType 및 검색어 적용)
        const isIncludedByFilterType =
            filterType === 'all' ||
            (filterType === 'active' && customer.customerDeleteYn === 'N') ||
            (filterType === 'deleted' && customer.customerDeleteYn === 'Y');

        const searchText = filter.toLowerCase();
        const isIncludedBySearch =
            (customer.customerName ? customer.customerName.toLowerCase() : '').includes(searchText) ||
            (customer.customerBusinessRegNo ? customer.customerBusinessRegNo.toLowerCase() : '').includes(searchText) ||
            (customer.customerCountryCode ? customer.customerCountryCode.toLowerCase() : '').includes(searchText) ||
            (customer.customerManagerName ? customer.customerManagerName.toLowerCase() : '').includes(searchText);

        return isIncludedByFilterType && isIncludedBySearch;
    });

    // 정렬 로직 적용
    filtered.sort((a, b) => {
        let aValue = a[sortColumn] ? a[sortColumn].toString() : '';
        let bValue = b[sortColumn] ? b[sortColumn].toString() : '';

        // 숫자 컬럼 처리
        if (sortColumn === 'customerNo') {
            aValue = Number(aValue);
            bValue = Number(bValue);
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    });

    return filtered;
}, [customers, filterType, filter, sortColumn, sortOrder]);

    // 고객 정렬 함수
    const sortCustomers = (column) => {
        const order = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
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
                        // 해당 고객의 customerDeleteYn을 'Y'로 변경
                        setCustomers(customers.map(c => c.customerNo === customerNo ? {
                            ...c,
                            customerDeleteYn: 'Y',
                            customerDeleteDate: new Date().toISOString()
                        } : c));
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
            axios.put(`/api/customer/update/${selectedCustomer.customerNo}`, customerData)
                .then(response => {
                    setCustomers(customers.map(c => c.customerNo === selectedCustomer.customerNo ? response.data : c));
                    setShowRegisterModal(false);
                })
                .catch(error => console.error('고객 수정 중 오류:', error));
        } else {
            // 등록 로직
            axios.post('/api/customer/register', customerData)
                .then(response => {
                    setCustomers([...customers, response.data]);
                    setShowRegisterModal(false);
                })
                .catch(error => console.error('고객 등록 중 오류:', error));
        }
    };

    // 고객 삭제 처리 함수
    const handleDeleteCustomer = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/api/customer/delete/${selectedCustomer.customerNo}`)
                .then(() => {
                    // 해당 고객의 customerDeleteYn을 'Y'로 변경
                    setCustomers(customers.map(c => c.customerNo === selectedCustomer.customerNo ? {
                        ...c,
                        customerDeleteYn: 'Y',
                        customerDeleteDate: new Date().toISOString()
                    } : c));
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
                                        onClick={() => setFilter('')}
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                )}
                            </div>
                            <button
                                className={`box ${filterType === 'all' ? 'active' : ''}`}
                                onClick={showAllCustomers}
                            >
                                전체 고객사(삭제포함)
                            </button>
                            <button
                                className={`box ${filterType === 'active' ? 'active' : ''}`}
                                onClick={showActiveCustomers}
                            >
                                등록된 고객사
                            </button>
                            <button
                                className={`box ${filterType === 'deleted' ? 'active' : ''}`}
                                onClick={showDeletedCustomers}
                            >
                                삭제된 고객사
                            </button>
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
                                <th onClick={() => sortCustomers('customerName')}
                                    className={sortColumn === 'customerName' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>고객명
                                </th>
                                <th onClick={() => sortCustomers('customerBusinessRegNo')}
                                    className={sortColumn === 'customerBusinessRegNo' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>사업자
                                    등록번호
                                </th>
                                <th onClick={() => sortCustomers('customerCountryCode')}
                                    className={sortColumn === 'customerCountryCode' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>국가코드
                                </th>
                                <th onClick={() => sortCustomers('customerManagerName')}
                                    className={sortColumn === 'customerManagerName' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>담당자명
                                </th>
                                <th onClick={() => sortCustomers('customerInsertDate')}
                                    className={sortColumn === 'customerInsertDate' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>등록일시
                                </th>
                                <th onClick={() => sortCustomers('customerUpdateDate')}
                                    className={sortColumn === 'customerUpdateDate' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>수정일시
                                </th>
                                <th onClick={() => sortCustomers('customerDeleteDate')}
                                    className={sortColumn === 'customerDeleteDate' ? (sortOrder === 'asc' ? '▲' : '▼') : '▲'}>삭제일시
                                </th>

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
                                        <td>{customer.customerName || ''}</td>
                                        <td>{customer.customerBusinessRegNo || ''}</td>
                                        <td>{customer.customerCountryCode || ''}</td>
                                        <td>{customer.customerManagerName || ''}</td>
                                        <td>{formatDateTime(customer.customerInsertDate)}</td>
                                        <td>{customer.customerUpdateDate ? formatDateTime(customer.customerUpdateDate) : '-'}</td>
                                        <td>
                                            {customer.customerDeleteYn === 'Y' && customer.customerDeleteDate
                                                ? formatDateTime(customer.customerDeleteDate)
                                                : '-'}
                                        </td>
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
                        {Array.from({length: Math.min(5, totalPages)}, (_, index) => {
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
        <CustomerList/>
    </BrowserRouter>
);
