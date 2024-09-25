import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export const useCategoryHooks = () => {
    const [categories, setCategories] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 카테고리 데이터를 가져오는 함수
    const fetchCategories = useCallback(() => {
        setIsLoading(true);
        axios.get('/api/products/category')
            .then(response => {
                const categoriesData = response.data;
                setCategories(categoriesData);
                setTopCategories(categoriesData.filter(cat => cat?.categoryLv === 1));
            })
            .catch(error => {
                console.error('카테고리 조회 실패', error);
                setError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 카테고리 필터링 함수
    const getFilteredCategories = (level, parentCategoryNo) => {
        return categories.filter(cat => cat?.categoryLv === level && cat.parentCategoryNo === parentCategoryNo);
    };

    return {
        categories,
        topCategories,
        isLoading,
        error,
        fetchCategories,
        getFilteredCategories
    };
};