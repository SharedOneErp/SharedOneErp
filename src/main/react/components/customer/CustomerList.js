import React, {useState, useEffect} from 'react';
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


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

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

    if (!show) return null;

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
            </div>
        </div>
    );
}

// 고객 상세 정보 모달창
function CustomerDetailModal({show, onClose, customer, onSave, onDelete}) {

    const [isEditMode, setIsEditMode] = useState(false);
    const [editableCustomer, setEditableCustomer] = useState(customer || {});

    useEffect(() => {
        if (customer) {
            setEditableCustomer(customer); // 선택된 고객 데이터를 설정
        }
    }, [customer]);

    const toggleEditMode = () => {
        if (!isEditMode) {
            if (window.confirm('수정하시겠습니까?')) {
                setIsEditMode(true);
            }
        }
    };

    const handleSave = () => {
        if (window.confirm('저장하시겠습니까?')) {
            onSave(editableCustomer);
            onClose(); // 모달창 닫기
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditableCustomer((prev) => ({...prev, [name]: value}));
    };

    if (!show || !customer) return null;

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
            </div>
        </div>
    );
}

// 고객 리스트
function CustomerList() {
    const [filter, setFilter] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        axios.get('/api/customer/getList')
            .then(response => setCustomers(response.data.filter(customer => customer.customerDeleteYn === 'N')))
            .catch(error => console.error('Error fetching customer data:', error));
    }, []);

    const showAllCustomers = () => {
        setCustomers(customers.filter(c => c.customerDeleteYn === 'N'));
    };

    const showDeletedCustomers = () => {
        setCustomers(customers.filter(c => c.customerDeleteYn === 'Y'));
    };

    // 고객 등록&수정 처리
    const handleSaveCustomer = (customerData) => {
        if (selectedCustomer) {
            //수정 로직
            if (window.confirm('수정하시겠습니까?')) {
                axios.put(`/api/customer/update/${selectedCustomer.customerNo}`, customerData)
                    .then(response => {
                        setCustomers(customers.map(c => c.customerNo === selectedCustomer.customerNo ? response.data : c));
                        setShowRegisterModal(false);
                    })
                    .catch(error => console.error('고객 수정 중 오류:', error));
            }
        } else {
            //등록 로직
            if (window.confirm('등록하시겠습니까?')) {
                axios.post('/api/customer/register', customerData)
                    .then(response => {
                        setCustomers([...customers, response.data]);
                        setShowRegisterModal(false);
                    })
                    .catch(error => console.error('고객 등록 중 오류:', error));
            }
        }
    };

    // 고객 삭제 처리
    const handleDeleteCustomer = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/api/customer/delete/${selectedCustomer.customerNo}`)
                .then(() => {
                    setCustomers(customers.filter(c => c.customerNo !== selectedCustomer.customerNo));
                    setShowDetailModal(false);
                })
                .catch(error => console.error('고객 삭제 중 오류:', error));
        }
    };

    //고객 체크박스 선택
    const handleSelectCustomer = (customerNo) => {
        setSelectedCustomers(prevSelected =>
            prevSelected.includes(customerNo)
                ? prevSelected.filter(id => id !== customerNo)
                : [...prevSelected, customerNo]
        );
    };

    //고객 전체삭제 처리
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
                    })
                    .catch(error => console.error('고객 삭제 중 오류:', error));
            });
            setSelectedCustomers([]); // 선택한 고객 초기화
        }
    };


    const openRegisterModal = () => {
        setSelectedCustomer(null); // 새 고객 등록 시 기존 선택된 고객 정보 초기화
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => setShowRegisterModal(false);

    const openDetailModal = (customer) => {
        setSelectedCustomer(customer); // 선택된 고객 정보 설정
        setShowDetailModal(true); // 상세 모달창 띄우기
    };

    const closeDetailModal = () => setShowDetailModal(false);

    const sortCustomers = (column) => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc';
        const sortedCustomers = [...customers].sort((a, b) => {
            const aValue = a[column] ? a[column].toString() : '';
            const bValue = b[column] ? b[column].toString() : '';
            return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
        setCustomers(sortedCustomers);
        setSortColumn(column);
        setSortOrder(order);
    };

    const filteredCustomers = customers.filter(customer => {
        return (
            customer.customerName.includes(filter) ||
            customer.customerBusinessRegNo.includes(filter) ||
            customer.customerCountryCode.includes(filter) ||
            customer.customerManagerName.includes(filter)
        );
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <Layout currentMenu="customer">
            <main className="main-content menu_customer">
                <h1>고객사 목록</h1>
                <div className="table-header">
                    <button className="register-button" onClick={openRegisterModal}>등록</button>
                    <button className="deleteall-button" onClick={handleDeleteAll}>전체 삭제</button>
                    <button className="allcustomer-button"
                            onClick={() => setCustomers(customers.filter(c => c.customerDeleteYn === 'N'))}>전체 고객사
                    </button>
                    <button className="deletedcustomer-button"
                            onClick={() => setCustomers(customers.filter(c => c.customerDeleteYn === 'Y'))}>삭제된 고객사
                    </button>
                </div>
                <div className="filter-section">
                    <input
                        type="text"
                        placeholder="고객명, 사업자 등록번호, 국가코드, 담당자명을 입력하세요"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            width: 'calc(100% - 330px)',
                            marginRight: '10px'
                        }} // Adjusting width to fit between buttons
                    />
                </div>


                <table className="customer-table">
                    <thead>
                    <tr>
                        <th><input type="checkbox"
                                   onChange={(e) => setSelectedCustomers(e.target.checked ? customers.map(c => c.customerNo) : [])}/>
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
                                <td><input type="checkbox" checked={selectedCustomers.includes(customer.customerNo)}
                                           onChange={() => handleSelectCustomer(customer.customerNo)}/></td>
                                <td>{index + 1}</td>
                                <td>{customer.customerName}</td>
                                <td>{customer.customerBusinessRegNo}</td>
                                <td>{customer.customerCountryCode}</td>
                                <td>{customer.customerManagerName}</td>
                                <td>
                                    <button onClick={() => openDetailModal(customer)}>내역보기</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination-buttons">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>이전</button>
                    {Array.from({length: totalPages}, (_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    ))}
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음
                    </button>
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
