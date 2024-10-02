// src/main/react/components/common/useDebounce.js
import { useState, useEffect } from 'react';

// useDebounce 훅 정의
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 딜레이 이후에 값 설정
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 클린업 함수로 타이머 정리
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};