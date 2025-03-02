/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationInterface } from './api-configuration';

import { ArticleControllerService } from './services/article-controller.service';
import { AuthenticationControllerService } from './services/authentication-controller.service';
import { CategoryControllerService } from './services/category-controller.service';
import { CommandeControllerService } from './services/commande-controller.service';
import { MvtStkControllerService } from './services/mvt-stk-controller.service';
import { PhotoControllerService } from './services/photo-controller.service';
import { UtilisateurControllerService } from './services/utilisateur-controller.service';

/**
 * Provider for all Api services, plus ApiConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiConfiguration,
    ArticleControllerService,
    AuthenticationControllerService,
    CategoryControllerService,
    CommandeControllerService,
    MvtStkControllerService,
    PhotoControllerService,
    UtilisateurControllerService
  ],
})
export class ApiModule {
  static forRoot(customParams: ApiConfigurationInterface): ModuleWithProviders {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
