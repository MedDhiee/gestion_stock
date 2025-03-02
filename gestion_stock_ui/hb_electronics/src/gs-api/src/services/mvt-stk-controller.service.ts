/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { MvtStkDto } from '../models/mvt-stk-dto';

/**
 * Mvt Stk Controller
 */
@Injectable({
  providedIn: 'root',
})
class MvtStkControllerService extends __BaseService {
  static readonly correctionStockNegUsingPOSTPath = '/gestiondestock/v1/mvtstk/correctionneg';
  static readonly correctionStockPosUsingPOSTPath = '/gestiondestock/v1/mvtstk/correctionpos';
  static readonly entreeStockUsingPOSTPath = '/gestiondestock/v1/mvtstk/entree';
  static readonly mvtStkArticleUsingGETPath = '/gestiondestock/v1/mvtstk/filter/article/{idArticle}';
  static readonly sortieStockUsingPOSTPath = '/gestiondestock/v1/mvtstk/sortie';
  static readonly stockReelArticleUsingGETPath = '/gestiondestock/v1/mvtstk/stockreel/{idArticle}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param dto dto
   * @return OK
   */
  correctionStockNegUsingPOSTResponse(dto: MvtStkDto): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = dto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/correctionneg`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @param dto dto
   * @return OK
   */
  correctionStockNegUsingPOST(dto: MvtStkDto): __Observable<MvtStkDto> {
    return this.correctionStockNegUsingPOSTResponse(dto).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @param dto dto
   * @return OK
   */
  correctionStockPosUsingPOSTResponse(dto: MvtStkDto): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = dto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/correctionpos`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @param dto dto
   * @return OK
   */
  correctionStockPosUsingPOST(dto: MvtStkDto): __Observable<MvtStkDto> {
    return this.correctionStockPosUsingPOSTResponse(dto).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @param dto dto
   * @return OK
   */
  entreeStockUsingPOSTResponse(dto: MvtStkDto): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = dto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/entree`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @param dto dto
   * @return OK
   */
  entreeStockUsingPOST(dto: MvtStkDto): __Observable<MvtStkDto> {
    return this.entreeStockUsingPOSTResponse(dto).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @param idArticle idArticle
   * @return OK
   */
  mvtStkArticleUsingGETResponse(idArticle: number): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/filter/article/${idArticle}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MvtStkDto>>;
      })
    );
  }
  /**
   * @param idArticle idArticle
   * @return OK
   */
  mvtStkArticleUsingGET(idArticle: number): __Observable<Array<MvtStkDto>> {
    return this.mvtStkArticleUsingGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * @param dto dto
   * @return OK
   */
  sortieStockUsingPOSTResponse(dto: MvtStkDto): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = dto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/sortie`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @param dto dto
   * @return OK
   */
  sortieStockUsingPOST(dto: MvtStkDto): __Observable<MvtStkDto> {
    return this.sortieStockUsingPOSTResponse(dto).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @param idArticle idArticle
   * @return OK
   */
  stockReelArticleUsingGETResponse(idArticle: number): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/stockreel/${idArticle}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param idArticle idArticle
   * @return OK
   */
  stockReelArticleUsingGET(idArticle: number): __Observable<number> {
    return this.stockReelArticleUsingGETResponse(idArticle).pipe(
      __map(_r => _r.body as number)
    );
  }
}

module MvtStkControllerService {
}

export { MvtStkControllerService }
