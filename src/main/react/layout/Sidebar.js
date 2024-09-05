import React, { useState } from 'react';
import '../../resources/static/css/Sidebar.css'; // 스타일을 위한 CSS 파일

function Sidebar() {
    const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuClick = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <aside className="sidebar">
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
                            <li><a href="/orderRegister">주문 등록</a></li>
                            <li><a href="/orderListAll">전체 주문 목록</a></li>
                            <li><a href="/orderListAssigned">담당 주문 목록</a></li>
                            <li><a href="/orderRegisterApproval">주문 등록 승인</a></li>
                            <li><a href="/orderReport">영업 실적 보고서</a></li>
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
