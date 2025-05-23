import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article/article.service';
import { ArticleDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent implements OnInit {
  @Input()
  articleDto: ArticleDto = {};
  @Output()
  suppressionResult = new EventEmitter();
  gain :number | undefined;
  constructor(
    private readonly router: Router,
    private readonly articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.calculerTTC();
  }

  modifierArticle(): void {
    this.router.navigate(['nouvelarticle', this.articleDto.id]);
  }
  calculerTTC(): void {
    if (this.articleDto.in_stock && this.articleDto.prixVente) {
      this.gain = this.articleDto.prixVente * this.articleDto.in_stock ;
    }
  }
  confirmerEtSupprimerArticle(): void {
    if (this.articleDto.id) {
      this.articleService.deleteArticle(this.articleDto.id)
      .subscribe({
        next: res => {
          this.suppressionResult.emit('success');
        },
        error: error => {
          this.suppressionResult.emit(error.error.error);
        }
      });
  }
  }
}