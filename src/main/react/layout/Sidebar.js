import React, { useState, useEffect } from 'react';
import '../../resources/static/css/Sidebar.css'; // 스타일을 위한 CSS 파일

function Sidebar() {
    // 상태를 초기화할 때 localStorage에서 값을 가져옵니다.
    const [activeMenu, setActiveMenu] = useState(() => {
        return localStorage.getItem('activeMenu') || null;
    });

    // 메뉴 클릭 시 상태를 업데이트하고 localStorage에 저장합니다.
    const handleMenuClick = (menu) => {
        const newActiveMenu = activeMenu === menu ? null : menu;
        setActiveMenu(newActiveMenu);
        localStorage.setItem('activeMenu', newActiveMenu);
    };

    useEffect(() => {
        // 페이지가 처음 로드될 때 localStorage에서 상태를 읽어옵니다.
        const savedMenu = localStorage.getItem('activeMenu');
        if (savedMenu) {
            setActiveMenu(savedMenu);
        }
    }, []);

    return (
        <aside className="sidebar" >
            <div className="sidebar-top">
                <div className="user-info">
                    <div className="user-name">
                        IKEA 광명점 (영업팀)<br/>
                        팀장 한정우
                    </div>
                    <div className="login-time">2024-09-05 13:54:06</div>
                    <a href="/login" className="logout-button">로그아웃</a>
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
                            <li><a href="#">상품관리</a></li>
                            <li><a href="#">상품요청</a></li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
