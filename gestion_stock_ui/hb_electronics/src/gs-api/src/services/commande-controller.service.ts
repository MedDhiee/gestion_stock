import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandeDto } from '../models/commande-dto';
import { LigneCommandeDto } from '../models/ligne-commande-dto';
@Injectable({
  providedIn: 'root',
})
class CommandesclientsService extends __BaseService {
  static readonly findAllPath = '/gestiondestock/v1/commandesclients/all';
  static readonly savePath = '/gestiondestock/v1/commandesclients/create';
  static readonly deleteArticlePath = '/gestiondestock/v1/commandesclients/delete/article/{idCommande}/{idLigneCommande}';
  static readonly deletePath = '/gestiondestock/v1/commandesclients/delete/{idCommandeClient}';
  static readonly findByCodePath = '/gestiondestock/v1/commandesclients/filter/{codeCommandeClient}';
  static readonly findAllLignesCommandesClientByCommandeClientIdPath = '/gestiondestock/v1/commandesclients/lignesCommande/{idCommande}';
  static readonly updateArticlePath = '/gestiondestock/v1/commandesclients/update/article/{idCommande}/{idLigneCommande}/{idArticle}';
  static readonly updateClientPath = '/gestiondestock/v1/commandesclients/update/client/{idCommande}/{idClient}';
  static readonly updateEtatCommandePath = '/gestiondestock/v1/commandesclients/update/etat/{idCommande}/{etatCommande}';
  static readonly updateQuantiteCommandePath = '/gestiondestock/v1/commandesclients/update/quantite/{idCommande}/{idLigneCommande}/{quantite}';
  static readonly findByIdPath = '/gestiondestock/v1/commandesclients/{idCommandeClient}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @return successful operation
   */
  findAllResponse(): __Observable<__StrictHttpResponse<CommandeDto[]>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;
    const req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commandes/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto[]>;
      })
    );
  }
  /**
   * @return successful operation
   */
  findAll(): __Observable<CommandeDto[]> {
    return this.findAllResponse().pipe(
      __map(_r => _r.body as CommandeDto[])
    );
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  saveResponse(body?: CommandeDto): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    const req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/commandes/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param body undefined
   * @return successful operation
   */
  save(body?: CommandeDto): __Observable<CommandeDto> {
    return this.saveResponse(body).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticleResponse(params: CommandesclientsService.DeleteArticleParams): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;


    const req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/commandes/delete/article/${params.idCommande}/${params.idLigneCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.DeleteArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  deleteArticle(params: CommandesclientsService.DeleteArticleParams): __Observable<CommandeDto> {
    return this.deleteArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }

  /**
   * @param idCommande undefined
   */
  deleteResponse(idCommande: number): __Observable<__StrictHttpResponse<null>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;

    const req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/commandes/delete/${idCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * @param idCommandeClient undefined
   */
  delete(idCommandeClient: number): __Observable<null> {
    return this.deleteResponse(idCommandeClient).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param codeCommande undefined
   * @return successful operation
   */
  findByCodeResponse(codeCommande: string): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;

    const req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commandes/filter/${codeCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param codeCommandeClient undefined
   * @return successful operation
   */
  findByCode(codeCommandeClient: string): __Observable<CommandeDto> {
    return this.findByCodeResponse(codeCommandeClient).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }

  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesClientByCommandeClientIdResponse(idCommande: number): __Observable<__StrictHttpResponse<LigneCommandeDto[]>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;

    const req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commandes/lignesCommande/${idCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<LigneCommandeDto[]>;
      })
    );
  }
  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findAllLignesCommandesClientByCommandeClientId(idCommande: number): __Observable<LigneCommandeDto[]> {
    return this.findAllLignesCommandesClientByCommandeClientIdResponse(idCommande).pipe(
      __map(_r => _r.body as LigneCommandeDto[])
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticleResponse(params: CommandesclientsService.UpdateArticleParams): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;



    const req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commandes/update/article/${params.idCommande}/${params.idLigneCommande}/${params.idArticle}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateArticleParams` containing the following parameters:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * - `idArticle`:
   *
   * @return successful operation
   */
  updateArticle(params: CommandesclientsService.UpdateArticleParams): __Observable<CommandeDto> {
    return this.updateArticleResponse(params).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }



  /**
   * @param params The `CommandesclientsService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommandeResponse(params: CommandesclientsService.UpdateEtatCommandeParams): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;


    const req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commandes/update/etat/${params.idCommande}/${params.etatCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateEtatCommandeParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return successful operation
   */
  updateEtatCommande(params: CommandesclientsService.UpdateEtatCommandeParams): __Observable<CommandeDto> {
    return this.updateEtatCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }

  /**
   * @param params The `CommandesclientsService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommandeResponse(params: CommandesclientsService.UpdateQuantiteCommandeParams): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;



    const req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commandes/update/quantite/${params.idCommande}/${params.idLigneCommande}/${params.quantite}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param params The `CommandesclientsService.UpdateQuantiteCommandeParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return successful operation
   */
  updateQuantiteCommande(params: CommandesclientsService.UpdateQuantiteCommandeParams): __Observable<CommandeDto> {
    return this.updateQuantiteCommandeResponse(params).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }

  /**
   * @param idCommande undefined
   * @return successful operation
   */
  findByIdResponse(idCommande: number): __Observable<__StrictHttpResponse<CommandeDto>> {
    const __params = this.newParams();
    const __headers = new HttpHeaders();
    const __body: any = null;

    const req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commandes/${idCommande}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeDto>;
      })
    );
  }
  /**
   * @param idCommandeClient undefined
   * @return successful operation
   */
  findById(idCommandeClient: number): __Observable<CommandeDto> {
    return this.findByIdResponse(idCommandeClient).pipe(
      __map(_r => _r.body as CommandeDto)
    );
  }
}

namespace CommandesclientsService {

  /**
   * Parameters for deleteArticle
   */
  export interface DeleteArticleParams {
    idLigneCommande: number;
    idCommande: number;
  }

  /**
   * Parameters for updateArticle
   */
  export interface UpdateArticleParams {
    idLigneCommande: number;
    idCommande: number;
    idArticle: number;
  }

  /**
   * Parameters for updateClient
   */
  export interface UpdateClientParams {
    idCommande: number;
    idClient: number;
  }

  /**
   * Parameters for updateEtatCommande
   */
  export interface UpdateEtatCommandeParams {
    idCommande: number;
    etatCommande: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  }

  /**
   * Parameters for updateQuantiteCommande
   */
  export interface UpdateQuantiteCommandeParams {
    quantite: number;
    idLigneCommande: number;
    idCommande: number;
  }
}

export { CommandesclientsService }