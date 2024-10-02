import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import '../../../resources/static/css/common/Layout.css';
import '../../../resources/static/css/common/Login.css'; // 개별 CSS 스타일 적용

function Login() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRecaptchaScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('reCAPTCHA script loaded');
            };
            document.body.appendChild(script);
        };

        loadRecaptchaScript();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // 폼 제출 방지

        const captchaToken = window.grecaptcha.getResponse(); // CAPTCHA 토큰 가져오기
        if (!captchaToken) {
            setError('CAPTCHA를 풀어야 합니다.');
            return;
        }

        try {
            console.log('Attempting login with:', { employeeId: id, employeePw: pw }); // 디버깅용 로그

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId: id, employeePw: pw }),
                credentials: 'include'  // 쿠키를 서버에 전송
            });

            console.log('Response status:', response.status); // 디버깅용 로그

            const result = await response.json();

            if (response.ok) {
                console.log('Login successful:', result); // 디버깅용 로그
                // 현재 시간 저장
                localStorage.setItem('loginTime', new Date().toLocaleString());
                location.href = "/main";
            } else {
                console.log('Login failed:', result); // 디버깅용 로그
                setError(result.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            console.error('로그인 중 오류 발생:', err);
            setError('서버와의 연결에 실패했습니다.');
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(/img/logo_background.jpg)` }}>
            <div className="login-box">
                <div className="login-header">
                    <img src="/img/logo3.png" alt="IKEA 로고" className="logo" />
                    <h1>IKEA ERP 관리자 시스템</h1>
                </div>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="id">아이디</label>
                        <input
                            type="text"
                            id="id"
                            placeholder="아이디를 입력하세요."
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="pw">비밀번호</label>
                        <input
                            type="password"
                            id="pw"
                            placeholder="비밀번호를 입력하세요."
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="recaptcha-container">
                        <div className="g-recaptcha" data-sitekey="6Lf6TlAqAAAAAD4ezvbWZJj2TGc8_WusXNm9D2f7"></div>
                    </div>
                        <button type="submit" className="login-btn">로그인</button>
                </form>
                <div className="login-footer">
                    <a href="#">비밀번호 초기화</a> | <a href="#">2단계 인증 안내</a>
                    <p>본 시스템은 IKEA의 자산으로 인가된 사용자만 접근 가능합니다.</p>
                    <p>COPYRIGHT © IKEA. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Login />
);
