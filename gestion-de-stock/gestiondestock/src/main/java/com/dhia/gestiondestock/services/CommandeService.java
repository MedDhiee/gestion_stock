package com.dhia.gestiondestock.services;

import com.dhia.gestiondestock.dto.ArticleDto;
import com.dhia.gestiondestock.dto.CommandeDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.model.EtatCommande;

import java.math.BigDecimal;
import java.util.List;

public interface CommandeService {
    CommandeDto save(CommandeDto dto);
    CommandeDto findById(Integer id);
    List<CommandeDto> findAll();
    List<LigneCommandeDto> findAllLignesCommandesClientByCommandeClientId(Integer idCommande);
    void delete(Integer id);
    CommandeDto updateEtatCommande(Integer idCommande, EtatCommande etatCommande);

    CommandeDto updateQuantiteCommande(Integer idCommande, Integer idLigneCommande, BigDecimal quantite);

    CommandeDto updateArticle(Integer idCommande, Integer idLigneCommande, Integer newIdArticle);

    // Delete article ==> delete LigneCommandeClient
    CommandeDto deleteArticle(Integer idCommande, Integer idLigneCommande);


}
