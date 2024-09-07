import React, { useState, useEffect } from 'react';
import '../../resources/static/css/Sidebar.css';
import {useLocation} from "react-router-dom"; // 스타일을 위한 CSS 파일

function Sidebar({ currentMenu }) {
    const [activeMenu, setActiveMenu] = useState(() => localStorage.getItem('activeMenu') || null);
    //     로컬 스토리지에서 getItem으로 activeMenu 값을 가져와요 (sidemenu 값 저장)
    const [activeSubMenu, setActiveSubMenu] = useState(() => {  // 서브 메뉴에 대한 useState
        const path = window.location.pathname;
        return path.split('/').pop();
    });

    const [user, setUser] = useState(null);  // 사용자 정보 넘기는 변수 지정 (useState)
    const location = useLocation(); // 현재 경로를 가져오는 useLocation

    const handleMenuClick = (menu) => {
        // 메뉴 클릭 시 상태
        const newActiveMenu = activeMenu === menu ? null : menu;
        // activeMenu === menu 라면 null 값 아니면 새로운 menu.
        setActiveMenu(newActiveMenu); // 위 메뉴값 가져와서 저장
        setActiveSubMenu(null); //서브메뉴 값은 null
        localStorage.setItem('activeMenu', newActiveMenu);
    };

    const handleSubMenuClick = (subMenu, path) => {
        setActiveSubMenu(subMenu);
        window.location.href = path; // 페이지 이동
    }; //서브메뉴 설정값

    // 페이지가 처음 로드될 때 localStorage에서 상태를 읽어옴 !
    useEffect(() => {
        const savedMenu = localStorage.getItem('activeMenu');
        if (savedMenu) {
            setActiveMenu(savedMenu);
        }
    }, []);

    // 경로가 변경될 때 사이드바 상태를 초기화
    useEffect(() => {
        if (location.pathname === '/main') { // 메인 페이지로 이동할 때
            setActiveMenu(null);
            setActiveSubMenu(null); //전부 null
            localStorage.removeItem('activeMenu'); //activemenu값 삭제
        }
    }, [location.pathname]);




    // 사용자 정보를 서버에서 가져오는 useEffect ((info 세션))
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
                                IKEA 광명점 ({user.department})<br/>
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
                <li className={activeMenu === 'hr' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuClick('hr')}
                       className={activeMenu === 'hr' ? 'active' : ''}>인사관리</a>
                    {activeMenu === 'hr' && (
                        <ul className="submenu">
                            <li className={activeSubMenu === 'newHireManagement' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('newHireManagement', '/newHireManagement')}>신입
                                    관리</a>
                            </li>
                            <li className={activeSubMenu === 'mentorManagement' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('mentorManagement', '/mentorManagement')}>사수
                                    관리</a>
                            </li>
                            <li className={activeSubMenu === 'salarySetting' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('salarySetting', '/salarySetting')}>연봉
                                    책정</a>
                            </li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
                <li className={activeMenu === 'sales' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuClick('sales')}
                       className={activeMenu === 'sales' ? 'active' : ''}>영업관리</a>
                    {activeMenu === 'sales' && (
                        <ul className="submenu">
                            <li className={activeSubMenu === 'orderRegister' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('orderRegister', '/orderRegister')}>주문
                                    등록</a>
                            </li>
                            <li className={activeSubMenu === 'orderListAll' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('orderListAll', '/orderListAll')}>전체 주문
                                    목록</a>
                            </li>
                            <li className={activeSubMenu === 'orderListAssigned' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('orderListAssigned', '/orderListAssigned')}>담당 주문
                                    목록</a>
                            </li>
                            <li className={activeSubMenu === 'orderRegisterApproval' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('orderRegisterApproval', '/orderRegisterApproval')}>주문
                                    등록 승인</a>
                            </li>
                            <li className={activeSubMenu === 'orderReport' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('orderReport', '/orderReport')}>영업 실적
                                    보고서</a>
                            </li>
                        </ul>
                    )}
                </li>
                <li className={activeMenu === 'customer' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuClick('customer')}
                       className={activeMenu === 'customer' ? 'active' : ''}>고객관리</a>
                    {activeMenu === 'customer' && (
                        <ul className="submenu">
                            <li className={activeSubMenu === 'customerManagement' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('customerManagement', '/customerManagement')}>고객관리</a>
                            </li>
                            <li className={activeSubMenu === 'customerRequest' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('customerRequest', '/customerRequest')}>고객요청</a>
                            </li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
                <li className={activeMenu === 'product' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuClick('product')}
                       className={activeMenu === 'product' ? 'active' : ''}>상품관리</a>
                    {activeMenu === 'product' && (
                        <ul className="submenu">
                            <li className={activeSubMenu === 'productList' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('productList', '/productList')}>전체 상품
                                    목록</a>
                            </li>
                            <li className={activeSubMenu === 'itemManagement' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('itemManagement', '/itemManagement')}>품목
                                    관리</a>
                            </li>
                            <li className={activeSubMenu === 'inventoryManagement' ? 'active' : ''}>
                                <a href="#"
                                   onClick={() => handleSubMenuClick('inventoryManagement', '/inventoryManagement')}>상품
                                    재고 관리</a>
                            </li>
                            <li className={activeSubMenu === 'priceManagement' ? 'active' : ''}>
                                <a href="#" onClick={() => handleSubMenuClick('priceManagement', '/priceManagement')}>상품
                                    가격 관리</a>
                            </li>
                            {/* 필요한 만큼 추가 */}
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
