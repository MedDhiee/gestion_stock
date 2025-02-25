import { Component, Input } from '@angular/core';
import { LigneCommandeDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
  styleUrls: ['./detail-commande.component.scss']
})
export class DetailCommandeComponent {

  @Input()
  ligneCommande: LigneCommandeDto = {};

  constructor() { }

  ngOnInit(): void {
  }
}
