import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/Main.css'; // 공통 CSS 파일
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/customer/CustomerList.css';
import axios from 'axios';

// 고객 등록 모달창
function CustomerRegisterModal({ show, onClose, onSave, customerData }) {
    const [form, setForm] = useState({
        customerName: '',
        contactNumber: '',
        representativeName: '',
        businessNumber: '',
        address: '',
        faxNumber: '',
        managerName: '',
        managerEmail: '',
        managerContact: '',
        countryCode: '',
        transactionStart: '',
        transactionEnd: '',
        transactionType: '',
        electronicTaxInvoice: false,
    });

    useEffect(() => {
        if (customerData) {
            setForm(customerData); // 기존 고객 데이터를 폼에 반영
        }
    }, [customerData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        onClose();
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
                                <label>고객사 이름</label>
                                <input type="text" name="customerName" value={form.customerName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 연락처</label>
                                <input type="text" name="contactNumber" value={form.contactNumber || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>대표자명</label>
                                <input type="text" name="representativeName" value={form.representativeName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>사업자 등록번호</label>
                                <input type="text" name="businessNumber" value={form.businessNumber || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>사업장 주소</label>
                                <input type="text" name="address" value={form.address || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>팩스번호</label>
                                <input type="text" name="faxNumber" value={form.faxNumber || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자명</label>
                                <input type="text" name="managerName" value={form.managerName || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자 이메일</label>
                                <input type="email" name="managerEmail" value={form.managerEmail || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자 연락처</label>
                                <input type="text" name="managerContact" value={form.managerContact || ''}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>국가코드</label>
                                <select name="countryCode" value={form.countryCode || ''}
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
                                <select name="transactionType" value={form.transactionType || ''}
                                        onChange={handleInputChange}>
                                    <option value="01">01.고객기업</option>
                                    <option value="02">02.협력기업</option>
                                    <option value="03">03.본사기업</option>
                                    <option value="04">04.기타기업</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>전자세금계산서 여부</label>
                                <select name="electronicTaxInvoice" value={form.electronicTaxInvoice ? 'y' : 'n'}
                                        onChange={handleInputChange}>
                                    <option value="y">Y</option>
                                    <option value="n">N</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>거래시작일</label>
                                <div className="date-picker">
                                    <input type="date" name="transactionStart" value={form.transactionStart || ''}
                                           onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>거래종료일</label>
                                <div className="date-picker">
                                    <input type="date" name="transactionEnd" value={form.transactionEnd || ''}
                                           onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">{customerData ? '수정' : '등록'}</button>
                </form>
            </div>
        </div>
    );
}

// 고객 상세 정보 모달창
function CustomerDetailModal({ show, onClose, customer, onSave, onDelete }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableCustomer, setEditableCustomer] = useState(customer || {});

    useEffect(() => {
        if (customer) {
            setEditableCustomer(customer);
        }
    }, [customer]);

    const toggleEditMode = () => setIsEditMode(!isEditMode);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableCustomer((prev) => ({ ...prev, [name]: value }));
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
                        <input
                            type="text"
                            name="customerCountryCode"
                            value={editableCustomer.customerCountryCode || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>전자세금계산서 여부</label>
                        <input
                            type="text"
                            name="customerETaxInvoiceYn"
                            value={editableCustomer.customerETaxInvoiceYn ? 'Y' : 'N'}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>거래 시작일</label>
                        <input
                            type="text"
                            name="customerTransactionStartDate"
                            value={editableCustomer.customerTransactionStartDate || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                    <div className="form-group">
                        <label>거래 종료일</label>
                        <input
                            type="text"
                            name="customerTransactionEndDate"
                            value={editableCustomer.customerTransactionEndDate || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    {isEditMode ? (
                        <button className="save-button" onClick={() => onSave(editableCustomer)}>저장</button>
                    ) : (
                        <button className="edit-button" onClick={toggleEditMode}>수정</button>
                    )}
                    <button className="delete-button" onClick={onDelete}>삭제</button>
                </div>
            </div>
        </div>
    );
}

// 고객 리스트 컴포넌트
function CustomerList() {
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customerName');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        axios.get('/api/customer/getList')
            .then(response => setCustomers(response.data))
            .catch(error => console.error('Error fetching customer data:', error));
    }, []);

    // 고객 등록/수정 처리
    const handleSaveCustomer = (customerData) => {
        if (selectedCustomer) {
            axios.put(`/api/customer/update/${selectedCustomer.customerNo}`, customerData)
                .then(response => {
                    setCustomers(customers.map(c => c.customerNo === selectedCustomer.customerNo ? response.data : c));
                    closeRegisterModal();
                })
                .catch(error => console.error('Error updating customer:', error));
        } else {
            axios.post('/api/customer/register', customerData)
                .then(response => {
                    setCustomers([...customers, response.data]);
                    closeRegisterModal();
                })
                .catch(error => console.error('Error registering customer:', error));
        }
    };

    const handleDeleteCustomer = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/api/customer/delete/${selectedCustomer.customerNo}`)
                .then(() => {
                    setCustomers(customers.filter(c => c.customerNo !== selectedCustomer.customerNo));
                    closeDetailModal();
                })
                .catch(error => console.error('Error deleting customer:', error));
        }
    };

    const openRegisterModal = (customer = null) => {
        setSelectedCustomer(customer);
        setShowRegisterModal(true);
    };

    const closeRegisterModal = () => setShowRegisterModal(false);

    const openDetailModal = (customer) => {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => setShowDetailModal(false);

    const filteredCustomers = customers.filter(customer => {
        if (filterType === 'customerName') return customer.customerName.includes(filter);
        if (filterType === 'customerBusinessRegNo') return customer.customerBusinessRegNo.includes(filter);
        if (filterType === 'customerCountryCode') return customer.customerCountryCode.includes(filter);
        if (filterType === 'customerManagerName') return customer.customerManagerName.includes(filter);
        return true;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    return (
        <Layout>
            <h1>고객사 목록</h1>
            <div className="table-header">
                <button className="register-button" onClick={() => openRegisterModal(null)}>등록</button>
            </div>
            <div className="filter-section">
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="customerName">고객명</option>
                    <option value="customerBusinessRegNo">사업자 등록번호</option>
                    <option value="customerCountryCode">국가코드</option>
                    <option value="customerManagerName">담당자명</option>
                </select>
                <input type="text" placeholder="검색어 입력" value={filter} onChange={(e) => setFilter(e.target.value)}/>
                <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>
            </div>

            <table className="customer-table">
                <thead>
                <tr>
                    <th>No</th>
                    <th>고객명</th>
                    <th>사업자 등록번호</th>
                    <th>국가코드</th>
                    <th>담당자명</th>
                    <th>상세내역</th>
                </tr>
                </thead>
                <tbody>
                {filteredCustomers
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((customer, index) => (
                        <tr key={customer.customerNo}>
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
                {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
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
