// src/main/react/components/common/CategoryAddModal.js
import React, { useState, useEffect } from 'react';

function CategoryModal({
  category,
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
  isSubmitting,
  setAllCategories,
  setTopCategories,
  setMidCategories,
  setLowCategories,
  allCategories,
  topCategories,
  midCategories,
  lowCategories,
  setSelectedCategory,
  selectedCategory,
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
              {topCategories.length > 0 && (
                <span className="list_cnt">({topCategories.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap'>
                <ul className='list'>
                  {topCategories.map((category) => (
                    <li key={category.categoryNo}
                      onClick={() => {
                        handleTopClick(category.categoryNo);
                        handleTopHover(category.categoryNo);
                      }}
                      className={selectedCategory.top === category.categoryNo ? 'selected' : ''}
                    >
                      <span className='category-span'>{category.categoryNm}</span>
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
                      if (e.key === 'Enter' && !isSubmitting) {
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
              {midCategories.length > 0 && (
                <span className="list_cnt">({midCategories.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap' style={{ position: 'relative' }}>
                {midCategories.length === 0 ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>대분류를 선택해주세요.</p>
                ) : (
                  <ul className='list'>
                    {midCategories.map((category) => (
                      <li key={category.categoryNo}
                        onClick={() => handleMidClick(category.categoryNo)}
                        className={selectedCategory.middle === category.categoryNo ? 'selected' : ''}
                      >
                        <span className='category-span'>{category.categoryNm}</span>
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
                      if (e.key === 'Enter' && !isSubmitting) {
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
              {lowCategories.length > 0 && (
                <span className="list_cnt">({lowCategories.length})</span>
              )}
            </h4>
            <div className='content_wrap'>
              <div className='list_wrap' style={{ position: 'relative' }}>
                {!selectedCategory.middle ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>중분류를 선택해주세요.</p>
                ) : lowCategories.length === 0 ? (
                  <p className='empty_wrap'><i className="bi bi-exclamation-circle"></i>데이터가 없습니다.</p>
                ) : (
                  <ul className='list'>
                    {lowCategories.map((category) => (
                      <li key={category.categoryNo}
                        onClick={() => handleLowClick(category.categoryNo)}
                        className={selectedCategory.low === category.categoryNo ? 'selected' : ''}
                      >
                        <span className='category-span'>{category.categoryNm}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* 소분류 input은 중분류가 선택된 경우에만 렌더링 */}
              {selectedCategory.middle && (
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
                        if (e.key === 'Enter' && !isSubmitting) {
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
          <div className='selected-cate'>
            <label className='floating-label'>선택된 카테고리</label>
            {selectedCategory.low ? (
              <span className='input-field' >{lowCategories.find(category => category.categoryNo === selectedCategory.low)?.categoryNm || '선택된 카테고리 없음'}</span>
            ) : selectedCategory.middle ? (
              <span className='input-field'>{midCategories.find(category => category.categoryNo === selectedCategory.middle)?.categoryNm || '선택된 카테고리 없음'}</span>
            ) : selectedCategory.top ? (
              <span className='input-field'>{topCategories.find(category => category.categoryNo === selectedCategory.top)?.categoryNm || '선택된 카테고리 없음'}</span>
            ) : (
              <span>선택된 카테고리가 없습니다</span>
            )}
          </div>
          <button type='submit' className='box color_border edit' onClick={handleEditButton}>수정</button>
          <button type='submit' className='box color_border del red' onClick={handleDeleteButton}>삭제</button>
        </div>
      </div>
    </div >
  );
}

export default CategoryModal;
