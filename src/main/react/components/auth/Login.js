import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../Main.css';
import { BrowserRouter } from "react-router-dom";
import '../../../resources/static/css/Login.css';
import authImage from '../../../resources/static/img/auth.jpg';

function Login() {
    return (
        <div className="login-container" style={{ backgroundImage: `url(${authImage})` }}>
            <div className="login-box">
                <div className="login-header">
                    <img src="/img/ikea.png" alt="IKEA 로고" className="logo" />
                    <h1>IKEA ERP 관리자 시스템</h1>
                </div>
                <form className="login-form">
                    <div className="input-group">
                        <label htmlFor="id">ID</label>
                        <input type="text" id="id" placeholder="아이디를 입력하세요" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="pw">PW</label>
                        <input type="password" id="pw" placeholder="비밀번호를 입력하세요" required />
                    </div>
                    <button type="submit" className="login-btn">로그인</button>
                </form>
                <div className="login-footer">
                    <a href="#"> 비밀번호 초기화 </a> |
                    <a href="#"> 2단계 인증 안내 </a>
                    <p>본 시스템은 IKEA의 자산으로 인가된 사용자만 접근 가능합니다.</p>
                    <p>COPYRIGHT © IKEA. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Login />
    </BrowserRouter>
);
