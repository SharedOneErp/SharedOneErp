import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import { useForm } from 'react-hook-form';
import '../../../resources/static/css/Main.css';
import Layout from "../../layout/Layout";
import {BrowserRouter} from "react-router-dom";
import '../../../resources/static/css/customer/Customer.css';
import CalendarIcon from '../../../resources/static/img/calendar.png';
import SearchIcon from '../../../resources/static/img/search.png';

function Customer() {

    const { register, handleSubmit, formState: { errors } } = useForm();
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const onSubmit = (data) => console.log(data);

    return (
        <Layout currentMenu="customer">

            <h1>고객사 등록</h1>

            <div className="layout-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-container">
                        <div className="left-column">

                            <div className="form-group">
                                <label>고객사 이름</label>
                                <input type="text" name="customerName" value={form.customerName}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 연락처</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={form.contactNumber}
                                    onChange={handleInputChange}
                                    {...register("contactNumber", {
                                        pattern: /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/
                                    })}
                                />
                                {errors.contactNumber && <p>올바른 연락처 형식이 아닙니다.</p>}
                            </div>
                            <div className="form-group">
                                <label>대표자명</label>
                                <input type="text" name="representativeName" value={form.representativeName}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>사업자 등록번호</label>
                                <input
                                    type="text"
                                    name="businessNumber"
                                    value={form.businessNumber}
                                    onChange={handleInputChange}
                                    {...register("businessNumber", {
                                        pattern: /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/
                                    })}
                                />
                                {errors.businessNumber && <p>올바른 사업자 등록번호 형식이 아닙니다.</p>}
                            </div>
                            <div className="form-group">
                                <label>사업장주소</label>
                                <div className="address-search">
                                    <input type="text" name="address" value={form.address}
                                           onChange={handleInputChange}/>
                                    <img src={SearchIcon} alt="돋보기"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>팩스번호</label>
                                <input
                                    type="text"
                                    name="faxNumber"
                                    value={form.faxNumber}
                                />
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자명</label>
                                <input type="text" name="managerName" value={form.managerName}
                                       onChange={handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자 이메일</label>
                                <input
                                    type="email"
                                    name="managerEmail"
                                    value={form.managerEmail}
                                    onChange={handleInputChange}
                                    {...register("managerEmail", {
                                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                                    })}
                                />
                                {errors.managerEmail && <p>올바른 이메일 형식이 아닙니다.</p>}
                            </div>
                            <div className="form-group">
                                <label>고객사 담당자 연락처</label>
                                <input
                                    type="text"
                                    name="managerContact"
                                    value={form.managerContact}
                                    onChange={handleInputChange}
                                    {...register("managerContact", {
                                        pattern: /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/
                                    })}
                                />
                                {errors.managerContact && <p>올바른 연락처 형식이 아닙니다.</p>}
                            </div>
                            <div className="form-group">
                                <label>국가코드</label>
                                <select name="countryCode" value={form.countryCode} onChange={handleInputChange}>
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
                                <select name="transactionType" value={form.transactionType}
                                        onChange={handleInputChange}>
                                    <option value="01">01.고객기업</option>
                                    <option value="02">02.협력기업</option>
                                    <option value="03">03.본사기업</option>
                                    <option value="04">04.기타기업</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>전자세금계산서 여부</label>
                                <select name="electronicTaxInvoice" value={form.electronicTaxInvoice}
                                        onChange={handleInputChange}>
                                    <option value="y">Y</option>
                                    <option value="n">N</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>거래시작일</label>
                                <div className="date-picker">
                                    <input type="date" name="transactionStart" value={form.transactionStart}
                                           onChange={handleInputChange}/>
                                    <img src={CalendarIcon} alt="달력"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>거래종료일</label>
                                <div className="date-picker">
                                    <input type="date" name="transactionEnd" value={form.transactionEnd}
                                           onChange={handleInputChange}/>
                                    <img src={CalendarIcon} alt="달력"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="submit-button">등록</button>
                </form>
            </div>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Customer />
    </BrowserRouter>
);
