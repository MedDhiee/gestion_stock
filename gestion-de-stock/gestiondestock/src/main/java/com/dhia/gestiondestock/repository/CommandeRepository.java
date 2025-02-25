package com.dhia.gestiondestock.repository;

import com.dhia.gestiondestock.model.Category;
import com.dhia.gestiondestock.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommandeRepository extends JpaRepository<Commande, Integer> {


}
