package com.dhia.gestiondestock.controller.api;

import com.dhia.gestiondestock.dto.CommandeDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.model.EtatCommande;
import io.swagger.annotations.Api;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static com.dhia.gestiondestock.utils.Constants.APP_ROOT;

@Api("commandes")
public interface CommandeApi {


    @PostMapping(APP_ROOT + "/commandes/create")
    ResponseEntity<CommandeDto> save(@RequestBody CommandeDto dto);


    @PatchMapping(APP_ROOT + "/commandes/update/etat/{idCommande}/{etatCommande}")
    ResponseEntity<CommandeDto> updateEtatCommande(@PathVariable("idCommande") Integer idCommande, @PathVariable("etatCommande") EtatCommande etatCommande);

    @PatchMapping(APP_ROOT + "/commandes/update/quantite/{idCommande}/{idLigneCommande}/{quantite}")
    ResponseEntity<CommandeDto> updateQuantiteCommande(@PathVariable("idCommande") Integer idCommande,
                                                             @PathVariable("idLigneCommande") Integer idLigneCommande, @PathVariable("quantite") BigDecimal quantite);


    @PatchMapping(APP_ROOT + "/commandes/update/article/{idCommande}/{idLigneCommande}/{idArticle}")
    ResponseEntity<CommandeDto> updateArticle(@PathVariable("idCommande") Integer idCommande,
                                                    @PathVariable("idLigneCommande") Integer idLigneCommande, @PathVariable("idArticle") Integer idArticle);

    @DeleteMapping(APP_ROOT + "/commandes/delete/article/{idCommande}/{idLigneCommande}")
    ResponseEntity<CommandeDto> deleteArticle(@PathVariable("idCommande") Integer idCommande, @PathVariable("idLigneCommande") Integer idLigneCommande);

    @GetMapping(APP_ROOT + "/commandes/{idCommande}")
    ResponseEntity<CommandeDto> findById(@PathVariable Integer idCommande);



    @GetMapping(APP_ROOT + "/commandes/all")
    ResponseEntity<List<CommandeDto>> findAll();

    @DeleteMapping(APP_ROOT + "/commandes/delete/{idCommande}")
    ResponseEntity<Void> delete(@PathVariable("idCommande") Integer id);

    @GetMapping(APP_ROOT + "/commandes/lignesCommande/{idCommande}")
    ResponseEntity<List<LigneCommandeDto>> findAllLignesCommandesClientByCommandeClientId(@PathVariable("idCommande") Integer idCommande);


}