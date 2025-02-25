/* tslint:disable */
import { CategoryDto } from './category-dto';
export interface ArticleDto {
  budget_total?: number;
  category?: CategoryDto;
  codeArticle?: string;
  id?: number;
  in_stock?: number;
  photo?: string;
  prixAchat?: number;
  prixVente?: number;
  designation?: string;
}
