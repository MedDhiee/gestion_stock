/* tslint:disable */
import { ArticleDto } from './article-dto';
import { VentesDto } from './ventes-dto';
export interface LigneVenteDto {
  article?: ArticleDto;
  id?: number;
  prixUnitaire?: number;
  quantite?: number;
  vente?: VentesDto;
}
