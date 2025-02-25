import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatistiquesComponent } from './pages/statistiques/statistiques.component';
import { MenuComponent } from './composants/menu/menu.component';
import { HeaderComponent } from './composants/header/header.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { DetailArticleComponent } from './composants/detail-article/detail-article.component';
import { NouvelArticleComponent } from './pages/nouvel-article/nouvel-article.component';
import { CommandeComponent } from './pages/commande/commande.component';
import { FactureComponent } from './pages/facture/facture.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { NouvelleCategorieComponent } from './pages/nouvelle-categorie/nouvelle-categorie.component';
import { BouttonActionComponent } from './composants/boutton-action/boutton-action.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './composants/loader/loader.component';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';
import { PaginationComponent } from './composants/pagination/pagination.component';
import { NouvelCommandeComponent } from './composants/nouvel-commande/nouvel-commande.component';
import { DetailCommandeComponent } from './composants/detail-commande/detail-commande.component';
import { DetailCmdCltFrsComponent } from './composants/detail-cmd-clt-frs/detail-cmd-clt-frs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    StatistiquesComponent,
    MenuComponent,
    HeaderComponent,
    ArticlesComponent,
    DetailArticleComponent,
    NouvelArticleComponent,
    CommandeComponent,
    FactureComponent,
    CategorieComponent,
    NouvelleCategorieComponent,
    BouttonActionComponent,
    LoaderComponent,
    PaginationComponent,
    NouvelCommandeComponent,
    DetailCommandeComponent,
    DetailCmdCltFrsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
