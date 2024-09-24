// src/main/react/components/common/ConfirmModal.js
import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal_overlay">
            <div className="modal_confirm">
                <div className="del_icon"><i className="bi bi-exclamation-circle"></i></div>
                {/* dangerouslySetInnerHTML를 이용해 HTML 태그를 렌더링 */}
                <p className='msg' dangerouslySetInnerHTML={{ __html: message }}></p>
                <div className="modal-actions">
                    <button className="box red" onClick={onConfirm}>확인</button>
                    <button className="box gray" onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;