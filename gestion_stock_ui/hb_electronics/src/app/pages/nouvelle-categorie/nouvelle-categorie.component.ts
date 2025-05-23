import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {CategoryService} from '../../services/category/category.service';

@Component({
  selector: 'app-noouvelle-category',
  templateUrl: './nouvelle-categorie.component.html',
  styleUrls: ['./nouvelle-categorie.component.scss']
})
export class NouvelleCategorieComponent implements OnInit {

  categoryDto: CategoryDto = {};
  errorMsg: string[] = [];
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    const idCategory = this.activatedRoute.snapshot.params['idCategory'];
    if (idCategory) {
      this.categoryService.findById(idCategory)
      .subscribe(cat => {
        this.categoryDto = cat;
      });
    }
  }

  cancel(): void {
    this.router.navigate(['categorie']);
  }

  enregistrerCategory(): void {
    this.categoryService.enregistrerCategory(this.categoryDto)
    .subscribe({
      next: res => {
        this.router.navigate(['categorie']);
      },
      error: error => {
        this.errorMsg = error.error.errors;
      }
    });
  }
}