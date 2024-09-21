// src/main/react/components/price/PriceRow.js
import React from 'react';

const PriceRow = ({
    isEditMode,
    priceData,
    selectedCustomer = { customerName: '', customerNo: '' }, // 기본값 설정
    selectedProduct = { productNm: '', productCd: '' },      // 기본값 설정
    handleInputChange,
    onSave,
    onCancel,
    setCustomerModalOpen,
    setProductModalOpen
}) => {
    return (
        <tr className='tr_input'>
            <td>-</td> {/* 체크박스 칸 */}
            <td>-</td> {/* 번호 */}
            <td>
                {/* 고객사 검색 버튼 */}
                <button
                    className="box btn_search wp100"
                    onClick={() => setCustomerModalOpen(true)}>
                    {selectedCustomer.customerName}  {/* 선택된 고객사 이름 표시 */}
                    <i className="bi bi-search"></i>
                </button>
                {/* hidden input 필드에 고객 번호 저장 */}
                <input
                    type="hidden"
                    name="selectedCustomerNo"
                    value={selectedCustomer.customerNo}
                />
            </td>
            <td>
                {/* 상품 검색 버튼 */}
                <button
                    className="box btn_search wp100"
                    onClick={() => setProductModalOpen(true)}>
                    {selectedProduct.productNm}  {/* 선택된 상품 이름 표시 */}
                    <i className="bi bi-search"></i>
                </button>
                {/* hidden input 필드에 상품 코드 저장 */}
                <input
                    type="hidden"
                    name="selectedProductCd"
                    value={selectedProduct.productCd}
                />
            </td>
            <td>
                <input
                    type="number"
                    className="box wp100"
                    placeholder="가격 입력"
                    value={priceData.priceCustomer}
                    name="priceCustomer"
                    onChange={handleInputChange}
                />
            </td>
            <td>
                <div className='period_box'>
                    <input
                        type="date"
                        className="box"
                        placeholder="시작일"
                        value={priceData.priceStartDate || ''}
                        name="priceStartDate"
                        onChange={handleInputChange}
                    />
                    ~
                    <input
                        type="date"
                        className="box"
                        placeholder="종료일"
                        value={priceData.priceEndDate || ''}
                        name="priceEndDate"
                        onChange={handleInputChange}
                    />
                </div>
            </td>
            <td>-</td> {/* 등록일시 */}
            <td>-</td> {/* 수정일시 */}
            <td>-</td> {/* 삭제일시 */}
            <td>
                <div className='btn_group'>
                    {isEditMode ? (
                        <>
                            <button className="box small color_border" onClick={onSave}>수정</button>
                            <button className="box small" onClick={onCancel}>취소</button>
                        </>
                    ) : (
                        <>
                            <button className="box small color_border" onClick={onSave}>추가</button>
                            <button className="box small" onClick={onCancel}>취소</button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PriceRow;
