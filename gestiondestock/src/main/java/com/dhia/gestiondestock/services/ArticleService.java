package com.dhia.gestiondestock.services;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.dto.LigneVenteDto;

import java.math.BigDecimal;
import java.util.List;

public interface ArticleService {
    ArticleDto save(ArticleDto dto);

    ArticleDto findById(Integer id);

    ArticleDto findByCodeArticle(String codeArticle);

    List<ArticleDto> findAll();

    List<LigneVenteDto> findHistoriqueVentes(Integer idArticle);

    List<LigneCommandeDto> findHistoriaueCommandeClient(Integer idArticle);



    List<ArticleDto> findAllArticleByIdCategory(Integer idCategory);

    void delete(Integer id);

    ArticleDto updateArticleQuantities(Integer id, BigDecimal newStock);
}
