import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelCommandeComponent } from './nouvel-commande.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article/article.service';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { of, throwError } from 'rxjs';
import { CommandeDto } from 'src/gs-api/src/models';

describe('NouvelCommandeComponent', () => {
  let component: NouvelCommandeComponent;
  let fixture: ComponentFixture<NouvelCommandeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockArticleService: jasmine.SpyObj<ArticleService>;
  let mockCommandeService: jasmine.SpyObj<CommandeService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockArticleService = jasmine.createSpyObj('ArticleService', ['findAllArticles', 'updateArticle']);
    mockCommandeService = jasmine.createSpyObj('CommandeService', ['enregistrerCommandeClient', 'exportPdf']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], 
      declarations: [NouvelCommandeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: CommandeService, useValue: mockCommandeService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelCommandeComponent);
    component = fixture.componentInstance;

    mockArticleService.findAllArticles.and.returnValue(of([
      { id: 1, codeArticle: 'ART1', designation: 'Article 1', in_stock: 10, prixVente: 100 },
      { id: 2, codeArticle: 'ART2', designation: 'Article 2', in_stock: 5, prixVente: 50 }
    ]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load articles on init', () => {
    expect(component.listArticle.length).toBe(2);
    expect(mockArticleService.findAllArticles).toHaveBeenCalled();
  });

  it('should filter articles based on codeArticle', () => {
    component.codeArticle = 'ART1';
    component.filtrerArticle();
    expect(component.listArticle.length).toBe(1);
  });

  it('should not add line if quantity exceeds stock', () => {
    component.searchedArticle = { id: 1, codeArticle: 'ART1', in_stock: 2, prixVente: 100 };
    component.quantite = '5';
    component.ajouterLigneCommande();
    expect(component.lignesCommande.length).toBe(0);
    expect(component.errorMsg.length).toBe(1);
  });

  it('should add line if quantity is valid', () => {
    component.searchedArticle = { id: 1, codeArticle: 'ART1', in_stock: 10, prixVente: 100 };
    component.quantite = '2';
    component.ajouterLigneCommande();
    expect(component.lignesCommande.length).toBe(1);
    expect(component.totalCommande).toBe(200);
  });

  it('should call enregistrerCommande and navigate', () => {
    component.searchedArticle = { id: 1, codeArticle: 'ART1', in_stock: 10, prixVente: 100 };
    component.quantite = '2';
    component.ajouterLigneCommande();

    const mockCommande: CommandeDto = { id: 123 };
    mockCommandeService.enregistrerCommandeClient.and.returnValue(of(mockCommande));
    mockArticleService.updateArticle.and.returnValue(of({}));

    component.enregistrerCommande();

    expect(mockCommandeService.enregistrerCommandeClient).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['commandesclient']);
  });

  it('should handle error when enregistrerCommande fails', () => {
    const errorResponse = { error: { errors: ['Erreur serveur'] } };
    mockCommandeService.enregistrerCommandeClient.and.returnValue(throwError(() => errorResponse));
    component.lignesCommande = [{ article: { id: 1, codeArticle: 'ART1' }, prixVente: 100, quantite: 1 }];

    component.enregistrerCommande();

    expect(component.errorMsg).toContain('Erreur serveur');
  });

});
