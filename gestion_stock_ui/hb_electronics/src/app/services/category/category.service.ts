import { Injectable } from '@angular/core';
import {CategoriesService} from '../../../gs-api/src/services/category-controller.service';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private readonly categoryService: CategoriesService
  ) { }

  enregistrerCategory(categoryDto: CategoryDto): Observable<CategoryDto> {
    return this.categoryService.save(categoryDto);
  }

  findAll(): Observable<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  findById(idCategory: number): Observable<CategoryDto> {
    return this.categoryService.findById(idCategory);
  }

  delete(idCategorie?: number): Observable<any> {
    if (idCategorie) {
      return this.categoryService.delete(idCategorie);
    }
    return of();
  }
}