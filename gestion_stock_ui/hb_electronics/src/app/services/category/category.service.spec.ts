import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { CategoriesService } from '../../../gs-api/src/services/category-controller.service';
import { of } from 'rxjs';
import { CategoryDto } from '../../../gs-api/src/models/category-dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CategoriesService', ['save', 'findAll', 'findById', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        CategoryService,
        { provide: CategoriesService, useValue: spy }
      ]
    });

    service = TestBed.inject(CategoryService);
    mockCategoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call save on enregistrerCategory', () => {
    const mockCategory: CategoryDto = { id: 1, code: 'CAT1'};
    mockCategoriesService.save.and.returnValue(of(mockCategory));

    service.enregistrerCategory(mockCategory).subscribe(result => {
      expect(result).toEqual(mockCategory);
    });

    expect(mockCategoriesService.save).toHaveBeenCalledWith(mockCategory);
  });

  it('should call findAll on findAll', () => {
    const mockCategories: CategoryDto[] = [
      { id: 1, code: 'CAT1' }
    ];
    mockCategoriesService.findAll.and.returnValue(of(mockCategories));

    service.findAll().subscribe(result => {
      expect(result).toEqual(mockCategories);
    });

    expect(mockCategoriesService.findAll).toHaveBeenCalled();
  });

  it('should call findById on findById', () => {
    const id = 1;
    const mockCategory: CategoryDto = { id, code: 'CAT1' };
    mockCategoriesService.findById.and.returnValue(of(mockCategory));

    service.findById(id).subscribe(result => {
      expect(result).toEqual(mockCategory);
    });

    expect(mockCategoriesService.findById).toHaveBeenCalledWith(id);
  });

  it('should call delete on delete if idCategorie is provided', (done) => {
    mockCategoriesService.delete.and.returnValue(of(null));
  
    service.delete(1).subscribe(response => {
      expect(mockCategoriesService.delete).toHaveBeenCalledWith(1);
      expect(response).toBeNull();
      done();
    });
  });
  

  it('should return empty observable if idCategorie is not provided', () => {
    service.delete().subscribe(result => {
      expect(result).toBeUndefined();
    });

    expect(mockCategoriesService.delete).not.toHaveBeenCalled();
  });
});
