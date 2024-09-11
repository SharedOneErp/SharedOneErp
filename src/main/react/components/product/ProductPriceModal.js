// src/components/product/ProductPriceModal.js
import React, { useState } from 'react';
import axios from 'axios';

// 상품 검색 모달 컴포넌트
const ProductPriceModal = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [results, setResults] = useState([]); // 검색 결과 상태

    // 상품 검색 API 호출 함수
    const handleSearch = async (e) => {
        e.preventDefault(); // 기본 동작 방지
        try {
            // 예시 API 호출로 검색어에 따라 상품 목록을 가져옴
            const response = await axios.get(`/api/products/search?productCd=${searchCode}&productNm=${searchQuery}`);
            setResults(response.data); // 검색 결과 업데이트
        } catch (error) {
            console.error('상품 검색 중 오류 발생:', error);
        }
    };

    // 상품 선택 시 호출되는 함수
    const handleSelect = (item) => {
        onSelect(item); // 부모 컴포넌트로 선택된 상품 전달
        onClose(); // 모달 닫기
    };

    if (!isOpen) return null; // 모달이 열려 있지 않으면 렌더링하지 않음

    return (
        <div className="modal"> {/* 모달 창 */}
            <div className="modal-content">
                <h2>상품 검색</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="상품 이름을 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
                    />
                    <button type="submit">검색</button> {/* 검색 버튼 */}
                </form>
                <ul>
                    {results.map((item) => (
                        <li key={item.id} onClick={() => handleSelect(item)}>
                            {item.name} {/* 검색된 상품 목록 */}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>닫기</button> {/* 모달 닫기 버튼 */}
            </div>
        </div>
    );
};

export default ProductPriceModal;
