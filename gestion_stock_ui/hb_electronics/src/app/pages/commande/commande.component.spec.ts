import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandeComponent } from './commande.component';
import { Router } from '@angular/router';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';

describe('CommandeComponent', () => {
  let component: CommandeComponent;
  let fixture: ComponentFixture<CommandeComponent>;
  let mockCommandeService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCommandeService = {
      findAllCommandesClient: jasmine.createSpy('findAllCommandesClient').and.returnValue(of([{ id: 1, dateCommande: new Date().toISOString() }])),
      findAllLigneCommandesClient: jasmine.createSpy('findAllLigneCommandesClient').and.returnValue(of([{ prixVente: 100, quantite: 2 }])),
      exportPdf: jasmine.createSpy('exportPdf').and.returnValue(of(new Blob(['test'], { type: 'application/pdf' }))),
      deleteCommande: jasmine.createSpy('deleteCommande').and.returnValue(of({}))
    };

    mockRouter = { navigate: jasmine.createSpy('navigate') };

  await TestBed.configureTestingModule({
    declarations: [CommandeComponent],
    providers: [
      { provide: CommandeService, useValue: mockCommandeService },
      { provide: Router, useValue: mockRouter },
      { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();

  fixture = TestBed.createComponent(CommandeComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch commandes and lignes on init', () => {
    expect(mockCommandeService.findAllCommandesClient).toHaveBeenCalled();
    expect(component.listeCommandes.length).toBeGreaterThan(0);
  });

  it('should navigate to nouvelle commande', () => {
    component.nouvelleCommande();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['nouvellecommandeclt']);
  });

  it('should emit on bouttonNouveauClick', () => {
    spyOn(component.clickEvent, 'emit');
    component.bouttonNouveauClick();
    expect(component.clickEvent.emit).toHaveBeenCalled();
  });

  it('should calculate total correctly', () => {
    const total = component.calculerTatalCmd([{ prixVente: 10, quantite: 2 }]);
    expect(total).toBe(20);
  });

  it('should handle PDF export', () => {
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
    const clickSpy = spyOn(document, 'createElement').and.callThrough();

    component.exportPdf(1);
    expect(mockCommandeService.exportPdf).toHaveBeenCalledWith(1);
    expect(clickSpy).toHaveBeenCalled();
  });


  it('should organize commandes by date and calculate total', () => {
    component.organiserCommandesParDate();
    component.calculerTotalParDate();
    expect(component.commandesParDate.size).toBeGreaterThan(0);
  });

  it('should search by date', () => {
    const today = new Date().toISOString().split('T')[0];
    component.searchDate = today;
    component.onSearch();
    expect(component.commandesParDate.has(today)).toBeTrue();
  });
});
