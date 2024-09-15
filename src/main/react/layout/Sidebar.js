import React, {useState, useEffect} from 'react';
import '../../resources/static/css/common/Sidebar.css';
import {useLocation} from "react-router-dom";

function Sidebar({currentMenu}) {

    const [activeSubMenu, setActiveSubMenu] = useState(() => {  // 서브 메뉴에 대한 useState
        const path = window.location.pathname;
        return path.split('/').pop();
    });

    const location = useLocation(); // 현재 경로를 가져오는 useLocation
    const [employee, setEmployee] = useState(null); // 사용자 정보 넘기는 변수

    // 사용자 정보를 서버에서 가져오는 useEffect
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('/api/employee', {
                    credentials: "include", // 세션 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmployee(data);
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchEmployee();
    }, []);

    const handleMenuClick = (menu) => {
        // 메뉴 클릭 시 상태
        setActiveSubMenu(null); // 서브메뉴 값은 null로 설정
    };

    const handleSubMenuClick = (subMenu, path) => {
        setActiveSubMenu(subMenu);
        window.location.href = path; // 페이지 이동
    }; //서브메뉴 설정값

    // 경로가 변경될 때 사이드바 상태를 초기화
    useEffect(() => {
        if (location.pathname === '/main') { // 메인 페이지로 이동할 때
            setActiveSubMenu(null); // 전부 null
        }
    }, [location.pathname]);

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
                        {employee ? (
                            <>
                                {employee.employeeName} ({employee.employeeRole.toUpperCase()})
                            </>
                        ) : (
                            'LOADING'
                        )}
                    </div>
                    <div className="login-time">2024-09-05 13:54:06</div>
                    <button onClick={handleLogout} className="box small">로그아웃</button>
                </div>
            </div>
            <ul className={`menu ${currentMenu}`}>
                <li>
                    <span className={currentMenu.startsWith('order') ? 'active' : ''}><i className="bi bi-piggy-bank"></i>영업 관리</span>
                    <ul className="submenu">
                        <li className={currentMenu === 'order' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('order', '/order')}>주문 등록</a>
                        </li>
                        <li className={currentMenu === 'orderList' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('orderList', '/orderList')}>주문 목록</a>
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
                <li>
                    <span className={currentMenu.startsWith('product') ? 'active' : ''}><i className="bi bi-cart-check"></i>상품 관리</span>
                    <ul className="submenu">
                        <li className={currentMenu === 'productList' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productList', '/productList')}>상품 목록</a>
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
                <li>
                    <ul className="submenu one">
                        <li className={currentMenu === 'customer' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('customerList', '/customerList')}><i className="bi bi-people-fill"></i>고객 관리</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul className="submenu one">
                        <li className={currentMenu === 'employee' ? 'active' : ''}>
                            <a href="#"
                               onClick={() => handleSubMenuClick('employeeList', '/employeeList')}><i className="bi bi-person-vcard"></i>직원 관리</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
