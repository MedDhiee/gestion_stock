package com.dhia.gestiondestock.controller;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.util.List;

import com.dhia.gestiondestock.controller.api.CommandeApi;
import com.dhia.gestiondestock.dto.CommandeDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.model.Commande;
import com.dhia.gestiondestock.model.EtatCommande;
import com.dhia.gestiondestock.services.CommandeService;
import com.dhia.gestiondestock.services.imp.ExportPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import static com.dhia.gestiondestock.utils.Constants.APP_ROOT;

@RestController
public class CommandeController implements CommandeApi {

    private CommandeService commandeClientService;


    @Autowired
    public CommandeController(CommandeService commandeClientService) {
        this.commandeClientService = commandeClientService;
    }

    @Override
    public ResponseEntity<CommandeDto> save(CommandeDto dto) {
        return ResponseEntity.ok(commandeClientService.save(dto));
    }



    @Override
    public ResponseEntity<CommandeDto> findById(Integer id) {
        return ResponseEntity.ok(commandeClientService.findById(id));
    }



    @Override
    public ResponseEntity<List<CommandeDto>> findAll() {
        return ResponseEntity.ok(commandeClientService.findAll());
    }

    @Override
    public ResponseEntity<Void> delete(Integer id) {
        commandeClientService.delete(id);
        return ResponseEntity.ok().build();
    }
    @Override
    public ResponseEntity<CommandeDto> updateEtatCommande(Integer idCommande, EtatCommande etatCommande) {
        return ResponseEntity.ok(commandeClientService.updateEtatCommande(idCommande, etatCommande));
    }

    @Override
    public ResponseEntity<CommandeDto> updateQuantiteCommande(Integer idCommande, Integer idLigneCommande, BigDecimal quantite) {
        return ResponseEntity.ok(commandeClientService.updateQuantiteCommande(idCommande, idLigneCommande, quantite));
    }

    @Override
    public ResponseEntity<CommandeDto> updateArticle(Integer idCommande, Integer idLigneCommande, Integer idArticle) {
        return ResponseEntity.ok(commandeClientService.updateArticle(idCommande, idLigneCommande, idArticle));
    }

    @Override
    public ResponseEntity<CommandeDto> deleteArticle(Integer idCommande, Integer idLigneCommande) {
        return ResponseEntity.ok(commandeClientService.deleteArticle(idCommande, idLigneCommande));
    }
    @Override
    public ResponseEntity<List<LigneCommandeDto>> findAllLignesCommandesClientByCommandeClientId(Integer idCommande) {
        return ResponseEntity.ok(commandeClientService.findAllLignesCommandesClientByCommandeClientId(idCommande));
    }

}