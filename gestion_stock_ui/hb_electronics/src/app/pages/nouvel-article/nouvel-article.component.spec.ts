import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelArticleComponent } from './nouvel-article.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('NouvelArticleComponent', () => {
  let component: NouvelArticleComponent;
  let fixture: ComponentFixture<NouvelArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ NouvelArticleComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                idArticle: 1  // ou undefined si tu veux tester sans chargement d'article
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
