package com.dhia.gestiondestock.services.imp;

import com.dhia.gestiondestock.dto.*;
import com.dhia.gestiondestock.exception.EntityNotFoundException;
import com.dhia.gestiondestock.exception.ErrorCodes;
import com.dhia.gestiondestock.exception.InvalidEntityException;
import com.dhia.gestiondestock.exception.InvalidOperationException;
import com.dhia.gestiondestock.model.*;
import com.dhia.gestiondestock.repository.ArticleRepository;
import com.dhia.gestiondestock.repository.CommandeRepository;
import com.dhia.gestiondestock.repository.LigneCommandeRepository;
import com.dhia.gestiondestock.services.CommandeService;
import com.dhia.gestiondestock.services.MvtStkService;
import com.dhia.gestiondestock.validator.ArticleValidator;
import com.dhia.gestiondestock.validator.CommandeValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CommandeServiceImpl implements CommandeService {
    private CommandeRepository commandeRepository;
    private ArticleRepository articleRepository;
    private MvtStkService mvtStkService;

    private LigneCommandeRepository ligneCommandeRepository;

    @Autowired
    public CommandeServiceImpl(CommandeRepository commandeRepository,
                               ArticleRepository articleRepository,LigneCommandeRepository ligneCommandeRepository,MvtStkService mvtStkService) {
        this.articleRepository = articleRepository;
        this.commandeRepository = commandeRepository;
        this.mvtStkService = mvtStkService;
        this.ligneCommandeRepository = ligneCommandeRepository;
    }

    @Override
    public CommandeDto save(CommandeDto dto) {
        List<String> errors = CommandeValidator.validate(dto);
        if (!errors.isEmpty()) {
            log.error("Commande is not valid {}", dto);
            throw new InvalidEntityException("La commande n'est pas valide", ErrorCodes.COMMANDE_NOT_VALID, errors);
        }
        List<String> articleErrors = new ArrayList<>();

        if (dto.getLigneCommande() != null) {
            dto.getLigneCommande().forEach(ligCmdClt -> {
                if (ligCmdClt.getArticle() != null) {
                    Optional<Article> article = articleRepository.findById(ligCmdClt.getArticle().getId());
                    if (article.isEmpty()) {
                        articleErrors.add("L'article avec l'ID " + ligCmdClt.getArticle().getId() + " n'existe pas");
                    }
                } else {
                    articleErrors.add("Impossible d'enregister une commande avec un aticle NULL");
                }
            });
        }

        if (!articleErrors.isEmpty()) {
            log.warn("");
            throw new InvalidEntityException("Article n'existe pas dans la BDD", ErrorCodes.ARTICLE_NOT_FOUND, articleErrors);
        }
        dto.setDateCommande(Instant.now());
        Commande savedCmdClt = commandeRepository.save(CommandeDto.toEntity(dto));

        if (dto.getLigneCommande() != null) {
            dto.getLigneCommande().forEach(ligCmdClt -> {
                LigneCommande ligneCommandeClient = LigneCommandeDto.toEntity(ligCmdClt);
                ligneCommandeClient.setCommande(savedCmdClt);
                LigneCommande savedLigneCmd = ligneCommandeRepository.save(ligneCommandeClient);

                effectuerSortie(savedLigneCmd);
            });
        }

        return CommandeDto.fromEntity(savedCmdClt);
    }

    @Override
    public CommandeDto findById(Integer id) {
        Commande commande = commandeRepository.findById(id).orElse(null);
        if (commande == null) {
            return null; // Gérer le cas où la commande n'est pas trouvée
        }
        return CommandeDto.fromEntity(commande); // Assurez-vous que cette méthode convertit également les lignes de commande
    }

    @Override
    public List<CommandeDto> findAll() {
        return commandeRepository.findAll().stream()
                .map(CommandeDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Integer id) {
        if (id == null) {
            log.error("Commande client ID is NULL");
            return;
        }
        List<LigneCommande> ligneCommandeClients = ligneCommandeRepository.findAllByCommandeId(id);
        if (!ligneCommandeClients.isEmpty()) {
            // Deleting all the line items associated with the command
            ligneCommandeClients.forEach(ligneCommande -> {
                ligneCommandeRepository.delete(ligneCommande);
            });
        }
        commandeRepository.deleteById(id);
    }


    private void checkIdCommande(Integer idCommande) {
        if (idCommande == null) {
            log.error("Commande client ID is NULL");
            throw new InvalidOperationException("Impossible de modifier l'etat de la commande avec un ID null",
                    ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }
    }
    private CommandeDto checkEtatCommande(Integer idCommande) {
        CommandeDto commandeClient = findById(idCommande);
        if (commandeClient.isCommandeLivree()) {
            throw new InvalidOperationException("Impossible de modifier la commande lorsqu'elle est livree", ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }
        return commandeClient;
    }

    @Override
    public CommandeDto updateEtatCommande(Integer idCommande, EtatCommande etatCommande) {
        checkIdCommande(idCommande);
        if (!StringUtils.hasLength(String.valueOf(etatCommande))) {
            log.error("L'etat de la commande client is NULL");
            throw new InvalidOperationException("Impossible de modifier l'etat de la commande avec un etat null",
                    ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }
        CommandeDto commandeClient = checkEtatCommande(idCommande);
        commandeClient.setEtatCommande(etatCommande);

        Commande savedCmdClt = commandeRepository.save(CommandeDto.toEntity(commandeClient));
        if (commandeClient.isCommandeLivree()) {
            updateMvtStk(idCommande);
        }

        return CommandeDto.fromEntity(savedCmdClt);
    }

    @Override
    public CommandeDto updateQuantiteCommande(Integer idCommande, Integer idLigneCommande, BigDecimal quantite) {
        checkIdCommande(idCommande);
        checkIdLigneCommande(idLigneCommande);

        if (quantite == null || quantite.compareTo(BigDecimal.ZERO) == 0) {
            log.error("L'ID de la ligne commande is NULL");
            throw new InvalidOperationException("Impossible de modifier l'etat de la commande avec une quantite null ou ZERO",
                    ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }

        CommandeDto commandeClient = checkEtatCommande(idCommande);
        Optional<LigneCommande> ligneCommandeClientOptional = findLigneCommande(idLigneCommande);

        LigneCommande ligneCommandeClient = ligneCommandeClientOptional.get();
        ligneCommandeClient.setQuantite(quantite);
        ligneCommandeRepository.save(ligneCommandeClient);

        return commandeClient;
    }
    private void checkIdLigneCommande(Integer idLigneCommande) {
        if (idLigneCommande == null) {
            log.error("L'ID de la ligne commande is NULL");
            throw new InvalidOperationException("Impossible de modifier l'etat de la commande avec une ligne de commande null",
                    ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }
    }
    private Optional<LigneCommande> findLigneCommande(Integer idLigneCommande) {
        Optional<LigneCommande> ligneCommandeClientOptional = ligneCommandeRepository.findById(idLigneCommande);
        if (ligneCommandeClientOptional.isEmpty()) {
            throw new EntityNotFoundException(
                    "Aucune ligne commande client n'a ete trouve avec l'ID " + idLigneCommande, ErrorCodes.COMMANDE_CLIENT_NOT_FOUND);
        }
        return ligneCommandeClientOptional;
    }
    @Override
    public List<LigneCommandeDto> findAllLignesCommandesClientByCommandeClientId(Integer idCommande) {
        return ligneCommandeRepository.findAllByCommandeId(idCommande).stream()
                .map(LigneCommandeDto::fromEntity)
                .collect(Collectors.toList());
    }

    private void updateMvtStk(Integer idCommande) {
        List<LigneCommande> ligneCommandeClients = ligneCommandeRepository.findAllByCommandeId(idCommande);
        ligneCommandeClients.forEach(lig -> {
            effectuerSortie(lig);
        });
    }

    private void effectuerSortie(LigneCommande lig) {
        MvtStkDto mvtStkDto = MvtStkDto.builder()
                .article(ArticleDto.fromEntity(lig.getArticle()))
                .dateMvt(Instant.now())
                .typeMvt(TypeMvtStk.SORTIE)
                .quantite(lig.getQuantite())
                .build();
        mvtStkService.sortieStock(mvtStkDto);
    }

    @Override
    public CommandeDto updateArticle(Integer idCommande, Integer idLigneCommande, Integer idArticle) {
        checkIdCommande(idCommande);
        checkIdLigneCommande(idLigneCommande);
        checkIdArticle(idArticle, "nouvel");

        CommandeDto commandeClient = findById(idCommande);

        Optional<LigneCommande> ligneCommande = findLigneCommande(idLigneCommande);

        Optional<Article> articleOptional = articleRepository.findById(idArticle);
        if (articleOptional.isEmpty()) {
            throw new EntityNotFoundException(
                    "Aucune article n'a ete trouve avec l'ID " + idArticle, ErrorCodes.ARTICLE_NOT_FOUND);
        }

        List<String> errors = ArticleValidator.validate(ArticleDto.fromEntity(articleOptional.get()));
        if (!errors.isEmpty()) {
            throw new InvalidEntityException("Article invalid", ErrorCodes.ARTICLE_NOT_VALID, errors);
        }

        LigneCommande ligneCommandeClientToSaved = ligneCommande.get();
        ligneCommandeClientToSaved.setArticle(articleOptional.get());
        ligneCommandeRepository.save(ligneCommandeClientToSaved);

        return commandeClient;
    }
    @Override
    public CommandeDto deleteArticle(Integer idCommande, Integer idLigneCommande) {
        checkIdCommande(idCommande);
        checkIdLigneCommande(idLigneCommande);

        CommandeDto commandeClient = findById(idCommande);
        // Just to check the LigneCommandeClient and inform the client in case it is absent
        findLigneCommande(idLigneCommande);
        ligneCommandeRepository.deleteById(idLigneCommande);

        return commandeClient;
    }
    private void checkIdArticle(Integer idArticle, String msg) {
        if (idArticle == null) {
            log.error("L'ID de " + msg + " is NULL");
            throw new InvalidOperationException("Impossible de modifier l'etat de la commande avec un " + msg + " ID article null",
                    ErrorCodes.COMMANDE_CLIENT_NON_MODIFIABLE);
        }
    }
}
