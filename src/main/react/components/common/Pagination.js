// src/main/react/components/common/Pagination.js
import React from 'react';

function Pagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    isLoading,
    pageInputValue,
    handlePage,
    handleItemsPerPageChange,
    handlePageInputChange,
    handleDeleteSelected, // 선택 삭제 핸들러
    selectedItems, // 선택된 항목 배열
    showFilters = true, // 필터링 부분 표시 여부를 결정하는 옵션
}) {
    return (
        // showFilters가 false일 경우 페이지 블록만 가운데 정렬
        <div
            className="pagination-container"
            style={{ justifyContent: !showFilters ? 'space-around' : 'space-between' }}
        >

            {/* 좌측: 페이지당 항목 수 선택, showFilters가 true일 때만 표시 */}
            {
                showFilters && (
                    <div className="pagination-sub left">
                        {/* 선택된 항목이 있을 때만 "선택 삭제" 버튼 표시 */}
                        {Array.isArray(selectedItems) && selectedItems.length > 0 && (
                            <button className="box mr10 color_border red" onClick={handleDeleteSelected}>
                                <i className="bi bi-trash3"></i>{selectedItems.length}건 삭제
                            </button>
                        )}
                        <input
                            type="number"
                            id="itemsPerPage"
                            className="box"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            min={1}
                            max={100}
                            step={1}
                        />
                        <label htmlFor="itemsPerPage">
                            건씩 보기 / <b>{isLoading ? '-' : totalItems}</b>건
                        </label>
                    </div>
                )
            }

            {/* 가운데: 페이지네이션 */}
            <div className="pagination">
                {/* '처음' 버튼 */}
                {currentPage > 1 && (
                    <button className="box icon first" onClick={() => handlePage(1)}>
                        <i className="bi bi-chevron-double-left"></i>
                    </button>
                )}

                {/* '이전' 버튼 */}
                {currentPage > 1 && (
                    <button className="box icon left" onClick={() => handlePage(currentPage - 1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                )}

                {/* 페이지 번호 블록 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    const startPage = Math.max(Math.floor((currentPage - 1) / 5) * 5 + 1, 1);
                    const page = startPage + index;
                    return (
                        page <= totalPages && (
                            <button
                                key={page}
                                onClick={() => handlePage(page)}
                                className={currentPage === page ? 'box active' : 'box'}
                            >
                                {page}
                            </button>
                        )
                    );
                })}

                {/* '다음' 버튼 */}
                {currentPage < totalPages && (
                    <button className="box icon right" onClick={() => handlePage(currentPage + 1)}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                )}

                {/* '끝' 버튼 */}
                {currentPage < totalPages && (
                    <button className="box icon last" onClick={() => handlePage(totalPages)}>
                        <i className="bi bi-chevron-double-right"></i>
                    </button>
                )}
            </div>

            {/* 오른쪽: 페이지 번호 입력, showFilters가 true일 때만 표시 */}
            {
                showFilters && (
                    <div className="pagination-sub right">
                        <input
                            type="number"
                            id="pageInput"
                            className="box"
                            value={pageInputValue}
                            onChange={handlePageInputChange}
                            min={1}
                            max={totalPages}
                            step={1}
                        />
                        <label htmlFor="pageInput">/ <b>{totalPages}</b>페이지</label>
                    </div>
                )
            }

        </div >
    );
}

export default Pagination;
