import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { CommandeDto, LigneCommandeDto } from 'src/gs-api/src/models';
@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {

  listeCommandes: Array<any> = [];
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
  commandesParDate: Map<string, any[]> = new Map();
  totalParDate: Map<string, number> = new Map<string, number>();
  searchDate: string = '';

  constructor(
    private router: Router,
    private cmdCltFrsService: CommandeService,
    private cdr: ChangeDetectorRef
  ) { }
  @Input()
  commandeDto: CommandeDto = {};
  @Output()
  clickEvent = new EventEmitter();

  bouttonNouveauClick(): void {
    this.clickEvent.emit();
  }

  ngOnInit(): void {
    this.findAllCommandes();
  }

  findAllCommandes(): void {
    this.cmdCltFrsService.findAllCommandesClient()
      .subscribe(cmd => {
        this.listeCommandes = cmd;
        this.findAllLignesCommande(() => {
          this.organiserCommandesParDate();
          this.calculerTotalParDate();
          this.cdr.detectChanges(); // Détecter les changements après la mise à jour des données
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

  nouvelleCommande(): void {
    this.router.navigate(['nouvellecommandeclt']);
  }

  findLignesCommande(idCommande?: number, callback?: () => void): void {
    this.cmdCltFrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => {
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
        if (callback) callback();
        this.cdr.detectChanges(); // Détecter les changements après la mise à jour des données
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
    return total ? total : 0;
  }

  organiserCommandesParDate() {
    this.commandesParDate.clear();
    this.listeCommandes.forEach(cmd => {
      const date = new Date(cmd.dateCommande).toISOString().split('T')[0]; // Format date pour comparaison
      if (!this.commandesParDate.has(date)) {
        this.commandesParDate.set(date, []);
      }
      this.commandesParDate.get(date)?.push(cmd);
    });
  }

  calculerTotalParDate() {
    this.totalParDate.clear();
    this.commandesParDate.forEach((commandes, date) => {
      let total = 0;
      commandes.forEach(cmd => {
        total += this.calculerTotalCommande(cmd.id);
      });
      this.totalParDate.set(date, total);
    });
  }

  onSearch() {
    if (this.searchDate) {
      const filteredCommandes = this.listeCommandes.filter(cmd => new Date(cmd.dateCommande).toISOString().split('T')[0] === this.searchDate);
      this.commandesParDate.clear();
      filteredCommandes.forEach(cmd => {
        const date = new Date(cmd.dateCommande).toISOString().split('T')[0];
        if (!this.commandesParDate.has(date)) {
          this.commandesParDate.set(date, []);
        }
        this.commandesParDate.get(date)?.push(cmd);
      });
      this.calculerTotalParDate();
      this.cdr.detectChanges(); // Détecter les changements après la mise à jour des données
    }
  }

  exportPdf(commandeId: number): void {
    this.cmdCltFrsService.exportPdf(commandeId).subscribe((x) => {
      const blob = new Blob([x], { type: 'application/pdf' });
      const data = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = data;
      link.target = '_blank';
      link.download = 'facture'+commandeId+'.pdf';

      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    }, (error) => {
      console.error('Error exporting PDF:', error);
    });
  }

  // Trier les dates par ordre décroissant
  get filteredCommandesParDate() {
    const sortedDates = Array.from(this.commandesParDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const sortedMap = new Map();
    for (const date of sortedDates) {
      sortedMap.set(date, this.commandesParDate.get(date));
    }
    return sortedMap;
  }
  deleteCommande(id: number): void {
    this.cmdCltFrsService.deleteCommande(id).subscribe(() => {
      console.log('Commande supprimée');
      window.location.reload();
    }, (error) => {
      console.error('Erreur lors de la suppression de la commande :', error);
    });
  }

 
}
