package com.dhia.gestiondestock.services.imp;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.dto.LigneVenteDto;
import com.dhia.gestiondestock.exception.EntityNotFoundException;
import com.dhia.gestiondestock.exception.InvalidEntityException;
import com.dhia.gestiondestock.exception.ErrorCodes;
import com.dhia.gestiondestock.exception.InvalidOperationException;
import com.dhia.gestiondestock.model.Article;
import com.dhia.gestiondestock.model.LigneCommande;
import com.dhia.gestiondestock.model.LigneVente;
import com.dhia.gestiondestock.repository.ArticleRepository;
import com.dhia.gestiondestock.repository.LigneCommandeRepository;
import com.dhia.gestiondestock.repository.LigneVenteRepository;
import com.dhia.gestiondestock.services.ArticleService;
import com.dhia.gestiondestock.validator.ArticleValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ArticleServiceImpl implements ArticleService {
    private ArticleRepository articleRepository;
    private LigneVenteRepository venteRepository;
    private LigneCommandeRepository commandeClientRepository;

    @Autowired
    public ArticleServiceImpl(
            ArticleRepository articleRepository,
            LigneVenteRepository venteRepository,
            LigneCommandeRepository commandeClientRepository) {
        this.articleRepository = articleRepository;
        this.venteRepository = venteRepository;

        this.commandeClientRepository = commandeClientRepository;
    }

    @Override
    public ArticleDto save(ArticleDto dto) {
        List<String> errors = ArticleValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Article is not valid {}", dto);
            throw new InvalidEntityException("L'article n'est pas valide", ErrorCodes.ARTICLE_NOT_VALID, errors);
        }

        return ArticleDto.fromEntity(
                articleRepository.save(
                        ArticleDto.toEntity(dto)
                )
        );
    }

    @Override
    public ArticleDto findById(Integer id) {
        if (id == null) {
            log.error("Article ID is null");
            return null;
        }

        return articleRepository.findById(id).map(ArticleDto::fromEntity).orElseThrow(() ->
                new EntityNotFoundException(
                        "Aucun article avec l'ID = " + id + " n' ete trouve dans la BDD",
                        ErrorCodes.ARTICLE_NOT_FOUND)
        );
    }

    @Override
    public ArticleDto findByCodeArticle(String codeArticle) {
        if (!StringUtils.hasLength(codeArticle)) {
            log.error("Article CODE is null");
            return null;
        }

        return articleRepository.findArtcileByCodeArticle(codeArticle)
                .map(ArticleDto::fromEntity)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Aucun article avec le CODE = " + codeArticle + " n' ete trouve dans la BDD",
                                ErrorCodes.ARTICLE_NOT_FOUND)
                );
    }

    @Override
    public List<ArticleDto> findAll() {
        return articleRepository.findAll().stream()
                .map(ArticleDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<LigneVenteDto> findHistoriqueVentes(Integer idArticle) {
        return venteRepository.findAllByArticleId(idArticle).stream()
                .map(LigneVenteDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<LigneCommandeDto> findHistoriaueCommandeClient(Integer idArticle) {
        return commandeClientRepository.findAllByArticleId(idArticle).stream()
                .map(LigneCommandeDto::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public List<ArticleDto> findAllArticleByIdCategory(Integer idCategory) {
        return articleRepository.findAllByCategoryId(idCategory).stream()
                .map(ArticleDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Integer id) {
        if (id == null) {
            log.error("Article ID is null");
            return;
        }
        List<LigneCommande> ligneCommandeClients = commandeClientRepository.findAllByArticleId(id);
        if (!ligneCommandeClients.isEmpty()) {
            throw new InvalidOperationException("Impossible de supprimer un article deja utilise dans des commandes client", ErrorCodes.ARTICLE_ALREADY_IN_USE);
        }
        List<LigneVente> ligneVentes = venteRepository.findAllByArticleId(id);
        if (!ligneVentes.isEmpty()) {
            throw new InvalidOperationException("Impossible de supprimer un article deja utilise dans des ventes",
                    ErrorCodes.ARTICLE_ALREADY_IN_USE);
        }
        articleRepository.deleteById(id);
    }


    @Override
    public ArticleDto updateArticleQuantities(Integer id, BigDecimal newStock) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + id));

        // Mettez à jour les quantités d'article
        article.setIn_stock(newStock);

        articleRepository.save(article);

        return ArticleDto.fromEntity(article); // Assurez-vous d'avoir un mapper approprié si nécessaire
    }

}