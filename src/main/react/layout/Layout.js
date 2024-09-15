// src/main/react/components/Layout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../resources/static/css/common/Layout.css';

function Layout({currentMenu, children}) {

    return (
        <div className="container">
            <Header/>
            <div className="main-container">
                <Sidebar currentMenu={currentMenu}/>
                {children}
            </div>
        </div>
    );
}

export default Layout;
