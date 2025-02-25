package com.dhia.gestiondestock.repository;

import com.dhia.gestiondestock.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    Optional<Article> findArtcileByCodeArticle(String codeArticle);
    List<Article> findAllByCategoryId(Integer idCategory);

}
