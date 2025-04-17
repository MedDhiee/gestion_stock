import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelCommandeComponent } from './nouvel-commande.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('NouvelCommandeComponent', () => {
  let component: NouvelCommandeComponent;
  let fixture: ComponentFixture<NouvelCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], 
      declarations: [ NouvelCommandeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
