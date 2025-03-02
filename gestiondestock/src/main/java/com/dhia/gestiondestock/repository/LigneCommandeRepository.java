package com.dhia.gestiondestock.repository;

import com.dhia.gestiondestock.model.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LigneCommandeRepository extends JpaRepository<LigneCommande, Integer> {
    List<LigneCommande> findAllByCommandeId(Integer id);

    List<LigneCommande> findAllByArticleId(Integer id);
}
