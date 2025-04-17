import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeComponent } from './commande.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BouttonActionComponent } from 'src/app/composants/boutton-action/boutton-action.component';
import { FormsModule } from '@angular/forms';

describe('CommandeComponent', () => {
  let component: CommandeComponent;
  let fixture: ComponentFixture<CommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,FormsModule], 
      declarations: [ CommandeComponent,BouttonActionComponent  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
