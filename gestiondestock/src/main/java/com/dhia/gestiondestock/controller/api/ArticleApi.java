package com.dhia.gestiondestock.controller.api;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.dto.LigneVenteDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import static com.dhia.gestiondestock.utils.Constants.APP_ROOT;

@Tag(name = "Articles", description = "API de gestion des articles")
@RequestMapping(APP_ROOT + "/articles")
public interface ArticleApi {

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Enregistrer un article", description = "Cette méthode permet d'enregistrer ou modifier un article")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "L'objet article crée / modifié"),
            @ApiResponse(responseCode = "400", description = "L'objet article n'est pas valide")
    })
    ArticleDto save(@RequestBody ArticleDto dto);

    @GetMapping(value = "/{idArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher un article par ID", description = "Cette méthode permet de chercher un article par son ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "L'article a été trouvé dans la BDD"),
            @ApiResponse(responseCode = "404", description = "Aucun article trouvé avec cet ID")
    })
    ArticleDto findById(@PathVariable("idArticle") Integer id);

    @GetMapping(value = "/filter/{codeArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Rechercher un article par CODE", description = "Cette méthode permet de chercher un article par son code")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article trouvé"),
            @ApiResponse(responseCode = "404", description = "Article introuvable")
    })
    ArticleDto findByCodeArticle(@PathVariable("codeArticle") String codeArticle);

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Liste des articles", description = "Cette méthode retourne tous les articles présents en base")
    @ApiResponse(responseCode = "200", description = "Liste des articles ou liste vide")
    List<ArticleDto> findAll();

    @GetMapping(value = "/historique/vente/{idArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Historique des ventes", description = "Retourne l'historique des ventes pour un article donné")
    List<LigneVenteDto> findHistoriqueVentes(@PathVariable("idArticle") Integer idArticle);

    @GetMapping(value = "/historique/commandeclient/{idArticle}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Historique des commandes client", description = "Retourne l'historique des commandes client pour un article donné")
    List<LigneCommandeDto> findHistoriaueCommandeClient(@PathVariable("idArticle") Integer idArticle);

    @GetMapping(value = "/filter/category/{idCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Articles par catégorie", description = "Retourne tous les articles d'une catégorie")
    List<ArticleDto> findAllArticleByIdCategory(@PathVariable("idCategory") Integer idCategory);

    @DeleteMapping(value = "/delete/{idArticle}")
    @Operation(summary = "Supprimer un article", description = "Cette méthode permet de supprimer un article par ID")
    @ApiResponse(responseCode = "200", description = "L'article a été supprimé")
    void delete(@PathVariable("idArticle") Integer id);
}
