package com.dhia.gestiondestock.dto;

import com.dhia.gestiondestock.model.Article;
import com.dhia.gestiondestock.model.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.util.List;

@Builder
@Data
public class ArticleDto {
    private Integer id;
    private String codeArticle;

    private BigDecimal In_stock;

    private CategoryDto category;

    private BigDecimal PrixVente;

    private BigDecimal PrixAchat;
    private String photo;
    private String designation;

    public static ArticleDto fromEntity(Article article){
        if(article==null){
            return null;
        }
        return ArticleDto.builder()
                .id(article.getId())
                .codeArticle(article.getCodeArticle())
                .designation(article.getDesignation())
                .In_stock(article.getIn_stock())
                .PrixVente(article.getPrixVente())
                .PrixAchat(article.getPrixAchat())
                .category(CategoryDto.fromEntity(article.getCategory()))
                .photo(article.getPhoto())
                .build();
    }
    public static Article toEntity(ArticleDto articleDto){
        if(articleDto==null){
            return null;
        }
        Article article=new Article();
        article.setId(articleDto.getId());
        article.setCodeArticle(articleDto.getCodeArticle());
        article.setIn_stock(articleDto.getIn_stock());
        article.setPrixVente(articleDto.getPrixVente());
        article.setDesignation(articleDto.getDesignation());
        article.setPrixAchat(articleDto.getPrixAchat());
        article.setPhoto(articleDto.getPhoto());
        article.setCategory(CategoryDto.toEntity(articleDto.getCategory()));
        return article;
    }
}
