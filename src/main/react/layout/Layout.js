// src/main/react/components/Layout.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../../resources/static/css/Layout.css';

function Layout({currentMenu, children}) {

    return (
        <div className="container">
            <Header/>
            <div className="main-container">
                <Sidebar currentMenu={currentMenu}/>
                <main className={`main-content ${currentMenu === 'main' ? 'main-active' : ''}`}>
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    );
}

export default Layout;
