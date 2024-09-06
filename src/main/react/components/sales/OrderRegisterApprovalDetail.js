import React, {useState} from 'react'; //어느 컴포넌트이든 React임포트가 필요합니다.
import ReactDOM from 'react-dom/client'; //root에 리액트 돔방식으로 렌더링시 필요합니다.
import '../../Main.css' //css파일 임포트
import Layout from "../../layout/Layout";
import {BrowserRouter} from "react-router-dom"; //css파일 임포트
import '../../../resources/static/css/OrderRegisterApprovalDetail.css'; // CSS 모듈 임포트


function OrderRegisterApprovalDetail() {

    return (
        <>
            <h1>내역보기화면</h1>
        </>

    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderRegisterApprovalDetail/>
    </BrowserRouter>
);