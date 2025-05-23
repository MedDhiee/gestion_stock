import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../services/article/article.service';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {CategoryService} from '../../services/category/category.service';
import {PhotosService} from '../../../gs-api/src/services/photo-controller.service';
import SavePhotoParams = PhotosService.SavePhotoParams;

@Component({
  selector: 'app-nouvel-article',
  templateUrl: './nouvel-article.component.html',
  styleUrls: ['./nouvel-article.component.scss']
})
export class NouvelArticleComponent implements OnInit {

  articleDto: ArticleDto = {};
  categorieDto: CategoryDto = {};
  listeCategorie: CategoryDto[] = [];
  errorMsg: string[] = [];
  file: File | null = null;
  imgUrl: string | ArrayBuffer = 'assets/product.png';
  

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly articleService: ArticleService,
    private readonly categoryService: CategoryService,
    private readonly photoService: PhotosService
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll()
    .subscribe(categories => {
      this.listeCategorie = categories;
    });

    const idArticle = this.activatedRoute.snapshot.params['idArticle'];
    if (idArticle) {
      this.articleService.findArticleById(idArticle)
      .subscribe(article => {
        this.articleDto = article;
        this.categorieDto = this.articleDto.category ?? {};
      });
    }
  }

  cancel(): void {
    this.router.navigate(['articles']);
  }

  enregistrerArticle(): void {
    this.articleDto.category = this.categorieDto;
    this.articleService.enregistrerArticle(this.articleDto)
    .subscribe({
      next: (art) => {
        this.savePhoto(art.id, art.codeArticle);
      },
      error: (error) => {
        this.errorMsg = error.error.errors;
      }
    });
  }



  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
          }
        };
      }
    }
  }

  savePhoto(idArticle?: number, titre?: string): void {
    if (idArticle && titre && this.file) {
      const params: SavePhotoParams = {
        id: idArticle,
        file: this.file,
        title: titre,
        context: 'article'
      };
      this.photoService.savePhoto(params)
      .subscribe(res => {
        this.router.navigate(['articles']);
      });
    } else {
      this.router.navigate(['articles']);
    }
  }
}