import React, { useEffect, useState } from 'react';
import '../../resources/static/css/Header.css';

function Header() {
    const [user, setUser] = useState(null); // 사용자 정보 넘기는 변수

    // 사용자 정보를 서버에서 가져오는 useEffect
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user', {
                    credentials: "include", // 세션 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <a href="/"><img src="/img/logo.png" alt="IKEA Logo"/></a>
                </div>
                <div className="header-right">
                    <div className="notifications">
                        <img className="bell-icon" src="/img/bell.png"/>
                    </div>
                    <div className="profile">
                        {user ? (
                            <>
                                <span className="teamname">IKEA 광명점 ({user.department})</span>
                                <p><span className="profile-username">{user.username}</span></p>
                            </>
                        ) : (
                            <span>LOADING</span> // 로딩 중 표시
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
