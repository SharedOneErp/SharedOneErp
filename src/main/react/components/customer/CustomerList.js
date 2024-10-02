import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import '../../../resources/static/css/common/Main.css'; // 공통 CSS 파일
import Layout from "../../layout/Layout";
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/customer/CustomerList.css';
import axios from 'axios';

// 날짜 포맷팅 함수
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

    //모달 알림창 2번 뜨는거 방지
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 에러 메시지 상태
    const [errors, setErrors] = useState({
        customerName: '',
        customerBusinessRegNo: '',
        customerTel: '',
        customerManagerTel: '',
        customerManagerEmail: ''
    });

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
            // 에러 메시지 초기화
            setErrors({
                customerName: '',
                customerBusinessRegNo: '',
                customerTel: '',
                customerManagerTel: '',
                customerManagerEmail: ''
            });
        }
    }, [show, customerData]);

    // 입력 값 변경 시 폼 상태 업데이트
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 폼 제출 처리
    const handleSubmit = (e) => {
        e.preventDefault();

        //1. 필수 필드 값 검증
        let valid = true;
        let newErrors = {
            customerName: '',
            customerBusinessRegNo: '',
            customerTel: '',
            customerManagerTel: '',
            customerManagerEmail: '',
        };

        if (!form.customerName.trim()) {
            newErrors.customerName = '고객사 이름은 필수 입력 항목입니다.';
            valid = false;
        }
        if (!form.customerBusinessRegNo.trim()) {
            newErrors.customerBusinessRegNo = '사업자 등록번호는 필수 입력 항목입니다.';
            valid = false;
        }
        // 에러 상태 업데이트
        setErrors(newErrors);

        // 필수 필드 검증 실패 시 저장 중단
        if (!valid) {
            return;
        }

        //2. 중복 체크
        axios
            .post('/api/customer/checkDuplicate', {
                customerName: form.customerName,
                customerBusinessRegNo: form.customerBusinessRegNo,
            })
            .then((response) => {
                if (response.data.isDuplicateName) {
                    window.showToast('이미 존재하는 고객명입니다.', 'error');
                    return;
                }
                if (response.data.isDuplicateBusinessRegNo) {
                    window.showToast('이미 존재하는 사업자 등록번호입니다.', 'error');
                    return;
                }

                //3. 유효성 검증
                valid = true;
                newErrors = {
                    customerName: '',
                    customerBusinessRegNo: '',
                    customerTel: '',
                    customerManagerTel: '',
                    customerManagerEmail: ''
                };

                const customerBusinessRegNoRegex = /^\d{3}-\d{2}-\d{5}$/;
                const customerTelRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
                const customerManagerTelRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
                const customerManagerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!customerBusinessRegNoRegex.test(form.customerBusinessRegNo)) {
                    newErrors.customerBusinessRegNo =
                        '사업자 등록번호 형식이 올바르지 않습니다.\n예: 123-45-67890';
                    valid = false;
                }
                if (form.customerTel && !customerTelRegex.test(form.customerTel)) {
                    newErrors.customerTel =
                        '고객사 연락처 형식이 올바르지 않습니다.\n예: 02-456-7890';
                    valid = false;
                }
                if (form.customerManagerTel && !customerManagerTelRegex.test(form.customerManagerTel)) {
                    newErrors.customerManagerTel =
                        '담당자 연락처 형식이 올바르지 않습니다.\n예: 010-1234-5678';
                    valid = false;
                }
                if (form.customerManagerEmail && !customerManagerEmailRegex.test(form.customerManagerEmail)) {
                    newErrors.customerManagerEmail =
                        '담당자 이메일 형식이 올바르지 않습니다.\n예: abc@example.com';
                    valid = false;
                }

                // 에러 상태 업데이트
                setErrors(newErrors);

                // 유효성 검사 실패 시 저장 중단
                if (!valid) {
                    return;
                }

                // 모든 검증을 통과하면 저장 동작 수행
                onSave(form); // 상위 컴포넌트로 저장된 데이터 전달
                onClose(); // 모달 닫기
            })
            .catch((error) => {
                console.error('중복 체크 중 오류 발생:', error);
            });
    };

    if (!show) return null; // 모달 표시 여부 체크

    return (
        <div className="modal_overlay">
            <div className="modal_container customer">
                <div className="header">
                    <div>{customerData ? '고객 정보 수정' : '고객 등록'}</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="register-form">
                    <div className="left-column">
                        <div className="form-group">
                            <label>고객사 이름<span className='span_red'>*</span></label>
                            <input
                                type="text"
                                name="customerName"
                                value={form.customerName || ''}
                                onChange={handleInputChange} />
                            {errors.customerName && (
                                <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.customerName}</p>)}
                        </div>
                        <div className="form-group">
                            <label>사업자 등록번호<span className='span_red'>*</span></label>
                            <input
                                type="text"
                                name="customerBusinessRegNo"
                                value={form.customerBusinessRegNo || ''}
                                onChange={handleInputChange}
                                className={errors.customerBusinessRegNo ? 'invalid' : ''} />
                            {errors.customerBusinessRegNo && (
                                <p className="field_error_msg">
                                    <i className="bi bi-exclamation-circle-fill"></i>{' '}
                                    <span dangerouslySetInnerHTML={{ __html: errors.customerBusinessRegNo.replace(/\n/g, '<br />') }} />
                                </p>

                            )}
                        </div>
                        <div className="form-group">
                            <label>대표자명</label>
                            <input
                                type="text"
                                name="customerRepresentativeName"
                                value={form.customerRepresentativeName || ''}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>사업장 주소</label>
                            <input
                                type="text"
                                name="customerAddr"
                                value={form.customerAddr || ''}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>고객사 연락처</label>
                            <input
                                type="text"
                                name="customerTel"
                                value={form.customerTel || ''}
                                onChange={handleInputChange}
                                className={errors.customerTel ? 'invalid' : ''} />
                            {errors.customerTel && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerTel.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label>팩스번호</label>
                            <input
                                type="text"
                                name="customerFaxNo"
                                value={form.customerFaxNo || ''}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>거래처분류</label>
                            <select
                                name="customerType"
                                value={form.customerType || ''}
                                onChange={handleInputChange}>
                                <option value="">선택</option>
                                <option value="01">01. 고객기업</option>
                                <option value="02">02. 협력기업</option>
                                <option value="03">03. 본사기업</option>
                                <option value="04">04. 기타기업</option>
                            </select>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="form-group">
                            <label>담당자명</label>
                            <input
                                type="text"
                                name="customerManagerName"
                                value={form.customerManagerName || ''}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>담당자 연락처</label>
                            <input
                                type="text"
                                name="customerManagerTel"
                                value={form.customerManagerTel || ''}
                                onChange={handleInputChange}
                                className={errors.customerManagerTel ? 'invalid' : ''} />
                            {errors.customerManagerTel && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerManagerTel.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label>담당자 이메일</label>
                            <input
                                type="email"
                                name="customerManagerEmail"
                                value={form.customerManagerEmail || ''}
                                onChange={handleInputChange}
                                className={errors.customerManagerEmail ? 'invalid' : ''} />
                            {errors.customerManagerEmail && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerManagerEmail.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label>국가코드</label>
                            <select
                                name="customerCountryCode"
                                value={form.customerCountryCode || ''}
                                onChange={handleInputChange}>
                                <option value="">선택</option>
                                <option value="KR">한국 (KR)</option>
                                <option value="US">미국 (US)</option>
                                <option value="JP">일본 (JP)</option>
                                <option value="CN">중국 (CN)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>전자세금계산서 여부</label>
                            <select
                                name="customerEtaxInvoiceYn"
                                value={form.customerEtaxInvoiceYn || ''}
                                onChange={handleInputChange}>
                                <option value="">선택</option>
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>거래 시작일</label>
                            <input
                                type="date"
                                name="customerTransactionStartDate"
                                value={form.customerTransactionStartDate || ''}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>거래 종료일</label>
                            <input
                                type="date"
                                name="customerTransactionEndDate"
                                value={form.customerTransactionEndDate || ''}
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="submit" className="box blue" onClick={handleSubmit}>등록</button>
                </div>

                {/* 저장 확인 모달 */}
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
};

// 고객 상세 정보 모달창
function CustomerDetailModal({ show, onClose, customer, onSave, onDelete }) {

    const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 여부
    const [editableCustomer, setEditableCustomer] = useState(customer || {}); // 편집 가능한 고객 데이터
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false); // 수정 확인 모달 표시 여부
    const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false); // 저장 확인 모달 표시 여부
    const [errors, setErrors] = useState({ // 에러 메시지
        customerName: '',
        customerBusinessRegNo: '',
        customerTel: '',
        customerManagerTel: '',
        customerManagerEmail: ''
    });

    // 모달이 열릴 때마다 편집 모드 초기화 및 고객 데이터 설정
    useEffect(() => {
        if (show) {
            setIsEditMode(false); // 편집 모드 초기화
            setEditableCustomer(customer || {}); // 기존 고객 데이터 설정
            setErrors({
                customerName: '',
                customerBusinessRegNo: '',
                customerTel: '',
                customerManagerTel: '',
                customerManagerEmail: ''
            }); // 에러 메시지 초기화
        }
    }, [show, customer]);

    // 편집 모드 토글 함수
    const toggleEditMode = () => {
        if (isEditMode) return; // 편집 모드일 경우 동작하지 않음
        setShowEditConfirmModal(true); // 수정 확인 모달 표시
    };

    // 수정 확인 모달에서 확인을 누르면 편집 모드 활성화
    const handleConfirmEdit = () => {
        setIsEditMode(true); // 편집 모드 활성화
        setShowEditConfirmModal(false); // 수정 확인 모달 닫기
    };

    // 입력 값 변경 시 상태 업데이트 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableCustomer((prev) => ({ ...prev, [name]: value }));
    };

    // 저장 처리 함수 : 저장 확인 모달 표시
    const handleSave = () => {
        setShowSaveConfirmModal(true); //저장 확인 모달 표시
    };

    // 저장 확인 모달에서 확인을 누르면 실제 저장 동작 수행
    const handleConfirmSave = () => {

        // 필수 필드 값 검증
        let valid = true;
        let newErrors = {
            customerName: '',
            customerBusinessRegNo: '',
            customerTel: '',
            customerManagerTel: '',
            customerManagerEmail: ''
        };

        if (!editableCustomer.customerName.trim()) {
            newErrors.customerName = '고객사 이름은 필수 입력 항목입니다.';
            valid = false;
        }
        if (!editableCustomer.customerBusinessRegNo.trim()) {
            newErrors.customerBusinessRegNo = '사업자 등록번호는 필수 입력 항목입니다.';
            valid = false;
        }

        // 에러 상태 업데이트
        setErrors(newErrors);

        // 필수 필드 검증 실패 시 저장 중단
        if (!valid) {
            setShowSaveConfirmModal(false); // 저장 확인 모달 닫기
            return;
        }

        // 유효성 검증
        const customerBusinessRegNoRegex = /^\d{3}-\d{2}-\d{5}$/;
        const customerTelRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
        const customerManagerTelRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
        const customerManagerEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        valid = true;
        newErrors = {
            customerName: '',
            customerBusinessRegNo: '',
            customerTel: '',
            customerManagerTel: '',
            customerManagerEmail: ''
        };

        if (!customerBusinessRegNoRegex.test(editableCustomer.customerBusinessRegNo)) {
            newErrors.customerBusinessRegNo = '사업자 등록번호 형식이 올바르지 않습니다.\n예: 123-45-67890';
            valid = false;
        }
        if (editableCustomer.customerTel && !customerTelRegex.test(editableCustomer.customerTel)) {
            newErrors.customerTel = '고객사 연락처 형식이 올바르지 않습니다.\n예: 02-456-7890';
            valid = false;
        }
        if (editableCustomer.customerManagerTel && !customerManagerTelRegex.test(editableCustomer.customerManagerTel)) {
            newErrors.customerManagerTel = '담당자 연락처 형식이 올바르지 않습니다.\n예: 010-1234-5678';
            valid = false;
        }
        if (editableCustomer.customerManagerEmail && !customerManagerEmailRegex.test(editableCustomer.customerManagerEmail)) {
            newErrors.customerManagerEmail = '담당자 이메일 형식이 올바르지 않습니다.\n예: abc@example.com';
            valid = false;
        }

        // 에러 상태 업데이트
        setErrors(newErrors);

        // 유효성 검증 실패 시 저장 중단
        if (!valid) {
            setShowSaveConfirmModal(false); // 저장 확인 모달 닫기
            return;
        }

        // 모든 검증을 통과하면 저장 동작 수행
        onSave(editableCustomer); // 상위 컴포넌트로 저장된 데이터 전달
        onClose(); // 상세 모달 닫기
        setShowSaveConfirmModal(false); // 저장 확인 모달 닫기
    };

    if (!show || !customer) return null; // 모달 표시 여부 체크

    return (
        <div className="modal_overlay">
            <div className="modal_container customer">
                <div className="header">
                    <div>{isEditMode ? '고객 정보 수정' : '고객 상세 정보'}</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
                </div>
                <div className="detail-form">
                    <div className="left-column">
                        <div className="form-group">
                            <label>고객사 이름{isEditMode && (<span className='span_red'>*</span>)}</label>
                            <input
                                type="text"
                                name="customerName"
                                value={editableCustomer.customerName || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={errors.customerName ? 'invalid' : ''} />
                            {errors.customerName && (
                                <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.customerName}</p>)}
                        </div>
                        <div className="form-group">
                            <label>사업자 등록번호{isEditMode && (<span className='span_red'>*</span>)}</label>
                            <input
                                type="text"
                                name="customerBusinessRegNo"
                                value={editableCustomer.customerBusinessRegNo || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={errors.customerBusinessRegNo ? 'invalid' : ''} />
                            {errors.customerBusinessRegNo && (
                                <p className="field_error_msg">
                                    <i className="bi bi-exclamation-circle-fill"></i>{' '}
                                    <span dangerouslySetInnerHTML={{ __html: errors.customerBusinessRegNo.replace(/\n/g, '<br />') }} />
                                </p>
                            )}
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
                            <label>고객사 연락처</label>
                            <input
                                type="text"
                                name="customerTel"
                                value={editableCustomer.customerTel || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={errors.customerTel ? 'invalid' : ''} />
                            {errors.customerTel && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerTel.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
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
                            <label>거래처분류</label>
                            <select name="customerType" value={editableCustomer.customerType || ''} onChange={handleChange}
                                disabled={!isEditMode}>
                                <option value="">선택</option>
                                <option value="01">01. 고객기업</option>
                                <option value="02">02. 협력기업</option>
                                <option value="03">03. 본사기업</option>
                                <option value="04">04. 기타기업</option>
                            </select>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="form-group">
                            <label>담당자명</label>
                            <input
                                type="text"
                                name="customerManagerName"
                                value={editableCustomer.customerManagerName || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                            />
                        </div>
                        <div className="form-group">
                            <label>담당자 연락처</label>
                            <input
                                type="text"
                                name="customerManagerTel"
                                value={editableCustomer.customerManagerTel || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={errors.customerManagerTel ? 'invalid' : ''} />
                            {errors.customerManagerTel && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerManagerTel.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label>담당자 이메일</label>
                            <input
                                type="email"
                                name="customerManagerEmail"
                                value={editableCustomer.customerManagerEmail || ''}
                                onChange={handleChange}
                                readOnly={!isEditMode}
                                className={errors.customerManagerEmail ? 'invalid' : ''} />
                            {errors.customerManagerEmail && (
                                <p
                                    className="field_error_msg"
                                    dangerouslySetInnerHTML={{
                                        __html: errors.customerManagerEmail.replace(/\n/g, '<br />'),
                                    }}
                                />
                            )}
                        </div>
                        <div className="form-group">
                            <label>국가 코드</label>
                            <select name="customerCountryCode" value={editableCustomer.customerCountryCode || ''}
                                onChange={handleChange} disabled={!isEditMode}>
                                <option value="">선택</option>
                                <option value="KR">한국 (+82)</option>
                                <option value="US">미국 (+1)</option>
                                <option value="JP">일본 (+81)</option>
                                <option value="CN">중국 (+86)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>전자세금계산서 여부</label>
                            <select name="customerEtaxInvoiceYn" value={editableCustomer.customerEtaxInvoiceYn || ''}
                                onChange={handleChange}
                                disabled={!isEditMode}>
                                <option value="">선택</option>
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>거래 시작일</label>
                            <input type="date" name="customerTransactionStartDate"
                                value={editableCustomer.customerTransactionStartDate ? editableCustomer.customerTransactionStartDate.substring(0, 10) : ''} onChange={handleChange}
                                readOnly={!isEditMode} />
                        </div>
                        <div className="form-group">
                            <label>거래 종료일</label>
                            <input type="date" name="customerTransactionEndDate"
                                value={editableCustomer.customerTransactionEndDate ? editableCustomer.customerTransactionEndDate.substring(0, 10) : ''} onChange={handleChange}
                                readOnly={!isEditMode} />
                        </div>
                    </div>
                </div>
                <div className="modal-actions">
                    {isEditMode ? (
                        <button className="box blue" type="button" onClick={handleSave}>저장</button>
                    ) : (
                        <>
                            {/* 삭제된 상태에 따라 조건부 렌더링 */}
                            {editableCustomer.customerDeleteYn !== 'Y' ? (
                                <>
                                    <button className="box blue" type="button" onClick={toggleEditMode}>수정</button>
                                    <button className="box red" type="button" onClick={onDelete}>삭제</button>
                                </>
                            ) : (<></>)}
                        </>
                    )}
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
};

// 모달창 확인 컴포넌트
function ConfirmationModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal_overlay">
            <div className="modal_confirm">
                {/* 아이콘을 포함한 메시지 출력 영역 */}
                <div className="icon_wrap"><i className="bi bi-exclamation-circle"></i></div>
                <p className='msg'>{message}</p>
                {/* 확인 및 취소 버튼 */}
                <div className="modal-actions">
                    <button className="box red" onClick={onConfirm}>확인</button>
                    <button className="box gray" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

// 고객 리스트
function CustomerList() {

    const [loading, setLoading] = useState(false); // 🔴 로딩 상태 추가
    const [filter, setFilter] = useState(''); // 검색어 상태
    const [itemsPerPage] = useState(20); // 페이지당 항목 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [selectedCustomer, setSelectedCustomer] = useState(null); // 선택된 고객 정보
    const [showRegisterModal, setShowRegisterModal] = useState(false); // 등록 모달 표시 여부
    const [showDetailModal, setShowDetailModal] = useState(false); // 상세 모달 표시 여부
    const [selectedCustomers, setSelectedCustomers] = useState([]); // 선택된 고객 번호 리스트
    const [customers, setCustomers] = useState([]); // 전체 고객 리스트
    const [filterType, setFilterType] = useState('active'); // 전체고객사, 삭제된 고객사 구분

    const [sortColumn, setSortColumn] = useState('customerName'); // 기본적으로 정렬 열 customerName 설정
    const [sortOrder, setSortOrder] = useState('asc'); // 기본 정렬은 오름차순

    const fetchData = () => {
        setLoading(true); // 로딩 시작
        axios.get('/api/customer/getList')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCustomers(response.data);
                    setLoading(false); // 로딩 종료
                } else {
                    console.error("Error: Expected an array but got ", typeof response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching customer data:", error);
                setLoading(false); // 로딩 종료
            });
    };

    // 고객 목록 데이터 가져오기
    useEffect(() => {
        fetchData();
    }, []);

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
            window.showToast('삭제할 고객을 선택하세요.', 'error');
            return;
        }

        window.confirmCustom('선택한 고객을 모두 삭제하시겠습니까?').then(result => {
            if (result) {
                const deletePromises = selectedCustomers.map((customerNo) =>
                    axios
                        .delete(`/api/customer/delete/${customerNo}`)
                        .then(() => {
                            // 해당 고객의 customerDeleteYn을 'Y'로 변경
                            setCustomers((prevCustomers) =>
                                prevCustomers.map((c) =>
                                    c.customerNo === customerNo
                                        ? {
                                            ...c,
                                            customerDeleteYn: 'Y',
                                            customerDeleteDate: new Date().toISOString(),
                                        }
                                        : c
                                )
                            );
                        })
                        .catch((error) => console.error('고객 삭제 중 오류:', error))
                );
                Promise.all(deletePromises).then(() => {
                    setFilterType('deleted'); // 상태를 'deleted'로 변경하여 삭제된 항목을 바로 표시
                    window.showToast('삭제 되었습니다.'); // 삭제 완료 메시지
                    setSelectedCustomers([]); // 선택한 고객 초기화
                });
            }
        });
    };

    // 검색어 삭제 버튼 클릭 처리 함수 (검색어 초기화 전용)
    const handleFilterReset = () => {
        setFilter(''); // 검색어 초기화
    };

    // 고객 저장 처리 함수 (등록 및 수정)
    const handleSaveCustomer = (customerData) => {
        if (selectedCustomer) {
            // 수정 로직
            axios
                .put(`/api/customer/update/${selectedCustomer.customerNo}`, customerData)
                .then((response) => {
                    setCustomers(
                        customers.map((c) =>
                            c.customerNo === selectedCustomer.customerNo ? response.data : c
                        )
                    );
                    setShowDetailModal(false);
                    window.showToast('수정 되었습니다.'); // 수정 완료 메시지
                })
                .catch((error) => console.error('고객 수정 중 오류:', error));
        } else {
            // 등록 로직
            axios
                .post('/api/customer/register', customerData)
                .then((response) => {
                    setCustomers([...customers, response.data]);
                    setShowRegisterModal(false);
                    window.showToast('등록 되었습니다.'); // 등록 완료 메시지
                })
                .catch((error) => console.error('고객 등록 중 오류:', error));
        }
    };

    // 고객 삭제 처리 함수
    const handleDeleteCustomer = () => {
        window.confirmCustom("정말 삭제하시겠습니까?").then(result => {
            if (result) {
                axios
                    .delete(`/api/customer/delete/${selectedCustomer.customerNo}`)
                    .then(() => {
                        // 해당 고객의 customerDeleteYn을 'Y'로 변경
                        setCustomers(
                            customers.map((c) =>
                                c.customerNo === selectedCustomer.customerNo
                                    ? {
                                        ...c,
                                        customerDeleteYn: 'Y',
                                        customerDeleteDate: new Date().toISOString(),
                                    }
                                    : c
                            )
                        );
                        setFilterType('deleted'); // 상태를 'deleted'로 변경하여 삭제된 항목을 바로 표시
                        window.showToast('삭제 되었습니다.'); // 삭제 완료 메시지
                        setShowDetailModal(false);
                    })
                    .catch((error) => console.error('고객 삭제 중 오류:', error));
            }
        });
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
                                <label className={`label_floating ${filter ? 'active' : ''}`}>고객사, 사업자 등록번호, 국가코드, 담당자명 입력</label>
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
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
                            <div className="radio_box">
                                <span>상태</span>
                                <input
                                    type="radio"
                                    id="all"
                                    name="filterType"
                                    value="all"
                                    checked={filterType === 'all'}
                                    onChange={showAllCustomers}
                                />
                                <label htmlFor="all">전체</label>
                                <input
                                    type="radio"
                                    id="active"
                                    name="filterType"
                                    value="active"
                                    checked={filterType === 'active'}
                                    onChange={showActiveCustomers}
                                />
                                <label htmlFor="active">정상</label>
                                <input
                                    type="radio"
                                    id="deleted"
                                    name="filterType"
                                    value="deleted"
                                    checked={filterType === 'deleted'}
                                    onChange={showDeletedCustomers}
                                />
                                <label htmlFor="deleted">삭제</label>
                            </div>
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
                                        <label className="chkbox_label">
                                            <input
                                                type="checkbox"
                                                className="chkbox"
                                                onChange={(e) => setSelectedCustomers(e.target.checked ? filteredCustomers.map(c => c.customerNo) : [])}
                                            />
                                            <i className="chkbox_icon">
                                                <i className="bi bi-check-lg"></i>
                                            </i>
                                        </label>
                                    </th>
                                    <th>번호</th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerName' ? 'active' : ''}`}>
                                            <span>고객사</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerName')}>
                                                <i className={`bi ${sortColumn === 'customerName' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerBusinessRegNo' ? 'active' : ''}`}>
                                            <span>사업자 등록번호</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerBusinessRegNo')}>
                                                <i className={`bi ${sortColumn === 'customerBusinessRegNo' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerCountryCode' ? 'active' : ''}`}>
                                            <span>국가코드</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerCountryCode')}>
                                                <i className={`bi ${sortColumn === 'customerCountryCode' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerManagerName' ? 'active' : ''}`}>
                                            <span>담당자명</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerManagerName')}>
                                                <i className={`bi ${sortColumn === 'customerManagerName' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerInsertDate' ? 'active' : ''}`}>
                                            <span>등록일시</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerInsertDate')}>
                                                <i className={`bi ${sortColumn === 'customerInsertDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerUpdateDate' ? 'active' : ''}`}>
                                            <span>수정일시</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerUpdateDate')}>
                                                <i className={`bi ${sortColumn === 'customerUpdateDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`order_wrap ${sortColumn === 'customerDeleteDate' ? 'active' : ''}`}>
                                            <span>삭제일시</span>
                                            <button className="btn_order" onClick={() => sortCustomers('customerDeleteDate')}>
                                                <i className={`bi ${sortColumn === 'customerDeleteDate' ? (sortOrder === 'desc' ? 'bi-arrow-down' : 'bi-arrow-up') : 'bi-arrow-up'}`}></i>
                                            </button>
                                        </div>
                                    </th>
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
                                ) : filteredCustomers.length === 0 ? (
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
                                    filteredCustomers
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map((customer, index) => (
                                            <tr key={customer.customerNo}
                                                className={
                                                    selectedCustomers.includes(customer.customerNo)
                                                        ? ('selected_row')  // 선택된 행
                                                        : ''
                                                }
                                            >
                                                <td>
                                                    {/* 삭제된 상태에 따라 조건부 렌더링 */}
                                                    {customer.customerDeleteYn !== 'Y' ? (
                                                        <label className="chkbox_label">
                                                            <input
                                                                type="checkbox"
                                                                className="chkbox"
                                                                checked={selectedCustomers.includes(customer.customerNo)}
                                                                onChange={() => handleSelectCustomer(customer.customerNo)}
                                                            />
                                                            <i className="chkbox_icon">
                                                                <i className="bi bi-check-lg"></i>
                                                            </i>
                                                        </label>
                                                    ) : (
                                                        <span className="label_del">삭제</span>
                                                    )}
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
                                                    <div className="btn_group">
                                                        <button className="box small" onClick={() => openDetailModal(customer)}>상세보기</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="pagination-container">
                    <div className="pagination-sub left">
                        <button className="box" onClick={handleDeleteAll}><i className="bi bi-trash3"></i> 선택 삭제</button>
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