// src/main/react/components/common/CategoryAddModal.js
import React, { useState, useEffect } from 'react';

function CategoryModal({
  getTopCategory,
  getMidCategory,
  getLowCategory,
  selectedTopCategory,
  selectedMidCategory,
  selectedLowCategory,
  insertTop,
  insertMid,
  insertLow,
  handleInsert,
  handleAddButton,
  handleEditButton,
  handleDeleteButton,
  handleTopClick,
  handleMidClick,
  handleLowClick,
  handleTopHover,
  closeModal,
  handleBackgroundClick,
}) {



  return (
    <div className="modal_overlay" onMouseDown={handleBackgroundClick}>
      <div className="modal_container cate_modal">
        <div className="header">
          <div>상품 카테고리 편집</div>
          <button className="btn_close" onClick={closeModal}><i className="bi bi-x-lg"></i></button> {/* 모달 닫기 버튼 */}
        </div>
        <div className='edit_wrap'>
          {/* 대분류 */}
          <div className='level_wrap'>
            <h4>대분류
              {getTopCategory.length > 0 && (
                <span className="list_cnt">({getTopCategory.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap'>
                <ul className='list'>
                  {getTopCategory.map((category) => (
                    <li key={category.categoryNo}
                      onClick={() => {
                        handleTopClick(category.categoryNo);
                        handleTopHover(category.categoryNo);
                      }}
                      className={selectedTopCategory === category.categoryNo ? 'selected' : ''}
                    >
                      <span>{category.categoryNm}</span>
                      <i className="bi bi-chevron-right"></i>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='input-wrap'>
                <div className={`search_box ${insertTop ? 'has_text' : ''}`}>
                  <label className="label_floating">Enter키로 대분류 추가</label>
                  <i className="bi bi-plus-lg"></i>
                  <input
                    type="text"
                    className="box search"
                    onChange={(e) => handleInsert(e, 1)}
                    value={insertTop}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddButton(1);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 중분류 */}
          <div className='level_wrap'>
            <h4>중분류
              {getMidCategory.length > 0 && (
                <span className="list_cnt">({getMidCategory.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap' style={{ position: 'relative' }}>
                {getMidCategory.length === 0 ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>데이터가 없습니다.</p>
                ) : (
                  <ul className='list'>
                    {getMidCategory.map((category) => (
                      <li key={category.categoryNo}
                        onClick={() => handleMidClick(category.categoryNo)}
                        className={selectedMidCategory === category.categoryNo ? 'selected' : ''}
                      >
                        <span>{category.categoryNm}</span>
                        <i className="bi bi-chevron-right"></i>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className='input-wrap'>
                <div className={`search_box ${insertMid ? 'has_text' : ''}`}>
                  <label className="label_floating">Enter키로 중분류 추가</label>
                  <i className="bi bi-plus-lg"></i>
                  <input
                    type="text"
                    className="box search"
                    onChange={(e) => handleInsert(e, 2)}
                    value={insertMid}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddButton(2);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* 소분류 */}
          <div className='level_wrap'>
            <h4>소분류
              {getLowCategory.length > 0 && (
                <span className="list_cnt">({getLowCategory.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap' style={{ position: 'relative' }}>
                {!selectedMidCategory ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>중분류를 선택해주세요.</p>
                ) : getLowCategory.length === 0 ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>데이터가 없습니다.</p>
                ) : (
                  <ul className='list'>
                    {getLowCategory.map((category) => (
                      <li key={category.categoryNo}
                        onClick={() => handleLowClick(category.categoryNo)}
                        className={selectedLowCategory === category.categoryNo ? 'selected' : ''}
                      >
                        <span>{category.categoryNm}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* 소분류 input은 중분류가 선택된 경우에만 렌더링 */}
              {selectedMidCategory && (
                <div className='input-wrap'>
                  <div className={`search_box ${insertLow ? 'has_text' : ''}`}>
                    <label className="label_floating">Enter키로 소분류 추가</label>
                    <i className="bi bi-plus-lg"></i>
                    <input
                      type="text"
                      className="box search"
                      onChange={(e) => handleInsert(e, 3)}
                      value={insertLow}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddButton(3);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='btn_wrap'>
          <button type='submit' className='box color_border edit' onClick={handleEditButton}>수정</button>
          <button type='submit' className='box color_border del red' onClick={handleDeleteButton}>삭제</button>
        </div>
      </div>
    </div >
  );
}

export default CategoryModal;
