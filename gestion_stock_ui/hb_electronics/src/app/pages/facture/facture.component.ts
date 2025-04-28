import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { LigneCommandeDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  listeCommandes: Array<any> = [];
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
  commandesParDate: Map<string, any[]> = new Map();
  totalParMois: Map<string, number> = new Map<string, number>();
  totalPrixAchatParMois: Map<string, number> = new Map<string, number>();
  beneficeParMois: Map<string, number> = new Map<string, number>();

  moisSelectionne: number | null = null; // Mois sélectionné pour la recherche
  anneeSelectionnee: number | null = null; // Année sélectionnée pour la recherche
  totalPrixVenteSelectionne: number | null = null;
  totalPrixAchatSelectionne: number | null = null;
  beneficeSelectionne: number | null = null;

  salaireOuvrier: number | null = null;
  facturesInternetSteg: number | null = null;
  beneficeFinal: number | null = null;

  constructor(
    private readonly cmdCltFrsService: CommandeService,
  ) { }

  ngOnInit(): void {
    this.findAllCommandes();
  }

  findAllCommandes(): void {
    this.cmdCltFrsService.findAllCommandesClient()
      .subscribe(cmd => {
        this.listeCommandes = cmd;
        this.findAllLignesCommande(() => {
          this.organiserCommandesParDate();
          this.calculerTotalParMois();
          this.calculerBeneficeParMois();
        });
      });
  }

  findAllLignesCommande(callback: () => void): void {
    let lignesCommandesCount = this.listeCommandes.length;
    this.listeCommandes.forEach(cmd => {
      this.findLignesCommande(cmd.id, () => {
        lignesCommandesCount--;
        if (lignesCommandesCount === 0) {
          callback();
        }
      });
    });
  }

  findLignesCommande(idCommande?: number, callback?: () => void): void {
    this.cmdCltFrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => {
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
        if (callback) callback();
      });
  }

  calculerTatalCmd(list: Array<LigneCommandeDto>): number {
    let total = 0;
    list.forEach(ligne => {
      if (ligne.prixVente && ligne.quantite) {
        total += +ligne.quantite * +ligne.prixVente;
      }
    });
    return Math.floor(total);
  }

  calculerTotalCommande(id?: number): number {
    const total = this.mapPrixTotalCommande.get(id);
    return total ?? 0;
  }

  organiserCommandesParDate() {
    this.commandesParDate.clear();
    this.listeCommandes.forEach(cmd => {
      const date = new Date(cmd.dateCommande).toLocaleDateString();
      if (!this.commandesParDate.has(date)) {
        this.commandesParDate.set(date, []);
      }
      this.commandesParDate.get(date)?.push(cmd);
    });
  }

  // Calculer les totaux par mois et par année pour les prix de ventes et d'achats
  calculerTotalParMois() {
    this.commandesParDate.forEach((commandes, date) => {  
      commandes.forEach(cmd => {
        const totalCommande = this.calculerTotalCommande(cmd.id);
        const dateCommande = new Date(cmd.dateCommande);
        const mois = dateCommande.getMonth() + 1; // Mois (1-12)
        const annee = dateCommande.getFullYear(); // Année
        const cle = `${mois}-${annee}`;

        // Calculer le total des prix d'achats pour chaque commande
        let totalPrixAchat = 0;
        const lignesCommandes = this.mapLignesCommande.get(cmd.id) ?? [];
        lignesCommandes.forEach((ligne: LigneCommandeDto) => {
          if (ligne.article && ligne.article.prixAchat && ligne.quantite) {
            totalPrixAchat += +ligne.quantite * +ligne.article.prixAchat;
          }
        });

        // Vérifier si la clé existe déjà dans totalParMois
        if (this.totalParMois.has(cle)) {
          this.totalParMois.set(cle, this.totalParMois.get(cle)! + totalCommande);
        } else {
          this.totalParMois.set(cle, totalCommande);
        }

        // Ajouter le total prix achat au mois
        if (this.totalPrixAchatParMois.has(cle)) {
          this.totalPrixAchatParMois.set(cle, this.totalPrixAchatParMois.get(cle)! + totalPrixAchat);
        } else {
          this.totalPrixAchatParMois.set(cle, totalPrixAchat);
        }
      });
    });

    // Afficher le total pour chaque mois dans la console
    this.totalParMois.forEach((total, cle) => {
      console.log(`Total prix de vente pour le mois ${cle}: ${total}`);
    });

    this.totalPrixAchatParMois.forEach((total, cle) => {
      console.log(`Total prix d'achat pour le mois ${cle}: ${total}`);
    });
  }

  // Calculer le bénéfice par mois
  calculerBeneficeParMois() {
    this.totalParMois.forEach((totalVente, cle) => {
      const totalAchat = this.totalPrixAchatParMois.get(cle) ?? 0;
      const benefice = totalVente - totalAchat;
      this.beneficeParMois.set(cle, benefice);
    });

    // Afficher le bénéfice pour chaque mois dans la console
    this.beneficeParMois.forEach((benefice, cle) => {
      console.log(`Bénéfice pour le mois ${cle}: ${benefice}`);
    });
  }

  rechercherParMoisEtAnnee() {
    if (this.moisSelectionne !== null && this.anneeSelectionnee !== null) {
      const cle = `${this.moisSelectionne}-${this.anneeSelectionnee}`;
      this.totalPrixVenteSelectionne = this.totalParMois.get(cle) ?? null;
      this.totalPrixAchatSelectionne = this.totalPrixAchatParMois.get(cle) ?? null;
      this.beneficeSelectionne = this.beneficeParMois.get(cle) ?? null;
    } else {
      this.totalPrixVenteSelectionne = null;
      this.totalPrixAchatSelectionne = null;
      this.beneficeSelectionne = null;
    }
  }

  calculerBeneficeFinal() {
    if (this.beneficeSelectionne !== null && this.salaireOuvrier !== null && this.facturesInternetSteg !== null) {
      this.beneficeFinal = this.beneficeSelectionne - this.salaireOuvrier - this.facturesInternetSteg;
    } else {
      this.beneficeFinal = null;
    }
  }
}
