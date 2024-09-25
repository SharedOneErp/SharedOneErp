// src/main/react/components/common/ConfirmCustom.js
import React, { useState, useEffect, useCallback } from 'react';

const ConfirmCustom = () => {
    const [isVisible, setIsVisible] = useState(false); // 모달이 화면에 표시되는지 여부를 관리하는 상태
    const [message, setMessage] = useState(''); // 모달에 표시될 메시지를 저장하는 상태
    const [resolveCallback, setResolveCallback] = useState(null); // Promise의 resolve 함수를 저장하여 나중에 호출할 수 있게 함
    const [modalWidth, setModalWidth] = useState(null); // 모달의 width 값을 저장하는 상태

    // 🔴 confirmCustom 함수를 정의하여 모달을 표시하고, Promise로 처리
    // 이 함수는 메시지와 width를 받아서 모달을 띄우고, 사용자의 선택에 따라 Promise가 resolve됨
    const confirmCustom = useCallback((message, width = null) => {
        return new Promise((resolve) => {
            setMessage(message);    // 전달받은 메시지를 모달에 표시할 메시지로 설정
            setModalWidth(width);   // width 값이 있으면 모달의 크기를 설정
            setIsVisible(true);     // 모달을 화면에 표시
            setResolveCallback(() => resolve);  // Promise의 resolve 함수를 저장하여 나중에 호출
        });
    }, []);

    // 🟡 전역에서 confirmCustom 함수를 호출할 수 있도록 설정
    // useEffect를 통해 confirmCustom 함수를 window 객체에 등록하여, 어디서든 호출할 수 있게 설정
    useEffect(() => {
        window.confirmCustom = confirmCustom;  // confirmCustom 함수를 전역 함수로 설정
    }, [confirmCustom]);

    // 🟡 '확인' 버튼 클릭 시 처리
    // 사용자가 확인 버튼을 클릭했을 때 실행되는 함수로, 모달을 닫고 Promise를 resolve(true)로 처리
    const handleConfirm = () => {
        resolveCallback(true);  // Promise를 성공 상태로 완료하여 true 값을 반환
        setIsVisible(false);    // 모달을 화면에서 숨김
    };

    // 🟡 '취소' 버튼 클릭 시 처리
    // 사용자가 취소 버튼을 클릭했을 때 실행되는 함수로, 모달을 닫고 Promise를 resolve(false)로 처리
    const handleCancel = () => {
        resolveCallback(false);  // Promise를 성공 상태로 완료하여 false 값을 반환
        setIsVisible(false);     // 모달을 화면에서 숨김
    };

    // 모달이 보이지 않으면 null을 반환하여 아무것도 렌더링하지 않음
    if (!isVisible) return null;  

    // 🟢 화면: 모달이 보이는 경우 렌더링
    return (
        <div className="modal_overlay">
            <div className="modal_confirm" style={modalWidth ? { width: modalWidth } : {}}>
                {/* 아이콘을 포함한 메시지 출력 영역 */}
                <div className="icon_wrap"><i className="bi bi-exclamation-circle"></i></div>
                {/* 메시지를 HTML로 출력. 외부로부터 받은 메시지가 포함될 때 XSS 공격 가능성에 주의 */}
                <p className='msg' dangerouslySetInnerHTML={{ __html: message }}></p>
                {/* 확인 및 취소 버튼 */}
                <div className="modal-actions">
                    <button className="box red" onClick={handleConfirm}>확인</button>
                    <button className="box gray" onClick={handleCancel}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCustom;
