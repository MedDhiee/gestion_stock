/* tslint:disable */
import { ArticleDto } from './article-dto';
export interface MvtStkDto {
  article?: ArticleDto;
  dateMvt?: string;
  id?: number;
  quantite?: number;
  sourceMvt?: 'COMMANDE_CLIENT' | 'VENTE';
  typeMvt?: 'ENTREE' | 'SORTIE' | 'CORRECTION_POS' | 'CORRECTION_NEG';
}
