import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductList.css'; // 개별 CSS 스타일 적용

function ProductList() {

    // 상품 목록 저장 state
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products/productList')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('전체 상품 목록 조회 실패', error))
    }, []);

    return (<Layout currentMenu="productList">
            <div className="top-container">
                <h2>전체 상품 목록</h2>
            </div>
            <div className="middle-container">
                <form className="search-box-container">
                    <div style={{marginBottom: "10px"}}>
                        <span style={{marginRight: "5px"}}>카테고리 </span>
                        <select className="approval-select">
                            <option>대분류</option>
                        </select>
                        <select className="approval-select">
                            <option>중분류</option>
                        </select>
                        <select className="approval-select">
                            <option>소분류</option>
                        </select>
                    </div>
                    <div>
                        <select className="approval-select">
                            <option>상품명</option>
                        </select>
                        <input type="text" className="search-box" placeholder="검색어를 입력하세요"></input>
                        <button type="submit" className="search-button">검색</button>
                    </div>
                </form>
            </div>
            <div className="bottom-container">
                <label>
                    <p>전체 {products.length}건 페이지 당:</p>
                    <select>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </label>
                <table className="approval-list">
                    <thead>
                    <tr>
                        <th>선택</th>
                        <th>주문번호</th>
                        <th>거래처</th>
                        <th>물품</th>
                        <th>총액(원)</th>
                        <th>납품 요청일</th>
                        <th>주문 등록일</th>
                        <th>담당자</th>
                        <th>주문 상태</th>
                        <th>상세보기</th>
                    </tr>
                    </thead>
                    <tbody className="approval-list-content">
                        {products.map((product) => (
                            <tr>
                                <td><input type="checkbox"/></td>
                                <td></td>
                                <td>삼성</td>
                                <td>책장 외 1건</td>
                                <td>2555,999</td>
                                <td>2024-12-30</td>
                                <td>2024-9-8</td>
                                <td>김세종</td>
                                <td>결재중</td>
                                <td><a href="/productDetail">상세보기</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="approval-page">
                    <button className="approval-page1">1</button>
                    <button className="approval-page2">2</button>
                    <button className="approval-page3">3</button>
                    <button className="approval-page4">4</button>
                    <button className="approval-page5">5</button>
                </div>
            </div>

        </Layout>

    )
}

//페이지 root가 되는 JS는 root에 삽입되도록 처리
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BrowserRouter>
    <ProductList/>
</BrowserRouter>);