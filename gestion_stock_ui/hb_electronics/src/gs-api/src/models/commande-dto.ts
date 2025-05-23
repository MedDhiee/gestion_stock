import { LigneCommandeDto } from './ligne-commande-dto';
export interface CommandeDto {
  commandeLivree?: boolean;
  dateCommande?: string;
  etatCommande?: 'EN_PREPARATION' | 'VALIDEE' | 'LIVREE';
  id?: number;
  ligneCommande?: LigneCommandeDto[];
}
