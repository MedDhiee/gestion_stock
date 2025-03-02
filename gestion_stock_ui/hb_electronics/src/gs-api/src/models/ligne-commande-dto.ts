/* tslint:disable */
import { ArticleDto } from './article-dto';
export interface LigneCommandeDto {
  article?: ArticleDto;
  id?: number;
  prixVente?: number;
  quantite?: number;
}
