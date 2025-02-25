package com.dhia.gestiondestock.services;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto save(CategoryDto dto);
    CategoryDto findById(Integer id);
    CategoryDto findByCode(String codeCategory);
    List<CategoryDto> findAll();
    void delete(Integer id);
}
