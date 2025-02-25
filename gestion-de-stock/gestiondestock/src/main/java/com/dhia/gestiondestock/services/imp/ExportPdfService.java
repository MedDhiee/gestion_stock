package com.dhia.gestiondestock.services.imp;

import com.dhia.gestiondestock.dto.LigneCommandeDto;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.util.List;



@Service
public class ExportPdfService {

    public static ByteArrayInputStream generatePdfReport(List<LigneCommandeDto> lignesCommande, int commandeId) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            String logoPath = "C:\\Users\\meddh\\Downloads\\gestiondestock\\gestiondestock\\src\\main\\java\\com\\dhia\\gestiondestock\\img\\logo.png";
            Image logo = Image.getInstance(logoPath);
            logo.scaleToFit(250, 125); // Adjust the size of the logo
            float x = document.left();
            float y = document.top() - logo.getScaledHeight() + document.topMargin()+20;
            logo.setAbsolutePosition(x, y);
            document.add(logo);

            // Titre du document avec padding
            Paragraph title = new Paragraph("Facture N° " + commandeId, FontFactory.getFont(FontFactory.TIMES_BOLD, 15, Font.BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20); // Ajoute un padding après le titre
            document.add(title);

            // Ajouter les lignes de commande dans un tableau
            PdfPTable table = new PdfPTable(4); // Nombre de colonnes
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            // En-tête du tableau
            PdfPCell cell;

            cell = new PdfPCell(new Paragraph("Article", FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD)));
            table.addCell(cell);

            cell = new PdfPCell(new Paragraph("Quantité", FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD)));
            table.addCell(cell);

            cell = new PdfPCell(new Paragraph("Prix de vente", FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD)));
            table.addCell(cell);

            cell = new PdfPCell(new Paragraph("Total ligne", FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD)));
            table.addCell(cell);

            // Remplissage des lignes de commande et calcul du total des prix de ventes
            BigDecimal totalPrixVentes = BigDecimal.ZERO;
            for (LigneCommandeDto ligne : lignesCommande) {
                table.addCell(ligne.getArticle().getDesignation());
                table.addCell(String.valueOf(ligne.getQuantite()));
                table.addCell(ligne.getPrixVente().toString());

                // Calculer le total de la ligne
                BigDecimal prixVente = new BigDecimal(ligne.getPrixVente().toString());
                BigDecimal quantite = new BigDecimal(String.valueOf(ligne.getQuantite()));
                BigDecimal totalLigne = prixVente.multiply(quantite);
                table.addCell(totalLigne.toString());

                totalPrixVentes = totalPrixVentes.add(totalLigne);
            }
            document.add(table);
            // Ajouter le total des prix de ventes après la table
            Paragraph totalPrixVentesParagraph = new Paragraph("Total : " + totalPrixVentes, FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD));
            totalPrixVentesParagraph.setAlignment(Element.ALIGN_RIGHT);
            totalPrixVentesParagraph.setSpacingBefore(20); // Ajoute un padding avant le total des prix de ventes
            document.add(totalPrixVentesParagraph);

            // Ajouter "Cachet :" à la fin de la page
            Paragraph cachet = new Paragraph("Cachet :", FontFactory.getFont(FontFactory.TIMES_BOLD, 12, Font.BOLD));
            cachet.setAlignment(Element.ALIGN_RIGHT);
            cachet.setSpacingBefore(20); // Ajoute un padding avant "Cachet :"
            document.add(cachet);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
