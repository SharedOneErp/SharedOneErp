import React from 'react';
import '../../resources/static/css/Header.css';

function Header() {


    return (
        <header>
            <div className="header-container">
                <div className="logo">
                    <a href="/"><img src="/img/logo.png" alt="IKEA Logo"/></a>
                </div>
                <div className="header-right">
                    <div className="notifications">
                        <img className="bell-icon" src="/img/bell.png"/>
                    </div>
                    <div className="profile">
                        <span className="teamname">IKEA 광명점 (영업팀)</span>
                        <p><span className="profile-username">한정우</span></p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
