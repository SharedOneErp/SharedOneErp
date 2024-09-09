package com.project.erpre.command;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CategoryVO {
    private int categoryNo;
    private int categoryLevel;
    private int parentCategoryNo;

}
