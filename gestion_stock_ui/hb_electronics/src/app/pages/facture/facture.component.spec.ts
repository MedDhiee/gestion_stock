import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureComponent } from './facture.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from 'src/app/composants/menu/menu.component';

describe('FactureComponent', () => {
  let component: FactureComponent;
  let fixture: ComponentFixture<FactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], 
      declarations: [ FactureComponent, MenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
