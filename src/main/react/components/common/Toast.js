// src/main/react/components/common/Toast.js
import React, { useEffect, useState, useCallback } from 'react';

let toastId = 0;

const Toast = () => {
    const [toasts, setToasts] = useState([]); // 여러 개의 토스트 관리

    // 🔴 showToast 함수를 useCallback으로 정의하여 토스트 추가(useCallback : showToast 함수를 기억해 두고, toasts 배열이 바뀔 때에만 새로 만드는 역할)
    const showToast = useCallback((message, type = 'check', duration = 3000) => { // 기본 : 3초동안 표시
        
        // 중복 메시지 여부 확인
        // const isDuplicate = toasts.some(toast => toast.message === message);
        //if (isDuplicate) return; // 메시지가 이미 있으면 추가하지 않음

        const id = toastId++;
        setToasts([...toasts, { id, message, type, duration }]);

        // duration 후에 토스트 제거
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
    }, [toasts]);

    // 🟡 다른 곳에서 이 함수를 쉽게 사용할 수 있도록 window에 추가
    useEffect(() => {
        window.showToast = showToast; // 전역 함수로 설정 (어디서든 showToast 호출 가능)
    }, [showToast]);

    // 🟡 아이콘 선택 함수
    const getIcon = (type) => {
        switch (type) {
            case 'error':
                return <i className="bi bi-exclamation-circle-fill"></i>; // error 아이콘
            case 'check':
            default:
                return <i className="bi bi-check-circle-fill"></i>; // 기본 check 아이콘
        }
    };

    // 🟢 화면
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    {getIcon(toast.type)} {toast.message}
                </div>
            ))}
        </div>
    );
};

export default Toast;