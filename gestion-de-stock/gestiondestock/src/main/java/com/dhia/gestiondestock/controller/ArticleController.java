package com.dhia.gestiondestock.controller;

import java.math.BigDecimal;
import java.util.List;

import com.dhia.gestiondestock.controller.api.ArticleApi;
import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.dto.LigneVenteDto;
import com.dhia.gestiondestock.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class ArticleController implements ArticleApi {

    private ArticleService articleService;

    @Autowired
    public ArticleController(
            ArticleService articleService
    ) {
        this.articleService = articleService;
    }

    @Override
    public ArticleDto save(ArticleDto dto) {
        return articleService.save(dto);
    }

    @Override
    public ArticleDto findById(Integer id) {
        return articleService.findById(id);
    }

    @Override
    public ArticleDto findByCodeArticle(String codeArticle) {
        return articleService.findByCodeArticle(codeArticle);
    }

    @Override
    public List<ArticleDto> findAll() {
        return articleService.findAll();
    }

    @Override
    public List<LigneVenteDto> findHistoriqueVentes(Integer idArticle) {
        return articleService.findHistoriqueVentes(idArticle);
    }

    @Override
    public List<LigneCommandeDto> findHistoriaueCommandeClient(Integer idArticle) {
        return articleService.findHistoriaueCommandeClient(idArticle);
    }

    @Override
    public List<ArticleDto> findAllArticleByIdCategory(Integer idCategory) {
        return articleService.findAllArticleByIdCategory(idCategory);
    }

    @Override
    public void delete(Integer id) {
        articleService.delete(id);
    }
    @PutMapping("/{id}/updateQuantities")
    public ResponseEntity<ArticleDto> updateArticleQuantities(
            @PathVariable("id") Integer id,
            @RequestBody BigDecimal newStock) {

        // Vérifiez les données d'entrée ou les autorisations si nécessaire

        ArticleDto updatedArticle = articleService.updateArticleQuantities(id, newStock);

        return ResponseEntity.ok(updatedArticle);
    }

}