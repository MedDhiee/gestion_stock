import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { LigneCommandeDto } from 'src/gs-api/src/models';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit, AfterViewInit {

  listeCommandes: Array<any> = [];
  mapLignesCommande = new Map();
  top5ArticlesMois: any[] = [];
  top5ArticlesTousLesMois: any[] = [];

  constructor(private cmdCltFrsService: CommandeService) { }

  ngOnInit(): void {
    this.findAllCommandes();
  }

  ngAfterViewInit(): void {
    // Configure the charts after the view initializes
    setTimeout(() => {
      this.renderChart('chartMois', this.top5ArticlesMois);
      this.renderChart('chartTousLesMois', this.top5ArticlesTousLesMois);
    }, 1000);
  }

  findAllCommandes(): void {
    this.cmdCltFrsService.findAllCommandesClient()
      .subscribe(cmd => {
        this.listeCommandes = cmd;
        this.findAllLignesCommande(() => {
          this.top5ArticlesMois = this.calculerTop5Articles(this.commandesMoisCourant());
          this.top5ArticlesTousLesMois = this.calculerTop5Articles(this.listeCommandes);
          this.renderChart('chartMois', this.top5ArticlesMois);
          this.renderChart('chartTousLesMois', this.top5ArticlesTousLesMois);
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
        if (callback) callback();
      });
  }

  commandesMoisCourant(): Array<any> {
    const dateActuelle = new Date();
    const moisCourant = dateActuelle.getMonth();
    const anneeCourante = dateActuelle.getFullYear();
    return this.listeCommandes.filter(cmd => {
      const dateCommande = new Date(cmd.dateCommande);
      return dateCommande.getMonth() === moisCourant && dateCommande.getFullYear() === anneeCourante;
    });
  }

  calculerTop5Articles(commandes: Array<any>): any[] {
    const ventesParArticle = new Map();

    commandes.forEach(cmd => {
      const lignesCommande = this.mapLignesCommande.get(cmd.id);
      lignesCommande.forEach((ligne: LigneCommandeDto) => {
        const article = ligne.article;
        const quantite = ligne.quantite || 0;

        if (article) {
          if (!ventesParArticle.has(article.id)) {
            ventesParArticle.set(article.id, { quantite: 0, designation: article.designation });
          }

          ventesParArticle.get(article.id).quantite += quantite;
        }
      });
    });

    const ventesArray = Array.from(ventesParArticle.values());
    ventesArray.sort((a, b) => b.quantite - a.quantite);
    return ventesArray.slice(0, 5);
  }

  renderChart(elementId: string, data: any[]): void {
    const ctx = document.getElementById(elementId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.designation),
        datasets: [{
          label: 'Quantité vendue',
          data: data.map(d => d.quantite),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
