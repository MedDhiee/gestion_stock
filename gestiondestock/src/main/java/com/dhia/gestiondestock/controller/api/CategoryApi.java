package com.dhia.gestiondestock.controller.api;

import com.dhia.gestiondestock.dto.CategoryDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import static com.dhia.gestiondestock.utils.Constants.APP_ROOT;

@Tag(name = "Categories", description = "Gestion des catégories")
public interface CategoryApi {

    @Operation(summary = "Enregistrer une catégorie", description = "Créer ou modifier une catégorie")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "L'objet category crée/modifié"),
            @ApiResponse(responseCode = "400", description = "L'objet category n'est pas valide")
    })
    @PostMapping(value = APP_ROOT + "/categories/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    CategoryDto save(@RequestBody CategoryDto dto);

    @Operation(summary = "Rechercher une catégorie par ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "La catégorie a été trouvée"),
            @ApiResponse(responseCode = "404", description = "Aucune catégorie trouvée")
    })
    @GetMapping(value = APP_ROOT + "/categories/{idCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    CategoryDto findById(@PathVariable("idCategory") Integer idCategory);

    @Operation(summary = "Rechercher une catégorie par CODE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "La catégorie a été trouvée"),
            @ApiResponse(responseCode = "404", description = "Aucune catégorie trouvée")
    })
    @GetMapping(value = APP_ROOT + "/categories/filter/{codeCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
    CategoryDto findByCode(@PathVariable("codeCategory") String codeCategory);

    @Operation(summary = "Liste des catégories")
    @ApiResponse(responseCode = "200", description = "Liste récupérée avec succès")
    @GetMapping(value = APP_ROOT + "/categories/all", produces = MediaType.APPLICATION_JSON_VALUE)
    List<CategoryDto> findAll();

    @Operation(summary = "Supprimer une catégorie")
    @ApiResponse(responseCode = "200", description = "La catégorie a été supprimée")
    @DeleteMapping(value = APP_ROOT + "/categories/delete/{idCategory}")
    void delete(@PathVariable("idCategory") Integer id);
}