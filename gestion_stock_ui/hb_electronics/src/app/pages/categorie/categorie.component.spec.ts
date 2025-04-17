import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieComponent } from './categorie.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BouttonActionComponent } from 'src/app/composants/boutton-action/boutton-action.component';

describe('CategorieComponent', () => {
  let component: CategorieComponent;
  let fixture: ComponentFixture<CategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [ CategorieComponent,
        BouttonActionComponent  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
