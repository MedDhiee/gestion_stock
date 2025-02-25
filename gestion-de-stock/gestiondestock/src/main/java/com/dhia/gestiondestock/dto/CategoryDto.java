package com.dhia.gestiondestock.dto;

import com.dhia.gestiondestock.model.Article;
import com.dhia.gestiondestock.model.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;


import java.util.List;

@Builder
@Data
public class CategoryDto {
    private Integer id;
    private String code;
    private String description;

    @JsonIgnore
    private List<ArticleDto> articles;
    public static CategoryDto fromEntity(Category category){
        if(category==null){
            return null;
        }
        return CategoryDto.builder()
                .id(category.getId())
                .code(category.getCode())
                .description(category.getDescription())
                .build();
    }
    public static Category toEntity(CategoryDto categoryDto){
        if(categoryDto==null){
            return null;
        }
        Category category=new Category();
        category.setId(categoryDto.getId());
        category.setCode(categoryDto.getCode());
        category.setDescription(categoryDto.getDescription());

        return category;
    }
}
