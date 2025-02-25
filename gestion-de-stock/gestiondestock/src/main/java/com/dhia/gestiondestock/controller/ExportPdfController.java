package com.dhia.gestiondestock.controller;

import com.dhia.gestiondestock.dto.CommandeDto;
import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.dhia.gestiondestock.services.CommandeService;
import com.dhia.gestiondestock.services.imp.ExportPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/commandes")
public class ExportPdfController {
    @Autowired
    private CommandeService commandeService;

    @Autowired
    private ExportPdfService exportPdfService;

    public ExportPdfController(CommandeService commandeService, ExportPdfService exportPdfService) {
        this.commandeService = commandeService;
        this.exportPdfService = exportPdfService;
    }
    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportCommandePdf(@PathVariable Integer id) {
        // Log pour vérifier l'ID reçu
        System.out.println("Received request for Commande ID: " + id);

        // Récupérer la commande à partir de l'ID
        CommandeDto commande = commandeService.findById(id);

        // Log pour vérifier la commande récupérée
        System.out.println("Commande found: " + commande);

        // Vérifier si la commande existe
        if (commande == null) {
            // Log pour vérifier le cas de commande non trouvée
            System.out.println("Commande not found for ID: " + id);
            // Gérer le cas où la commande n'est pas trouvée (renvoyer une ResponseEntity avec erreur 404, par exemple)
            return ResponseEntity.notFound().build();
        }

        // Récupérer les lignes de commande à partir de la commande récupérée
        List<LigneCommandeDto> lignesCommande = commande.getLigneCommande();

        // Vérifier si des lignes de commande existent
        if (lignesCommande == null || lignesCommande.isEmpty()) {
            // Log pour vérifier le cas de lignes de commande non trouvées
            System.out.println("No lignesCommande found for Commande ID: " + id);
            // Gérer le cas où aucune ligne de commande n'est trouvée (renvoyer une ResponseEntity avec erreur 404 ou 204, par exemple)
            return ResponseEntity.notFound().build();
        }

        // Générer le rapport PDF à partir des lignes de commande récupérées
        ByteArrayInputStream bais = exportPdfService.generatePdfReport(lignesCommande,id);

        // Préparer les en-têtes HTTP pour la réponse
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=facture_" + id + ".pdf");

        // Renvoyer la réponse avec le PDF en tant que flux d'octets
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bais.readAllBytes());
    }

}
