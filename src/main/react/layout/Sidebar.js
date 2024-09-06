import React, { useState, useEffect } from 'react';
import '../../resources/static/css/Sidebar.css'; // 스타일을 위한 CSS 파일

function Sidebar({ currentMenu }) {
    // 상태를 초기화할 때 localStorage에서 값을 가져옴 ! (sidemenu 값 저장)
    const [activeMenu, setActiveMenu] = useState(() => {
        return localStorage.getItem('activeMenu') || null;
    });
    const [user, setUser] = useState(null); // 사용자 정보 넘기는 변수

    // 메뉴 클릭 시 상태를 업데이트하고 localStorage에 저장
    const handleMenuClick = (menu) => {
        const newActiveMenu = activeMenu === menu ? null : menu;
        setActiveMenu(newActiveMenu);
        localStorage.setItem('activeMenu', newActiveMenu);
    };

    // 페이지가 처음 로드될 때 localStorage에서 상태를 읽어옴 !
    useEffect(() => {
        const savedMenu = localStorage.getItem('activeMenu');
        if (savedMenu) {
            setActiveMenu(savedMenu);
        }
    }, []);

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

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST', // POST 메서드
                credentials: 'include', // 세션을 포함하는 credentials !
            });
            if (response.ok) {
                window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 리디렉션
            } else {
                console.error('로그아웃 실패');
            }
        } catch (error) {
            console.error('로그아웃 에러 발생:', error);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="user-info">
                    <div className="user-name">

                        {user ? (
                            <>
                                IKEA 광명점 ({user.department})<br />
                                팀장 {user.username}
                            </>
                        ) : (
                            'LOADING'
                        )}
                    </div>
                    <div className="login-time">2024-09-05 13:54:06</div>
                    <button onClick={handleLogout} className="logout-button">로그아웃</button>
                </div>
            </div>
            <ul className="menu">
                <li>
                    <a href="#" onClick={() => handleMenuClick('hr')}>인사관리</a>
                    {activeMenu === 'hr' && (
                        <ul className="submenu">
                            <li><a href="#">신입 관리</a></li>
                            <li><a href="#">사수 관리</a></li>
                            <li><a href="#">연봉 책정</a></li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
                <li>
                    <a href="#" onClick={() => handleMenuClick('sales')}>영업관리</a>
                    {activeMenu === 'sales' && (
                        <ul className="submenu">
                            <li className={currentMenu === 'orderRegister' ? 'active' : ''}><a href="/orderRegister">주문 등록</a></li>
                            <li className={currentMenu === 'orderListAll' ? 'active' : ''}><a href="/orderListAll">전체 주문 목록</a></li>
                            <li className={currentMenu === 'orderListAssigned' ? 'active' : ''}><a href="/orderListAssigned">담당 주문 목록</a></li>
                            <li className={currentMenu === 'orderRegisterApproval' ? 'active' : ''}><a href="/orderRegisterApproval">주문 등록 승인</a></li>
                            <li className={currentMenu === 'orderReport' ? 'active' : ''}><a href="/orderReport">영업 실적 보고서</a></li>
                        </ul>
                    )}
                </li>
                <li>
                    <a href="#" onClick={() => handleMenuClick('customer')}>고객관리</a>
                    {activeMenu === 'customer' && (
                        <ul className="submenu">
                            <li><a href="#">고객관리</a></li>
                            <li><a href="#">고객요청</a></li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
                <li>
                    <a href="#" onClick={() => handleMenuClick('product')}>상품관리</a>
                    {activeMenu === 'product' && (
                        <ul className="submenu">
                            <li className={currentMenu === 'productList' ? 'active' : ''}><a href="/ProductList">전체 상품 목록</a></li>
                            <li><a href="#">품목 관리</a></li>
                            <li><a href="#">상품 재고 관리</a></li>
                            <li><a href="#">상품 가격 관리</a></li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
