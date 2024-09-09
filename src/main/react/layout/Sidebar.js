import React, {useState, useEffect} from 'react';
import '../../resources/static/css/Sidebar.css';
import {useLocation} from "react-router-dom";

function Sidebar({currentMenu}) {
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
                <li className={activeMenu === 'sales' ? 'active' : ''}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleMenuClick('sales')
                    }}
                       className={activeMenu === 'sales' ? 'active' : ''}>영업관리 <span className="menu-icon"><i className="bi bi-chevron-down"></i></span></a>
                    <ul className="submenu">
                        <li className={currentMenu === 'order' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('order', '/order')}>주문 등록</a>
                        </li>
                        <li className={currentMenu === 'orderList_admin' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('orderList', '/orderList?role=admin')}>전체 주문 목록</a>
                        </li>
                        <li className={currentMenu === 'orderList_staff' || currentMenu === 'orderList_manager' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('orderList', '/orderList?role=staff')}>담당 주문 목록</a>
                        </li>
                        <li className={currentMenu === 'orderRegisterApproval' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('orderRegisterApproval', '/orderRegisterApproval')}>주문 등록 승인</a>
                        </li>
                        <li className={currentMenu === 'orderReport' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('orderReport', '/orderReport')}>영업 실적 보고서</a>
                        </li>
                    </ul>
                </li>
                <li className={activeMenu === 'product' ? 'active' : ''}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleMenuClick('product')
                    }}
                       className={activeMenu === 'product' ? 'active' : ''}>상품관리 <span className="menu-icon"><i className="bi bi-chevron-down"></i></span></a>
                    <ul className="submenu">
                        <li className={currentMenu === 'productList' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productList', '/productList')}>전체 상품 목록</a>
                        </li>
                        <li className={currentMenu === 'product' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('product', '/product')}>상품 등록</a>
                        </li>
                        <li className={currentMenu === 'productPrice' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('productPrice', '/productPrice')}>상품 가격 관리</a>
                        </li>
                        <li className={currentMenu === 'productCategory' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productCategory', '/productCategory')}>상품 카테고리 관리</a>
                        </li>
                    </ul>
                </li>
                <li className={activeMenu === 'customer' ? 'active' : ''}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleMenuClick('customer')
                    }}
                       className={activeMenu === 'customer' ? 'active' : ''}>고객관리 <span className="menu-icon"><i className="bi bi-chevron-down"></i></span></a>
                    <ul className="submenu">
                        <li className={currentMenu === 'customerList' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('customerList', '/customerList')}>고객사 목록</a>
                        </li>
                        <li className={currentMenu === 'customer' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('customer', '/customer')}>고객사 등록</a>
                        </li>
                    </ul>
                </li>
                <li className={activeMenu === 'hr' ? 'active' : ''}>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleMenuClick('hr')
                    }}
                       className={activeMenu === 'hr' ? 'active' : ''}>인사관리 <span className="menu-icon"><i className="bi bi-chevron-down"></i></span></a>
                    <ul className="submenu">
                        <li className={currentMenu === 'employeeList' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('employeeList', '/employeeList')}>직원 목록</a>
                        </li>
                        <li className={currentMenu === 'employee' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('employee', '/employee')}>직원 등록</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
