package com.dhia.gestiondestock.dto;

import com.dhia.gestiondestock.model.Commande;

import com.dhia.gestiondestock.model.EtatCommande;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Builder
@Data
public class CommandeDto {
    private Integer id;
    private String code;
    private Instant dateCommande;
    private EtatCommande etatCommande;
    private List<LigneCommandeDto> ligneCommande;

    public static CommandeDto fromEntity(Commande commande) {
        if (commande == null) {
            return null;
        }

        List<LigneCommandeDto> ligneCommandeDtos = commande.getLigneCommandes().stream()
                .map(LigneCommandeDto::fromEntity)
                .collect(Collectors.toList());

        return CommandeDto.builder()
                .id(commande.getId())
                .dateCommande(commande.getDateCommande())
                .etatCommande(commande.getEtatCommande())
                .ligneCommande(ligneCommandeDtos) // Assurez-vous que cette ligne charge les lignes de commande
                .build();
    }

    public static Commande toEntity(CommandeDto dto) {
        if (dto == null) {
            return null;
        }
        Commande commande = new Commande();
        commande.setId(dto.getId());
        commande.setDateCommande(dto.getDateCommande());
        commande.setEtatCommande(dto.getEtatCommande());
        commande.setLigneCommandes(dto.getLigneCommande() != null ?
                dto.getLigneCommande().stream().map(LigneCommandeDto::toEntity).collect(Collectors.toList()) : null);
        return commande;
    }

    public boolean isCommandeLivree() {
        return EtatCommande.LIVREE.equals(this.etatCommande);
    }
}
