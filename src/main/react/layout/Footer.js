import React from 'react';
import '../../resources/static/css/common/Footer.css';

function Footer() {

    return (
        <footer>
            <div className="container-footer">
                <div className="info-area">
                    <ul>
                        <li>
                            <a href="#">공지사항</a>
                        </li>
                        <li>
                            <a href="#">인사관리</a>
                        </li>
                        <li>
                            <a href="#">영업관리</a>
                        </li>
                        <li>
                            <a href="#">상품관리</a>
                        </li>
                        <li>
                            <a href="#">이용약관</a>
                        </li>
                    </ul>
                </div>
                <div className="copyright-area">
                    <p>(주) IKEA Erpre Coperation | 대표: EREP:RE | 서울특별시 강남구 반포동 112-119 | 대표전화: 02-1234-5678</p>
                    <p>사업자등록번호: 123-45-67890 | 통신판매업신고번호: 제1234-5678호 | 개인정보보호책임자: 한정우</p>
                </div>
                <span className="copyright">Copyright 2024 IKEA© All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
