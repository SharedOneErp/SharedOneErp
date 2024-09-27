import React from 'react';

const ProductRow = React.memo(({
                                   isEditMode,
                                   productData,
                                   topCategory,
                                   topCategories,
                                   midCategory,
                                   midCategories,
                                   lowCategory,
                                   lowCategories,
                                   handleInputChange,
                                   onTopChange,
                                   onMidChange,
                                   onLowChange,
                                   onSave,
                                   onCancel
                               }) => {
    return (
        <tr className='tr_input'>
            <td></td>
            {/* 체크박스 칸 */}
            <td>
                <select className="box wp100"
                        name="topCategory"
                        value={topCategory}
                        onChange={onTopChange}
                >
                    <option value="">대분류 선택</option>
                    {topCategories
                        .filter((category) => category.categoryNm !== '대분류')
                        .map((category) => (
                            <option
                                key={category.categoryNo}
                                value={category.categoryNo}>{category.categoryNm}
                            </option>
                        ))}
                </select>
            </td>
            <td>
                <select className="box wp100"
                        name="midCategory"
                        value={midCategory}
                        onChange={onMidChange}
                        disabled={!topCategory}
                >
                    <option value="">중분류 선택</option>
                    {midCategories.map((category) => (
                        <option
                            key={category.categoryNo}
                            value={category.categoryNo}>{category.categoryNm}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <select className="box wp100"
                        name="lowCategory"
                        value={lowCategory}
                        onChange={onLowChange}
                        disabled={!midCategory}
                >
                    <option value="">소분류 선택</option>
                    {lowCategories.map((category) => (
                        <option
                            key={category.categoryNo}
                            value={category.categoryNo}>{category.categoryNm}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                {/* 상품코드 */}
                {isEditMode ? (
                    <span>{productData.productCd}</span>
                ) : (
                    <input
                        type="text"
                        className="box wp100"
                        placeholder="상품코드 입력"
                        value={productData.productCd}
                        name="productCd"
                        onChange={handleInputChange}
                    />
                )}
            </td>
            <td>
                {/* 상품명 */}
                <input
                    type="text"
                    className="box wp100"
                    placeholder="상품명 입력"
                    value={productData.productNm}
                    name="productNm"
                    onChange={handleInputChange}
                />
            </td>
            <td>
                {/* 상품 가격 */}
                <input
                    type="number"
                    className="box wp100"
                    placeholder="가격 입력"
                    value={productData.productPrice ? productData.productPrice : ''}
                    name="productPrice"
                    onChange={handleInputChange}
                />
            </td>
            <td></td>
            {/* 등록일시 */}
            <td></td>
            {/* 수정일시 */}
            <td></td>
            {/* 삭제일시 */}
            <td>
                <div className='btn_group'>
                    {isEditMode ? (
                        <>
                            <button className="box color_border" onClick={onSave}>수정</button>
                            <button className="box" onClick={onCancel}>취소</button>
                        </>
                    ) : (
                        <>
                            <button className="box color_border" onClick={onSave}>작성 완료</button>
                            <button className="box" onClick={onCancel}>취소</button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
});

export default ProductRow;