import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleCategorieComponent } from './nouvelle-categorie.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('NouvelleCategorieComponent', () => {
  let component: NouvelleCategorieComponent;
  let fixture: ComponentFixture<NouvelleCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                idCategory: 1  // ou undefined si tu veux tester sans chargement d'article
              }
            }
          }
        }
      ],
      declarations: [ NouvelleCategorieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
