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
}) {
  return (
    <div className='modal-overlay'>
      <div className='modal-content'>

        <div className='category-form'>
          <button className='close-button' onClick={closeModal}>X</button>
          {/* 대분류 */}
          <div className='category-column'>
            <h4>대분류</h4>
            <div className='input-button'>
              <input type='text' placeholder='대분류 검색' className='input-field' />
              <button className='search-button'>검색</button>
            </div>
            <br />

            <div className='list-form'>
              <ul className='category-list'>
                {getTopCategory.map((category) => (
                  <li key={category.categoryNo}
                    onClick={() => {
                      handleTopClick(category.categoryNo);
                      handleTopHover(category.categoryNo);
                    }}
                    className={selectedTopCategory === category.categoryNo ? 'selected' : ''}
                  >
                    {category.categoryNm}
                  </li>
                ))}
              </ul>
            </div>

            <div className='input-button'>
              <input type='text'
                placeholder='새 대분류 추가'
                className='input-field'
                onChange={(e) => handleInsert(e, 1)}
                value={insertTop}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddButton(1);
                  }
                }}
              />
              <button type='submit' className='register-button' onClick={() => handleAddButton(1)}>등록</button>
            </div>

            <div>
              <button type='submit' className='edit-button' onClick={handleEditButton}>수정</button>
              <button type='submit' className='delete-button' onClick={handleDeleteButton}>삭제</button>
            </div>

          </div>

          {/* 중분류 */}
          <div className='category-column'>
            <h4>중분류</h4>
            <div className='input-button'>
              <input type='text' placeholder='중분류 검색' className='input-field' />
              <button className='search-button'>검색</button>
            </div>
            <br />

            <div className='list-form' style={{ position: 'relative' }}>
              {getMidCategory.length === 0 ? (
                <p style={{ position: 'absolute', top: '6%', left: '25%' }}>중분류가없습니다</p>
              ) : (
                <ul className='category-list'>
                  {getMidCategory.map((category) => (
                    <li key={category.categoryNo}
                      onClick={() => handleMidClick(category.categoryNo)}
                      className={selectedMidCategory === category.categoryNo ? 'selected' : ''}
                    >
                      {category.categoryNm}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='input-button'>
              <input type='text'
                placeholder='새 중분류 추가'
                className='input-field'
                onChange={(e) => handleInsert(e, 2)}
                value={insertMid}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddButton(2);
                  }
                }}
              />
              <button type='submit' className='register-button' onClick={() => handleAddButton(2)}>등록</button>
            </div>

            <div>
              <button type='submit' className='edit-button' onClick={handleEditButton}>수정</button>
              <button type='submit' className='delete-button' onClick={handleDeleteButton}>삭제</button>
            </div>
          </div>

          {/* 소분류 */}
          <div className='category-column'>
            <h4>소분류</h4>
            <div className='input-button'>
              <input type='text' placeholder='소분류 검색' className='input-field' />
              <button className='search-button'>검색</button>
            </div>
            <br />

            <div className='list-form' style={{ position: 'relative' }}>
              {getLowCategory.length === 0 ? (
                <p style={{ position: 'absolute', top: '6%', left: '25%' }}>소분류가없습니다</p>
              ) : (
                <ul className='category-list'>
                  {getLowCategory.map((category) => (
                    <li key={category.categoryNo}
                      onClick={() => handleLowClick(category.categoryNo)}
                      className={selectedLowCategory === category.categoryNo ? 'selected' : ''}
                    >
                      {category.categoryNm}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='input-button'>
              <input type='text'
                placeholder='새 소분류 추가'
                className='input-field'
                onChange={(e) => handleInsert(e, 3)}
                value={insertLow}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddButton(3);
                  }
                }}
              />
              <button type='submit' className='register-button' onClick={() => handleAddButton(3)}>등록</button>
            </div>

            <div>
              <button type='submit' className='edit-button' onClick={handleEditButton}>수정</button>
              <button type='submit' className='delete-button' onClick={handleDeleteButton}>삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
