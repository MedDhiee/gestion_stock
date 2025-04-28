import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {CategoryService} from '../../services/category/category.service';

@Component({
  selector: 'app-page-categories',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {

  listCategories: Array<CategoryDto> = [];
  selectedCatIdToDelete ? = -1;
  errorMsgs = '';

  constructor(
    private readonly router: Router,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.findAllCategories();
  }

  findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories = res;
    });
  }

  nouvelleCategory(): void {
    this.router.navigate(['nouvelleCategorie']);
  }

  modifierCategory(id?: number): void {
    this.router.navigate(['nouvelleCategorie', id]);
  }

  confirmerEtSupprimerCat(): void {
    if (this.selectedCatIdToDelete !== -1) {
      this.categoryService.delete(this.selectedCatIdToDelete)
      .subscribe({
        next: res => {
          this.findAllCategories();
        },
        error: error => {
          this.errorMsgs = error.error.message;
        }
      });
    }
  }

  annulerSuppressionCat(): void {
    this.selectedCatIdToDelete = -1;
  }

  selectCatPourSupprimer(id?: number): void {
    this.selectedCatIdToDelete = id;
    
  }
}