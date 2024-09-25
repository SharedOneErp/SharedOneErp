package com.project.erpre.repository;

import com.project.erpre.model.CategoryDTO;

import java.util.List;

public interface CategoryRepositoryCustom {

    // 카테고리 조회
    List<CategoryDTO> getCategoryList(Integer one, Integer two, Integer three);

}
