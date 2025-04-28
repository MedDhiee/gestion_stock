
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from 'src/app/composants/menu/menu.component';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FactureComponent } from './facture.component';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { of } from 'rxjs';
import { LigneCommandeDto } from 'src/gs-api/src/models';

describe('FactureComponent', () => {
  let component: FactureComponent;
  let fixture: ComponentFixture<FactureComponent>;
  let mockCommandeService: jasmine.SpyObj<CommandeService>;

  beforeEach(async () => {
    mockCommandeService = jasmine.createSpyObj('CommandeService', [
      'findAllCommandesClient',
      'findAllLigneCommandesClient'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], 
      declarations: [ FactureComponent, MenuComponent ],
      providers: [
        { provide: CommandeService, useValue: mockCommandeService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load commandes and calculate totals', fakeAsync(() => {
    const fakeCommandes = [
      { id: 1, dateCommande: '2024-01-15' },
      { id: 2, dateCommande: '2024-01-16' }
    ];
    const fakeLignes: LigneCommandeDto[] = [
      { quantite: 2, prixVente: 100, article: { prixAchat: 70 } },
      { quantite: 1, prixVente: 150, article: { prixAchat: 120 } }
    ];

    mockCommandeService.findAllCommandesClient.and.returnValue(of(fakeCommandes));
    mockCommandeService.findAllLigneCommandesClient.and.returnValue(of(fakeLignes));

    fixture.detectChanges(); // ngOnInit

    tick(); // simulate async

    expect(component.listeCommandes.length).toBe(2);
    expect(component.mapLignesCommande.size).toBe(2);
    expect(component.totalParMois.size).toBeGreaterThan(0);
    expect(component.totalPrixAchatParMois.size).toBeGreaterThan(0);
    expect(component.beneficeParMois.size).toBeGreaterThan(0);
  }));

  it('should calculate correct total for lignes commande', () => {
    const lignes: LigneCommandeDto[] = [
      { quantite: 2, prixVente: 50 },
      { quantite: 3, prixVente: 20 }
    ];
    const total = component.calculerTatalCmd(lignes);
    expect(total).toBe(2 * 50 + 3 * 20);
  });

  it('should calculate final benefit correctly', () => {
    component.beneficeSelectionne = 1000;
    component.salaireOuvrier = 300;
    component.facturesInternetSteg = 200;

    component.calculerBeneficeFinal();

    expect(component.beneficeFinal).toBe(500);
  });

  it('should return 0 if total commande not found', () => {
    const result = component.calculerTotalCommande(123);
    expect(result).toBe(0);
  });
});
