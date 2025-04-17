import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticleComponent } from './detail-article.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetailArticleComponent', () => {
  let component: DetailArticleComponent;
  let fixture: ComponentFixture<DetailArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DetailArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
