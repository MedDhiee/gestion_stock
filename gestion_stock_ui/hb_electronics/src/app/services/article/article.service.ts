import { Injectable } from '@angular/core';
import {ArticlesService} from '../../../gs-api/src/services/article-controller.service';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private readonly backendUrl = 'http://localhost:8081';
  constructor(
    private readonly http:HttpClient,
    private readonly articleService: ArticlesService
  ) { }


  enregistrerArticle(articleDto: ArticleDto): Observable<ArticleDto> {
    return this.articleService.save(articleDto);
  }

  findAllArticles(): Observable<ArticleDto[]> {
    return this.articleService.findAll();
  }

  findArticleById(idArticle?: number): Observable<ArticleDto> {
    if (idArticle) {
      return this.articleService.findById(idArticle);
    }
    return of();
  }

  deleteArticle(idArticle: number): Observable<any> {
    if (idArticle) {
      return this.articleService.delete(idArticle);
    }
    return of();
  }

  findArticleByCode(codeArticle: string): Observable<ArticleDto> {
    return this.articleService.findByCodeArticle(codeArticle);
  }
  updateArticle(id: number, newStock: number): Observable<ArticleDto> {
    return this.http.put<ArticleDto>(`${this.backendUrl}/${id}/updateQuantities`, newStock);
  }
}