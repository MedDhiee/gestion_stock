
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NouvelArticleComponent } from './nouvel-article.component';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ArticleService } from '../../services/article/article.service';
import { CategoryService } from '../../services/category/category.service';
import { PhotosService } from '../../../gs-api/src/services/photo-controller.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NouvelArticleComponent', () => {
  let component: NouvelArticleComponent;
  let fixture: ComponentFixture<NouvelArticleComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockArticleService: jasmine.SpyObj<ArticleService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;
  let mockPhotoService: jasmine.SpyObj<PhotosService>;

  beforeEach(async () => {
    
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        params: {}
      }
    };
    mockArticleService = jasmine.createSpyObj('ArticleService', ['findArticleById', 'enregistrerArticle']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['findAll']);
    mockPhotoService = jasmine.createSpyObj('PhotosService', ['savePhoto']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [NouvelArticleComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ArticleService, useValue: mockArticleService },
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: PhotosService, useValue: mockPhotoService },
      ],
      schemas: [NO_ERRORS_SCHEMA]  // ignore child components like file input
    }).compileComponents();

    fixture = TestBed.createComponent(NouvelArticleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const categories = [{ id: 1, designation: 'Cat A' }];
    mockCategoryService.findAll.and.returnValue(of(categories));

    component.ngOnInit();

    expect(mockCategoryService.findAll).toHaveBeenCalled();
    expect(component.listeCategorie).toEqual(categories);
  });

  it('should load article if idArticle is present', () => {
    const fakeArticle = {
      id: 1,
      codeArticle: 'ART-001',
      category: { id: 5, codeCategorie: 'CAT-001' }
    };
  
    mockActivatedRoute.snapshot = { params: { idArticle: 1 } } as any;
    mockArticleService.findArticleById.and.returnValue(of(fakeArticle));
    mockCategoryService.findAll.and.returnValue(of([]));
  
    component.ngOnInit();
  
    expect(mockArticleService.findArticleById).toHaveBeenCalledWith(1);
    expect(component.articleDto).toEqual(fakeArticle);
    expect(component.categorieDto).toEqual(fakeArticle.category);
  });

  it('should navigate to articles on cancel', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['articles']);
  });

  it('should handle enregistrerArticle success and save photo', fakeAsync(() => {
    const article = { id: 10, codeArticle: 'XYZ' };
    component.articleDto = { category: {} };
    component.categorieDto = {};
    component.file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    mockArticleService.enregistrerArticle.and.returnValue(of(article));
    mockPhotoService.savePhoto.and.returnValue(of({}));

    component.enregistrerArticle();
    tick();

    expect(mockArticleService.enregistrerArticle).toHaveBeenCalled();
    expect(mockPhotoService.savePhoto).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['articles']);
  }));

  it('should handle enregistrerArticle error', fakeAsync(() => {
    const errorResponse = { error: { errors: ['Error1', 'Error2'] } };
    component.articleDto = {};
    mockArticleService.enregistrerArticle.and.returnValue(throwError(() => errorResponse));

    component.enregistrerArticle();
    tick();

    expect(component.errorMsg).toEqual(['Error1', 'Error2']);
  }));
});
