import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailArticleComponent } from './detail-article.component';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article/article.service';
import { of, throwError } from 'rxjs';

describe('DetailArticleComponent', () => {
  let component: DetailArticleComponent;
  let fixture: ComponentFixture<DetailArticleComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let articleServiceSpy: jasmine.SpyObj<ArticleService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    articleServiceSpy = jasmine.createSpyObj('ArticleService', ['deleteArticle']);

    await TestBed.configureTestingModule({
      declarations: [DetailArticleComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ArticleService, useValue: articleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate gain correctly in calculerTTC', () => {
    component.articleDto = { in_stock: 10, prixVente: 20 };
    component.calculerTTC();
    expect(component.gain).toBe(200);
  });

  it('should navigate to edit page when modifierArticle is called', () => {
    component.articleDto = { id: 42 };
    component.modifierArticle();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['nouvelarticle', 42]);
  });

  it('should emit "success" when article deletion succeeds', () => {
    component.articleDto = { id: 1 };
    articleServiceSpy.deleteArticle.and.returnValue(of({}));

    spyOn(component.suppressionResult, 'emit');

    component.confirmerEtSupprimerArticle();

    expect(articleServiceSpy.deleteArticle).toHaveBeenCalledWith(1);
    expect(component.suppressionResult.emit).toHaveBeenCalledWith('success');
  });

  it('should emit error message when article deletion fails', () => {
    component.articleDto = { id: 1 };
    articleServiceSpy.deleteArticle.and.returnValue(throwError(() => ({
      error: { error: 'Suppression échouée' }
    })));

    spyOn(component.suppressionResult, 'emit');

    component.confirmerEtSupprimerArticle();

    expect(articleServiceSpy.deleteArticle).toHaveBeenCalledWith(1);
    expect(component.suppressionResult.emit).toHaveBeenCalledWith('Suppression échouée');
  });
});
