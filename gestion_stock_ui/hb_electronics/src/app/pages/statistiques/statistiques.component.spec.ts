
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatistiquesComponent } from './statistiques.component';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { of } from 'rxjs';
import { LigneCommandeDto } from 'src/gs-api/src/models';

describe('StatistiquesComponent', () => {
  let component: StatistiquesComponent;
  let fixture: ComponentFixture<StatistiquesComponent>;
  let mockCommandeService: jasmine.SpyObj<CommandeService>;

  beforeEach(async () => {
    mockCommandeService = jasmine.createSpyObj('CommandeService', [
      'findAllCommandesClient',
      'findAllLigneCommandesClient'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StatistiquesComponent],
      providers: [{ provide: CommandeService, useValue: mockCommandeService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiquesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load commandes and compute top 5 articles', fakeAsync(() => {
    const fakeCommandes = [
      { id: 1, dateCommande: new Date().toISOString() },
      { id: 2, dateCommande: new Date().toISOString() }
    ];
    const fakeLignes: LigneCommandeDto[] = [
      { quantite: 5, article: { id: 1, designation: 'Article A', prixAchat: 10, prixVente: 20 } },
      { quantite: 3, article: { id: 2, designation: 'Article B', prixAchat: 15, prixVente: 25 } },
    ];
  
    mockCommandeService.findAllCommandesClient.and.returnValue(of(fakeCommandes));
    mockCommandeService.findAllLigneCommandesClient.and.returnValue(of(fakeLignes));
  
    fixture.detectChanges(); // ngOnInit
    tick(); // résout findAllCommandes() + observables
    tick(1000); // résout le setTimeout de ngAfterViewInit
  
    expect(component.listeCommandes.length).toBe(2);
    expect(component.mapLignesCommande.size).toBe(2);
    expect(component.top5ArticlesMois.length).toBeGreaterThan(0);
    expect(component.top5ArticlesTousLesMois.length).toBeGreaterThan(0);
  }));
  

  it('should calculate top 5 articles correctly', () => {
    const commandes = [
      { id: 1 },
      { id: 2 }
    ];
    component.listeCommandes = commandes;

    const lignes1: LigneCommandeDto[] = [
      { quantite: 2, article: { id: 1, designation: 'Article A' } },
      { quantite: 4, article: { id: 2, designation: 'Article B' } }
    ];
    const lignes2: LigneCommandeDto[] = [
      { quantite: 1, article: { id: 1, designation: 'Article A' } }
    ];

    component.mapLignesCommande.set(1, lignes1);
    component.mapLignesCommande.set(2, lignes2);

    const result = component.calculerTop5Articles(commandes);

    expect(result.length).toBeLessThanOrEqual(5);
    expect(result[0].designation).toBe('Article B'); // 4 unités
    expect(result[1].designation).toBe('Article A'); // 2+1 = 3 unités
  });

  it('should return current month commandes', () => {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    component.listeCommandes = [
      { id: 1, dateCommande: now.toISOString() },
      { id: 2, dateCommande: lastMonth.toISOString() }
    ];

    const result = component.commandesMoisCourant();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });
});
