import React, {useState, useEffect } from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import '../../../resources/static/css/Main.css' //css파일 임포트
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import {BrowserRouter} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import '../../../resources/static/css/customer/CustomerList.css'; // 개별 CSS 스타일 적용
import axios from 'axios';  // Axios 임포트

//모달창
function CustomerDetailModal({ show, onClose, customer, onSave, onDelete }) {

    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 상태
    const [editableCustomer, setEditableCustomer] = useState(customer);

    // 고객 정보가 변경될 때마다 editableCustomer 업데이트
    useEffect(() => {
        if (customer) {
            setEditableCustomer(customer);
        }
    }, [customer]);

    // 수정 모드 토글
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    // 입력 값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableCustomer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 모달창이 열려 있지 않거나 고객 정보가 없으면 렌더링하지 않음
    if (!show || !customer) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>고객 상세 정보</h2>
                <button className="close-button" onClick={onClose}>X</button>

                <div className="customer-form">
                    <div className="form-group">
                        <label>고객사 이름</label>
                        <input
                            type="text"
                            name="customerName"
                            value={editableCustomer.customerName || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>고객사 연락처</label>
                        <input
                            type="text"
                            name="customerTel"
                            value={editableCustomer.customerTel || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
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
                        <label>사업장주소</label>
                        <input
                            type="text"
                            name="customerAddr"
                            value={editableCustomer.customerAddr || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>팩스번호</label>
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
                        <label>국가코드</label>
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
                        {/*<input type="text" value={customer.electronicTaxInvoice ? 'Y' : 'N'} readOnly/>*/}
                        <input
                            type="text"
                            name="customerETaxInvoiceYn"
                            value={editableCustomer.customerETaxInvoiceYn ? 'Y' : 'N'}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>거래시작일</label>
                        <input
                            type="text"
                            name="customerTransactionStartDate"
                            value={editableCustomer.customerTransactionStartDate || ''}
                            onChange={handleChange}
                            readOnly={!isEditMode}
                        />
                    </div>

                    <div className="form-group">
                        <label>거래종료일</label>
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

function CustomerList() {

    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customerName'); // 필터 기본값
    const [itemsPerPage, setItemsPerPage] = useState(20); // 페이지 기본값
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState([]); //데이터값 불러오기
    const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 고객
    const [showModal, setShowModal] = useState(false); // 모달창 표시 여부

    // 서버에서 고객 목록 가져오기
    useEffect(() => {
        axios.get('/api/customer/getList')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customer data:', error);
            });
    }, []);

    // 고객 정보 수정 저장
    const handleSaveCustomer = (updatedCustomer) => {
        axios.put('/api/customer/update', updatedCustomer)
            .then(() => {
                setCustomers((prevCustomers) =>
                    prevCustomers.map((customer) =>
                        customer.customerId === updatedCustomer.customerId ? updatedCustomer : customer
                    )
                );
                setShowModal(false);
            })
            .catch(error => console.error('Error updating customer:', error));
    };

    // 고객 정보 삭제
    const handleDeleteCustomer = () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            axios.delete(`/api/customer/delete/${selectedCustomer.customerId}`)
                .then(() => {
                    setCustomers((prevCustomers) =>
                        prevCustomers.filter((customer) => customer.customerId !== selectedCustomer.customerId)
                    );
                    setShowModal(false);
                })
                .catch(error => console.error('Error deleting customer:', error));
        }
    };

    // 모달 열기
    const openModal = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true); // 모달 표시
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false); // 모달 닫기
    };

    // 필터 처리
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

            <div className="filter-section">
                <select onChange={(e) => setFilterType(e.target.value)}>
                    <option value="customerName">고객명</option>
                    <option value="customerBusinessRegNo">사업자 등록번호</option>
                    <option value="customerCountryCode">국가코드</option>
                    <option value="customerManagerName">담당자명</option>
                </select>
                <input type="text" placeholder="검색어 입력" value={filter} onChange={(e) => setFilter(e.target.value)}/>
                <button className="search-button" onClick={() => setCurrentPage(1)}>검색</button>

                <div className="pagination-section">
                    전체 {filteredCustomers.length}건 페이지 당
                    <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                        <option value={100}>100</option>
                        <option value={50}>50</option>
                        <option value={20}>20</option>
                    </select>
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
                            <tr key={customer.customerId}>
                                <td>{index + 1}</td>
                                <td>{customer.customerName}</td>
                                <td>{customer.customerBusinessRegNo}</td>
                                <td>{customer.customerCountryCode}</td>
                                <td>{customer.customerManagerName}</td>
                                <td>
                                    <button onClick={() => openModal(customer)}>내역보기</button>
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
            </div>

            {/* 모달창 */}
            <CustomerDetailModal
                show={showModal}
                onClose={closeModal}
                customer={selectedCustomer}
                onSave={handleSaveCustomer}
                onDelete={handleDeleteCustomer}
            />
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')); // 루트 DOM 요소에 리액트 컴포넌트를 렌더링
root.render(
    <BrowserRouter> {/* 리액트 라우터를 사용하여 클라이언트 사이드 라우팅 지원 */}
        <CustomerList/> {/* 컴포넌트 렌더링 */}
    </BrowserRouter>
);