import React, { useEffect, useState } from 'react';
import '../../../resources/static/css/product/ProductDetailModal.css';
import { formatDate } from '../../util/dateUtils';
import PropTypes from "prop-types";
import axios from "axios";

function ProductDetailModal({ productCd, onClose }) { // 파라미터 구조 분해 할당
    const [productDetail, setProductDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (productCd) {
            setIsLoading(true); // 로딩 시작
            axios.get(`/api/products/productDetail/${productCd}`)
                .then(response => {
                    console.log('요청 데이터:', response.data);
                    setProductDetail(response.data);
                })
                .catch(error => console.error('상세 정보 조회 실패', error))
                .finally(() => setIsLoading(false)); // 로딩 완료
        }
    }, [productCd]);

    const detail = productDetail[0] || {};

    // 🟢 모달 배경 클릭 시 창 닫기
    const handleBackgroundClick = (e) => {
        if (e.target.className === 'modal_overlay') {
            onClose();
        }
    };

    return (
        <div className="modal_overlay" onMouseDown={handleBackgroundClick}>
            <div className="modal_container search">
                <div className="header">
                    <div>상품 납품 내역</div>
                    <button className="btn_close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
                    {/* 모달 닫기 버튼 */}
                </div>

                {isLoading ? (
                    <tr className="tr_empty">
                        <td colSpan="10">
                            <div className="loading">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </td>
                    </tr>
                ) : (
                    <div className="product-detail-container">
                        <div className="form-group">
                            <label htmlFor="productName"><span className="detail-name"> 상품명 </span></label>
                            <input type="text" className="box" id="productName" value={detail.productNm || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="productCode"><sapn className="detail-name"> 상품코드 </sapn></label>
                            <input type="text" className="box" id="productCode" value={detail.productCd || ''} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category"><span className="detail-name"> 카테고리 </span></label>
                            <div className="category-inputs">
                                <span className="category-item top">{detail.topCategory || ''}</span>
                                <span className="category-item middle">{detail.middleCategory || ''}</span>
                                <span className="category-item low">{detail.lowCategory || ''}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="registrationDate" className="detail-name"><span>등록일시</span></label>
                            <input type="text" className="box" id="registrationDate"
                                value={detail.productInsertDate ? formatDate(detail.productInsertDate) : ''}
                                readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="updateDate"><span className="detail-name">수정일시</span></label>
                            <input type="text" className="box" id="updateDate"
                                value={detail.productUpdateDate ? formatDate(detail.productUpdateDate) : ''}
                                readOnly />
                        </div>
                        <div className="table_wrap1">
                            <table>
                                <thead>
                                    <tr>
                                        <th>납품일자</th>
                                        <th>거래처</th>
                                        <th>수량</th>
                                        <th>납품가(원)</th>
                                        <th>총매출액(원)</th>
                                        <th>담당자</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productDetail.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.orderDDeliveryRequestDate ? detail.orderDDeliveryRequestDate.substring(0, 10) : ''}</td>
                                            <td>{detail.customerName || ''}</td>
                                            <td>{detail.orderDQty || ''}</td>
                                            <td>{detail.orderDPrice ? detail.orderDPrice.toLocaleString() : ''}</td>
                                            <td>{detail.orderDTotalPrice ? detail.orderDTotalPrice.toLocaleString() : ''}</td>
                                            <td>{detail.employeeName || ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p style={{ fontSize: '14px', color: '#777' }}>
                            ※ 납품 내역은 최근 5건까지 표시됩니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

ProductDetailModal.propTypes = { // prop type 유효성 검사
    productCd: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ProductDetailModal;
