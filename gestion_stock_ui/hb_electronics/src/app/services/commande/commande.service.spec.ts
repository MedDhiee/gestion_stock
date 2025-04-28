import { TestBed } from '@angular/core/testing';
import { CommandeService } from './commande.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommandesclientsService } from 'src/gs-api/src/services/commande-controller.service';
import { of, throwError } from 'rxjs';
import { CommandeDto, LigneCommandeDto } from 'src/gs-api/src/models';

describe('CommandeService', () => {
  let service: CommandeService;
  let httpMock: HttpTestingController;
  let mockCommandeClientService: jasmine.SpyObj<CommandesclientsService>;

  beforeEach(() => {
    mockCommandeClientService = jasmine.createSpyObj('CommandesclientsService', ['save', 'findAll', 'findAllLignesCommandesClientByCommandeClientId', 'delete', 'updateQuantiteCommande']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommandeService,
        { provide: CommandesclientsService, useValue: mockCommandeClientService }
      ]
    });

    service = TestBed.inject(CommandeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('enregistrerCommandeClient', () => {
    it('should call save method and return saved commande', () => {
      const commandeDto: CommandeDto = { id: 1, dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION', ligneCommande: [] };

      mockCommandeClientService.save.and.returnValue(of(commandeDto));

      service.enregistrerCommandeClient(commandeDto).subscribe((response) => {
        expect(response).toEqual(commandeDto);
      });

      expect(mockCommandeClientService.save).toHaveBeenCalledWith(commandeDto);
    });

    it('should handle error', () => {
      const errorResponse = { error: { message: 'Error' } };
      const commandeDto: CommandeDto = { id: 1, dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION', ligneCommande: [] };

      mockCommandeClientService.save.and.returnValue(throwError(() => errorResponse));

      service.enregistrerCommandeClient(commandeDto).subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(errorResponse);
        }
      });
    });
  });

  describe('findAllCommandesClient', () => {
    it('should return a list of commandes', () => {
      const commandes: CommandeDto[] = [{ id: 1, dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION', ligneCommande: [] }];

      mockCommandeClientService.findAll.and.returnValue(of(commandes));

      service.findAllCommandesClient().subscribe((response) => {
        expect(response).toEqual(commandes);
      });

      expect(mockCommandeClientService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllLigneCommandesClient', () => {
    it('should return lignes for a given commande', () => {
      const lignes: LigneCommandeDto[] = [{ article: { id: 1, codeArticle: 'ART1' }, prixVente: 100, quantite: 1 }];
      const idCommande = 1;

      mockCommandeClientService.findAllLignesCommandesClientByCommandeClientId.and.returnValue(of(lignes));

      service.findAllLigneCommandesClient(idCommande).subscribe((response) => {
        expect(response).toEqual(lignes);
      });

      expect(mockCommandeClientService.findAllLignesCommandesClientByCommandeClientId).toHaveBeenCalledWith(idCommande);
    });

    it('should return empty array when no id is provided', () => {
      service.findAllLigneCommandesClient().subscribe((response) => {
        expect(response).toEqual([]);
      });

      expect(mockCommandeClientService.findAllLignesCommandesClientByCommandeClientId).not.toHaveBeenCalled();
    });
  });

  describe('exportPdf', () => {
    it('should call the export service and return pdf blob', () => {
      const commandeId = 1;
      const mockBlob = new Blob([], { type: 'application/pdf' });

      service.exportPdf(commandeId).subscribe((blob) => {
        expect(blob).toEqual(mockBlob);
      });

      const req = httpMock.expectOne(`http://localhost:8081/commandes/${commandeId}/export/pdf`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlob);
    });

    it('should handle error when exporting pdf', () => {
      const commandeId = 1;
      const errorResponse = { error: { message: 'Error' } };

      service.exportPdf(commandeId).subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(errorResponse);
        }
      });

      const blob = new Blob(['PDF content'], { type: 'application/pdf' });
      const req = httpMock.expectOne('http://localhost:8081/commandes/1/export/pdf');
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('blob');

      // Utiliser un vrai Blob
      req.flush(blob);
    });
  });

  describe('deleteCommande', () => {
    it('should call delete and handle success', () => {
      const idCommande = 1;

      mockCommandeClientService.delete.and.returnValue(of(null));

      service.deleteCommande(idCommande).subscribe((response) => {
        expect(response).toBeNull();
      });

      expect(mockCommandeClientService.delete).toHaveBeenCalledWith(idCommande);
    });

    it('should handle error when deleting commande', () => {
      const errorResponse = { error: { message: 'Error' } };
      const idCommande = 1;

      mockCommandeClientService.delete.and.returnValue(throwError(() => errorResponse));

      service.deleteCommande(idCommande).subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(errorResponse);
        }
      });
    });
  });

  describe('updateQuantiteCommande', () => {
    it('should update quantity and return updated commande', () => {
      const idCommande = 1;
      const idLigneCommande = 1;
      const quantite = 2;
      const mockCommande: CommandeDto = { id: idCommande, dateCommande: new Date().toISOString(), etatCommande: 'EN_PREPARATION', ligneCommande: [] };

      mockCommandeClientService.updateQuantiteCommande.and.returnValue(of(mockCommande));

      service.updateQuantiteCommande(idCommande, idLigneCommande, quantite).subscribe((response) => {
        expect(response).toEqual(mockCommande);
      });

      expect(mockCommandeClientService.updateQuantiteCommande).toHaveBeenCalledWith({ idCommande, idLigneCommande, quantite });
    });

    it('should handle error when updating quantity', () => {
      const errorResponse = { error: { message: 'Error' } };
      const idCommande = 1;
      const idLigneCommande = 1;
      const quantite = 2;

      mockCommandeClientService.updateQuantiteCommande.and.returnValue(throwError(() => errorResponse));

      service.updateQuantiteCommande(idCommande, idLigneCommande, quantite).subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toEqual(errorResponse);
        }
      });
    });
  });
});
