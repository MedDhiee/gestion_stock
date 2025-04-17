import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { NouvelArticleComponent } from './pages/nouvel-article/nouvel-article.component';
import { CommandeComponent } from './pages/commande/commande.component';
import { FactureComponent } from './pages/facture/facture.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { NouvelleCategorieComponent } from './pages/nouvelle-categorie/nouvelle-categorie.component';
import { ApplicationGuardService } from './services/guard/application-guard.service';
import { NouvelCommandeComponent } from './composants/nouvel-commande/nouvel-commande.component';

const routes: Routes = [
  
    {
      path: '',
      component: LoginComponent
    },
  {
    path:'',
    component:DashboardComponent,
    canActivate: [ApplicationGuardService],
    children:[
      {
        path:'statistiques',
        component:StatistiquesComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path:'articles',
        component:ArticlesComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path:'nouvelarticle',
        component:NouvelArticleComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvelarticle/:idArticle',
        component: NouvelArticleComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path:'commande',
        component:CommandeComponent,
        canActivate: [ApplicationGuardService]
      }
      ,
      {
        path:'facture',
        component:FactureComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path:'categorie',
        component:CategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path:'nouvelleCategorie',
        component:NouvelleCategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvelleCategorie/:idCategory',
        component: NouvelleCategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'commandesclient',
        component: CommandeComponent,
        canActivate: [ApplicationGuardService]
        
      },
      {
        path: 'nouvellecommandeclt',
        component: NouvelCommandeComponent,
      canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvellecommandeclt/:idCommande',
        component: NouvelCommandeComponent,
      canActivate: [ApplicationGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
