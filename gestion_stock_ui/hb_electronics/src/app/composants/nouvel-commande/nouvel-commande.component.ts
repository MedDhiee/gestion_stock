import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article/article.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { ArticleDto, CommandeDto, LigneCommandeDto } from 'src/gs-api/src/models';

declare let window: any;

@Component({
  selector: 'app-nouvel-commande',
  templateUrl: './nouvel-commande.component.html',
  styleUrls: ['./nouvel-commande.component.scss']
})
export class NouvelCommandeComponent implements OnInit {

  searchedArticle: ArticleDto = {};
  listArticle: ArticleDto[] = [];
  codeArticle = '';
  quantite = '';
  commandeId: number | undefined;

  lignesCommande: LigneCommandeDto[] = [];
  totalCommande = 0;
  articleNotYetSelected = false;
  errorMsg: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly articleService: ArticleService,
    private readonly cmdCltFrsService: CommandeService
  ) { }

  ngOnInit(): void {
    this.findAllArticles();
  }

  findAllArticles(): void {
    this.articleService.findAllArticles().subscribe(articles => {
      this.listArticle = articles;
    });
  }

  filtrerArticle(): void {
    if (this.codeArticle.length === 0) {
      this.findAllArticles();
    }
    this.listArticle = this.listArticle.filter(art => 
      art.codeArticle?.includes(this.codeArticle) || 
      art.designation?.includes(this.codeArticle)
    );
  }

  ajouterLigneCommande(): void {
    this.errorMsg = [];  // Clear previous error messages
    if (this.checkStockQuantity()) {
      this.checkLigneCommande();
      this.calculerTotalCommande();

      this.searchedArticle = {};
      this.quantite = '';
      this.codeArticle = '';
      this.articleNotYetSelected = false;
      this.findAllArticles();
    }
  }

  calculerTotalCommande(): void {
    this.totalCommande = 0;
    this.lignesCommande.forEach(ligne => {
      if (ligne.prixVente && ligne.quantite) {
        this.totalCommande += +ligne.prixVente * +ligne.quantite;
      }
    });
  }

  private checkStockQuantity(): boolean {
    const inStock = this.searchedArticle.in_stock ?? 0;
    const quantityToOrder = +this.quantite;

    if (quantityToOrder > inStock) {
      this.errorMsg.push(`La quantité demandée (${quantityToOrder}) dépasse la quantité en stock (${inStock})`);
      return false;
    }

    return true;
  }

  private checkLigneCommande(): void {
    const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.searchedArticle.codeArticle);
    if (ligneCmdAlreadyExists) {
      this.lignesCommande.forEach(lig => {
        if (lig && lig.article?.codeArticle === this.searchedArticle.codeArticle) {
          lig.quantite = (lig.quantite ?? 0) + +this.quantite;
        }
      });
    } else {
      const ligneCmd: LigneCommandeDto = {
        article: this.searchedArticle,
        prixVente: this.searchedArticle.prixVente,
        quantite: +this.quantite
      };
      this.lignesCommande.push(ligneCmd);
    }
  }

  selectArticleClick(article: ArticleDto): void {
    this.searchedArticle = article;
    this.codeArticle = article.codeArticle ?? '';
    this.articleNotYetSelected = true;
  }

  enregistrerCommande(): void {
    const commande = this.preparerCommande();
    this.cmdCltFrsService.enregistrerCommandeClient(commande as CommandeDto).subscribe({
      next: (cmd) => {
        console.log('Commande enregistrée:', cmd); // Ajoutez ce log pour vérifier la réponse
        this.commandeId = cmd.id;
        console.log(cmd.id);

        // Update the quantities of the articles
        this.updateArticleQuantities();
        this.router.navigate(['commandesclient']);
      },
      error: (error) => {
        this.errorMsg = error.error.errors;
      }
    });
  }

  retour(): void {
    this.router.navigate(['commandesclient']);
  }

  private preparerCommande(): any {
    return {
      dateCommande: new Date().getTime(),
      etatCommande: 'EN_PREPARATION',
      ligneCommande: this.lignesCommande
    };
  }

  openExportModal(): void {
    const modal = new window.bootstrap.Modal(document.getElementById('exportModal'));
    modal.show();
  }

  confirmExport(): void {
    const commandeId = this.commandeId; // Utilisez l'ID de votre commande
    if (commandeId !== undefined) {
      this.cmdCltFrsService.exportPdf(commandeId).subscribe((x) => {
        const blob = new Blob([x], { type: 'application/pdf' });
        const data = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.target = '_blank';
        link.download = 'facture_'+commandeId+'.pdf';

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
      });
    } else {
      console.error('Commande ID is undefined.');
    }
  }

  private updateArticleQuantities(): void {
    this.lignesCommande.forEach(ligne => {
      if (ligne.article?.id && ligne.quantite) {
        const newStock = ligne.article.in_stock ? ligne.article.in_stock - ligne.quantite : -ligne.quantite;
        this.articleService.updateArticle(ligne.article.id, newStock).subscribe({
          next: (response) => {
            console.log('Article updated:', response);
          },
          error: (error) => {
            console.error('Error updating article:', error);
          }
        });
      }
    });
  }
  onKeyDownHandler(event: KeyboardEvent, article: any): void {
    // Add your logic here, for example:
    if (event.key === 'Enter') {
      this.selectArticleClick(article);
    }
  }
}
