// src/main/react/components/common/Toast.js
import React, { useEffect, useState, useCallback } from 'react';

let toastId = 0;

const Toast = () => {
    const [toasts, setToasts] = useState([]); // 여러 개의 토스트 관리

    // showToast 함수를 useCallback으로 정의하여 토스트 추가(useCallback : showToast 함수를 기억해 두고, toasts 배열이 바뀔 때에만 새로 만드는 역할)
    const showToast = useCallback((message, duration = 5000) => { // 기본 : 5초동안 표시
        // 중복 메시지 여부 확인
        const isDuplicate = toasts.some(toast => toast.message === message);
        //if (isDuplicate) return; // 메시지가 이미 있으면 추가하지 않음

        const id = toastId++;
        setToasts([...toasts, { id, message, duration }]);

        // duration 후에 토스트 제거
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
    }, [toasts]);

    // 다른 곳에서 이 함수를 쉽게 사용할 수 있도록 window에 추가
    useEffect(() => {
        window.showToast = showToast; // 전역 함수로 설정 (어디서든 showToast 호출 가능)
    }, [showToast]);

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className="toast">
                    <i className="bi bi-check-circle-fill"></i> {toast.message}
                </div>
            ))}
        </div>
    );
};

export default Toast;