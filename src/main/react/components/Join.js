import React from "react";
import ReactDOM from 'react-dom/client';
import {BrowserRouter, useSearchParams} from "react-router-dom";
import "../../resources/static/css/Join.css";


function Join() {


    const [searchParams, setSearchParams] = useSearchParams(); // 쿼리 스트링을 searchParams 형태로 가져오고
    const age = searchParams.get('age'); //
    console.log(age)


    return (
        <div id="container">

            <div className="bodytext_area box_inner">
                <div className="titlebox">

                    <a href={"/main.do?user=홍길동"}>IKEA 회원가입</a>
                </div>

                <form action="#" className="appForm">
                    <fieldset>
                        <legend>상담문의 입력 양식</legend>
                        <p className="info_pilsoo pilsoo_item">필수입력</p>
                        <ul className="app_list">
                            <li className="clear">
                                <label htmlFor="email_lbl" className="tit_lbl pilsoo_item">아이디</label>
                                <div className="app_content email_area">
                                    <input type="text" className="w160" id="email_lbl" title="아이디" placeholder="아이디"/>
                                    <input type="hidden" className="w160" id="auth" value="#######"/>
                                    <span className="valid">메시지영역</span>
                                </div>
                            </li>
                            <li className="clear">
                                <label htmlFor="name_lbl" className="tit_lbl pilsoo_item">이름</label>
                                <div className="app_content">
                                    <input type="text" className="w160p" id="name_lbl" placeholder="이름을 입력해주세요"/>
                                    <span className="valid">메시지영역</span>
                                </div>
                            </li>
                            <li className="clear">
                                <label htmlFor="pwd_lbl" className="tit_lbl pilsoo_item">비밀번호</label>
                                <div className="app_content">
                                    <input type="password" className="w100p" id="pwd_lbl" placeholder="비밀번호를 입력해주세요"/>
                                    <span className="valid">메시지영역</span>

                                </div>
                            </li>
                            <li className="clear">
                                <label htmlFor="pwd2_lbl" className="tit_lbl pilsoo_item">비밀번호 확인</label>
                                <div className="app_content">
                                    <input type="password" className="w100p" id="pwd2_lbl"
                                           placeholder="비밀번호를 다시 한번 입력해주세요"/>
                                    <span className="valid">메시지영역</span>

                                </div>
                            </li>

                            <li className="clear">
                                <label htmlFor="phone_lbl" className="tit_lbl pilsoo_item">연락처</label>
                                <div className="app_content" style={{overflow: "hidden"}}>
                                    <input type="tel" className="left" id="phone_lbl" placeholder="휴대폰”-”없이 숫자만 입력하세요"/>
                                    <button type="button" className="apiBtn left">API본인인증</button>
                                    <span className="valid">메시지영역</span>
                                </div>

                            </li>

                            <li className="clear">
                                <span className="tit_lbl">SNS 활용동의</span>
                                <div className="app_content checkbox_area">
                                    <input type="radio" className="css-checkbox" name="####" id="agree_1" /><label htmlFor="agree_1">동의함(필수)</label>
                                    <input type="radio" className="css-checkbox" name="####" id="agree_2"/><label
                                    htmlFor="agree_2">동의하지않음</label>
                                </div>
                            </li>
                            <li>
                                <button type="button" className="loginBtn">회원가입</button>

                            </li>

                        </ul>
                        <div className="findInfo">
                            <ul>
                                <li className="left">
                                    <a href="#">아이디찾기</a>
                                    <a href="#">비밀번호찾기</a>
                                </li>
                                <li className="right">
                                    <a href="#">로그인</a>
                                </li>
                            </ul>
                        </div>
                    </fieldset>
                </form>

            </div>


        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Join/>
    </BrowserRouter>
);