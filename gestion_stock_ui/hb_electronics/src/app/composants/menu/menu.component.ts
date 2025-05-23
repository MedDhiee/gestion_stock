import { Component } from '@angular/core';
import { Menu } from './menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public menuProperties: Menu[] = [
    {
      id:'1',
      titre:'Tableau de bord',
      icon:'fa-solid fa-chart-column',
      url:'statistiques'
      
    },
    {
      id:'2',
      titre:'Categories',
      icon:'fa-solid fa-layer-group',
      url:'categorie'
    },
    {
      id:'3',
      titre:'Articles',
      icon:'fa-solid fa-box-open',
      url:'articles',
      
      
    },
    
    {
      id:'4',
      titre:'Commandes',
      icon:'fa fa-shopping-cart',
      url:'commande',
    },
    {
      id:'5',
      titre:'Revenus',
      icon:'fa-solid fa-file-invoice-dollar',
      url:'facture'
    
    }
  ];
private lastSelectedMenu:Menu|undefined;
  constructor(
    private readonly router:Router,
  ){}
  navigate(menu:Menu){
    if(this.lastSelectedMenu){
      this.lastSelectedMenu.active= false;
    }
    menu.active=true;
    this.lastSelectedMenu=menu;
    this.router.navigate([menu.url]);

  }
  
}
