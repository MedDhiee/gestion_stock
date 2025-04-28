import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Menu } from './menu';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardComponent, MenuComponent],
      providers: [
        { provide: Router, useValue: routerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore les erreurs HTML inconnues
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate and set active menu correctly', () => {
    const menu: Menu = {
      id: '1',
      titre: 'Tableau de bord',
      icon: 'icon-test',
      url: 'statistiques',
      active: false
    };

    component.navigate(menu);

    expect(menu.active).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['statistiques']);
    expect(component['lastSelectedMenu']).toEqual(menu);
  });

  it('should deactivate previous menu when navigating to a new one', () => {
    const firstMenu: Menu = {
      id: '1',
      titre: 'Dashboard',
      icon: 'icon-1',
      url: 'statistiques',
      active: false
    };

    const secondMenu: Menu = {
      id: '2',
      titre: 'Categories',
      icon: 'icon-2',
      url: 'categorie',
      active: false
    };

    // Navigate to first
    component.navigate(firstMenu);
    expect(firstMenu.active).toBeTrue();

    // Navigate to second
    component.navigate(secondMenu);
    expect(firstMenu.active).toBeFalse();
    expect(secondMenu.active).toBeTrue();
  });
});
