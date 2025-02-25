package com.dhia.gestiondestock.model;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;


import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@Entity
@Table(name="commande")
public class Commande extends AbstractEntity{

    @Column(name = "dateCommande")
    private Instant dateCommande;

    @OneToMany(mappedBy = "commande")
    private List<LigneCommande> ligneCommandes;
    @Column(name = "etatcommande")
    @Enumerated(EnumType.STRING)
    private EtatCommande etatCommande;
}
