import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesComponent } from './statistiques.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatistiquesComponent', () => {
  let component: StatistiquesComponent;
  let fixture: ComponentFixture<StatistiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ StatistiquesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
