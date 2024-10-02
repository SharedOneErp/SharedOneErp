import React, { useState, useEffect } from 'react';
import '../../resources/static/css/common/Sidebar.css';
import { useLocation } from 'react-router-dom';

function Sidebar({ currentMenu }) {
    const [activeSubMenu, setActiveSubMenu] = useState(() => {
        const path = window.location.pathname;
        return path.split('/').pop();
    });
    const [loginTime, setLoginTime] = useState('시간 정보 없음');
    const [employee, setEmployee] = useState(null);
    const [role, setRole] = useState('');
    const location = useLocation();

    useEffect(() => {
        const storedLoginTime = localStorage.getItem('loginTime');
        setLoginTime(storedLoginTime || '시간 정보 없음');
    }, []);


    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('/api/employee', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setEmployee(data);
                    setRole(data.employeeRole);
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchEmployee();
    }, []);

    useEffect(() => {
        if (location.pathname === '/main') {
            setActiveSubMenu(null);
        }
    }, [location.pathname]);

    const handleMenuClick = (menu) => {
        setActiveSubMenu(null);
    };

    const handleSubMenuClick = (subMenu, path) => {
        setActiveSubMenu(subMenu);
        window.location.href = path;
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                window.location.href = '/login';
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
                    <div className="login-time">{loginTime}</div>
                    <button onClick={handleLogout} className="box small">로그아웃</button>
                </div>
            </div>
            <ul className={`menu ${currentMenu}`}>
                <li>
                    <span className={currentMenu.startsWith('order') ? 'active' : ''}>
                        <i className="bi bi-piggy-bank"></i>영업 관리
                    </span>
                    <ul className="submenu">
                        <li className={currentMenu === 'order' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('order', '/order')}>주문 등록</a>
                        </li>
                        <li className={currentMenu === 'orderList' ? 'active' : ''}>
                            <a href="#"
                                onClick={() => handleSubMenuClick('orderList', role === 'admin' ? '/orderList?mode=Assigned' : '/orderList')}>
                                주문 목록
                            </a>
                        </li>
                        <li className={currentMenu === 'orderReport' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('orderReport', '/orderReport')}>주문 현황 보고서</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <span className={currentMenu.startsWith('product') ? 'active' : ''}>
                        <i className="bi bi-cart-check"></i>상품 관리
                    </span>
                    <ul className="submenu">
                        <li className={currentMenu === 'productCategory' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productCategory', '/productCategory')}>상품 카테고리</a>
                        </li>
                        <li className={currentMenu === 'productList' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productList', '/productList')}>전체 상품 목록</a>
                        </li>
                        <li className={currentMenu === 'productPrice' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('productPrice', '/productPrice')}>고객사별 상품 가격</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul className="submenu one">
                        <li className={currentMenu === 'customer' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('customerList', '/customerList')}>
                                <i className="bi bi-people-fill"></i>고객 관리
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <ul className="submenu one">
                        <li className={currentMenu === 'employee' ? 'active' : ''}>
                            <a href="#" onClick={() => handleSubMenuClick('employeeList', '/employeeList')}>
                                <i className="bi bi-person-vcard"></i>직원 관리
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;