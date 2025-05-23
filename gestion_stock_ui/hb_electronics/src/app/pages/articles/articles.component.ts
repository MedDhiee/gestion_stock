import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../services/article/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  listArticle: ArticleDto[] = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.findListArticle();
  }

  findListArticle(): void {
    this.articleService.findAllArticles()
    .subscribe(articles => {
      this.listArticle = articles;
    });
  }

  nouvelArticle(): void {
    this.router.navigate(['nouvelarticle']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findListArticle();
    } else {
      this.errorMsg = event;
    }
  }
}