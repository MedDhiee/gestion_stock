import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelCommandeComponent } from './nouvel-commande.component';

describe('NouvelCommandeComponent', () => {
  let component: NouvelCommandeComponent;
  let fixture: ComponentFixture<NouvelCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
