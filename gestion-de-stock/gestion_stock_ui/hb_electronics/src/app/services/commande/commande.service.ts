import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CommandeDto, LigneCommandeDto } from 'src/gs-api/src/models';
import { CommandesclientsService } from 'src/gs-api/src/services/commande-controller.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private backendUrl = 'http://localhost:8081/commandes';
  constructor(
    private http:HttpClient,
    private commandeClientService: CommandesclientsService
  ) { }
  url = environment.apiUrl;
  enregistrerCommandeClient(commandeClient: CommandeDto): Observable<CommandeDto> {
    return this.commandeClientService.save(commandeClient).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement de la commande : ', error);
        throw error; // Propage l'erreur pour que d'autres composants puissent la gérer
      })
    );
  }
  

  findAllCommandesClient(): Observable<CommandeDto[]> {
    return this.commandeClientService.findAll();
  }



  findAllLigneCommandesClient(idCmd?: number): Observable<LigneCommandeDto[]> {
    if (idCmd) {
      return this.commandeClientService.findAllLignesCommandesClientByCommandeClientId(idCmd);
    }
    return of();
  }
  exportPdf(commandeId: number): Observable<Blob> {
    return this.http.get(`${this.backendUrl}/${commandeId}/export/pdf`, { responseType: 'blob' });
  }
  
  deleteCommande(idCommandeClient: number): Observable<null> {
    return this.commandeClientService.delete(idCommandeClient).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression de la commande : ', error);
        throw error;
      })
    );
  }

  updateQuantiteCommande(idCommande: number, idLigneCommande: number, quantite: number): Observable<CommandeDto> {
    return this.commandeClientService.updateQuantiteCommande({ idCommande, idLigneCommande, quantite }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour de la quantité de la commande : ', error);
        throw error;
      })
    );
  }
}