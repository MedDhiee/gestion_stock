import { TestBed } from '@angular/core/testing';
import { ArticleService } from './article.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticlesService } from '../../../gs-api/src/services/article-controller.service';
import { of } from 'rxjs';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockArticleControllerService: jasmine.SpyObj<ArticlesService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ArticlesService', [
      'save', 'findAll', 'findById', 'delete', 'findByCodeArticle'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ArticleService,
        { provide: ArticlesService, useValue: spy }
      ]
    });

    service = TestBed.inject(ArticleService);
    mockArticleControllerService = TestBed.inject(ArticlesService) as jasmine.SpyObj<ArticlesService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call save when enregistrerArticle is called', () => {
    const mockArticle: ArticleDto = { id: 1, codeArticle: 'ART-001' } as ArticleDto;
    mockArticleControllerService.save.and.returnValue(of(mockArticle));

    service.enregistrerArticle(mockArticle).subscribe(res => {
      expect(res).toEqual(mockArticle);
    });

    expect(mockArticleControllerService.save).toHaveBeenCalledWith(mockArticle);
  });

  it('should return all articles', () => {
    const mockArticles: ArticleDto[] = [{ id: 1 } as ArticleDto];
    mockArticleControllerService.findAll.and.returnValue(of(mockArticles));

    service.findAllArticles().subscribe(res => {
      expect(res).toEqual(mockArticles);
    });

    expect(mockArticleControllerService.findAll).toHaveBeenCalled();
  });

  it('should return article by id', () => {
    const mockArticle = { id: 1 } as ArticleDto;
    mockArticleControllerService.findById.and.returnValue(of(mockArticle));

    service.findArticleById(1).subscribe(res => {
      expect(res).toEqual(mockArticle);
    });

    expect(mockArticleControllerService.findById).toHaveBeenCalledWith(1);
  });

  it('should return empty observable if id is not provided in findArticleById', () => {
    service.findArticleById().subscribe(res => {
      expect(res).toBeUndefined();
    });
  });

  it('should call delete when deleteArticle is called', () => {
    mockArticleControllerService.delete.and.returnValue(of(null));

    service.deleteArticle(5).subscribe(res => {
      expect(res).toBeNull();
    });

    expect(mockArticleControllerService.delete).toHaveBeenCalledWith(5);
  });

  it('should return empty observable if id is not provided in deleteArticle', () => {
    service.deleteArticle(undefined as unknown as number).subscribe(res => {
      expect(res).toBeUndefined();
    });
  });

  it('should find article by code', () => {
    const mockArticle = { id: 1 } as ArticleDto;
    mockArticleControllerService.findByCodeArticle.and.returnValue(of(mockArticle));

    service.findArticleByCode('ART-001').subscribe(res => {
      expect(res).toEqual(mockArticle);
    });

    expect(mockArticleControllerService.findByCodeArticle).toHaveBeenCalledWith('ART-001');
  });

  it('should call http.put when updateArticle is called', () => {
    const mockArticle = { id: 1 } as ArticleDto;

    service.updateArticle(1, 5).subscribe(res => {
      expect(res).toEqual(mockArticle);
    });

    const req = httpMock.expectOne('http://localhost:8081/1/updateQuantities');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(5);

    req.flush(mockArticle);
  });
});
