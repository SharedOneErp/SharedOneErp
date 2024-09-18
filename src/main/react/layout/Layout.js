// src/main/react/layout/Layout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../resources/static/css/common/Layout.css';
import Toast from '../components/common/Toast'; // 토스트 컴포넌트 임포트

function Layout({currentMenu, children}) {

    return (
        <div className="container">
            <Header/>
            <div className="main-container">
                <Sidebar currentMenu={currentMenu}/>
                {children}
                <Toast /> {/* Toast 메세지 */}
            </div>
        </div>
    );
}

export default Layout;
