import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategorieComponent } from './categorie.component';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { of, throwError } from 'rxjs';
import { BouttonActionComponent } from 'src/app/composants/boutton-action/boutton-action.component';
import { PaginationComponent } from 'src/app/composants/pagination/pagination.component';


describe('CategorieComponent', () => {
  let component: CategorieComponent;
  let fixture: ComponentFixture<CategorieComponent>;
  let mockCategoryService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockCategoryService = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of([{ id: 1, code: 'cat1' }])),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [CategorieComponent, BouttonActionComponent,
        PaginationComponent],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories on init', () => {
    expect(mockCategoryService.findAll).toHaveBeenCalled();
    expect(component.listCategories.length).toBeGreaterThan(0);
  });

  it('should navigate to nouvelleCategorie on nouvelleCategory()', () => {
    component.nouvelleCategory();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['nouvelleCategorie']);
  });

  it('should navigate to edit category with id', () => {
    component.modifierCategory(2);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['nouvelleCategorie', 2]);
  });

  it('should call delete and refresh categories', () => {
    component.selectedCatIdToDelete = 1;
    component.confirmerEtSupprimerCat();
    expect(mockCategoryService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle delete error and set error message', () => {
    mockCategoryService.delete.and.returnValue(throwError(() => ({ error: { message: 'Erreur suppression' } })));
    component.selectedCatIdToDelete = 1;
    component.confirmerEtSupprimerCat();
    expect(component.errorMsgs).toBe('Erreur suppression');
  });

  it('should cancel deletion', () => {
    component.annulerSuppressionCat();
    expect(component.selectedCatIdToDelete).toBe(-1);
  });

  it('should select category for deletion', () => {
    component.selectCatPourSupprimer(3);
    expect(component.selectedCatIdToDelete).toBe(3);
  });
});
