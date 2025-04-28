import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NouvelleCategorieComponent } from './nouvelle-categorie.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category/category.service';
import { of, throwError } from 'rxjs';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';
import { FormsModule } from '@angular/forms';

describe('NouvelleCategorieComponent', () => {
  let component: NouvelleCategorieComponent;
  let fixture: ComponentFixture<NouvelleCategorieComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        params: {}
      }
    };
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['findById', 'enregistrerCategory']);

    await TestBed.configureTestingModule({
      declarations: [NouvelleCategorieComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch category by id on init if id is present', () => {
    const categoryMock: CategoryDto = { id: 1, code: 'cat1' };
    mockActivatedRoute.snapshot.params['idCategory'] = 1;
    mockCategoryService.findById.and.returnValue(of(categoryMock));

    component.ngOnInit();

    expect(mockCategoryService.findById).toHaveBeenCalledWith(1);
    expect(component.categoryDto).toEqual(categoryMock);
  });

  it('should navigate to "categorie" when cancel is called', () => {
    component.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['categorie']);
  });

  it('should navigate to "categorie" on successful save', () => {
    mockCategoryService.enregistrerCategory.and.returnValue(of({ id: 1 }));

    component.categoryDto = { code: 'test' };
    component.enregistrerCategory();

    expect(mockCategoryService.enregistrerCategory).toHaveBeenCalledWith({ code: 'test' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['categorie']);
  });

  it('should populate errorMsg on save error', () => {
    const errorResponse = {
      error: {
        errors: ['Code is required']
      }
    };

    mockCategoryService.enregistrerCategory.and.returnValue(throwError(() => errorResponse));

    component.enregistrerCategory();

    expect(component.errorMsg).toEqual(['Code is required']);
  });
});
