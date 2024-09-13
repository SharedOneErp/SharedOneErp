// ProductDetailModal.js
import React, { useEffect, useState } from 'react';
import '../../../resources/static/css/product/ProductDetailModal.css';
import { formatDate } from '../../util/dateUtils';

function ProductDetailModal({ productCd, onClose }) {
  const [productDetail, setProductDetail] = useState([]);

  useEffect(() => {
    if (productCd) {
      fetch(`/api/products/productDetail/${productCd}`)
          .then(response => response.json())
          .then(data => setProductDetail(data))
          .catch(error => console.error('상세 정보 조회 실패', error));
    }
  }, [productCd]);

  return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose} aria-label="닫기">닫기</button>
          <h1>상품 상세</h1>
          <div className="product-detail-container">
            <div className="form-group">
              <label htmlFor="productName">상품명</label>
              <input type="text" id="productName" value={productDetail[0]?.productNm || ''} readOnly/>
            </div>
            <div className="form-group">
              <label htmlFor="productCode">상품코드</label>
              <input type="text" id="productCode" value={productDetail[0]?.productCd || ''} readOnly/>
            </div>
            <div className="form-group">
              <label>카테고리</label>
              <div className="category-inputs">
                <span className="category-item">{productDetail[0]?.topCategory || ''}</span>
                <span className="category-item">{productDetail[0]?.middleCategory || ''}</span>
                <span className="category-item">{productDetail[0]?.lowCategory || ''}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="registrationDate">상품 등록일</label>
              <input type="text" id="registrationDate" value={formatDate(productDetail[0]?.productInsertDate) || ''}
                     readOnly/>
            </div>
            <div className="form-group">
              <label htmlFor="updateDate">상품 수정일</label>
              <input type="text" id="updateDate" value={formatDate(productDetail[0]?.productUpdateDate) || ''}
                     readOnly/>
            </div>
            <table className="transaction-table">
              <thead>
              <tr>
                <th>최근 납품일</th>
                <th>거래처</th>
                <th>수량</th>
                <th>매출액(원)</th>
                <th>담당자</th>
              </tr>
              </thead>
              <tbody>
              {productDetail.slice(0, 5).map((detail, index) => (
                  <tr key={index}>
                    <td>{formatDate(detail.orderDDeliveryRequestDate)}</td>
                    <td>{detail.customerName}</td>
                    <td>{detail.orderDQty}</td>
                    <td>{detail.orderDTotalPrice.toLocaleString()}</td>
                    <td>{detail.employeeName}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="modal-bottom">
            <button className="modal-close-bottom" onClick={onClose}>닫기</button>
          </div>
        </div>
      </div>
  );
}

export default ProductDetailModal;
