import { RolesDto } from './roles-dto';
export interface UtilisateurDto {
  email?: string;
  id?: number;
  motdepasse?: string;
  nom?: string;
  photo?: string;
  prenom?: string;
  roles?: RolesDto[];
}
