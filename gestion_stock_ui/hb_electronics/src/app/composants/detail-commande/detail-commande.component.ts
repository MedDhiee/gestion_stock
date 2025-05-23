import { Component, Input, OnInit } from '@angular/core';
import { LigneCommandeDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
  styleUrls: ['./detail-commande.component.scss']
})
export class DetailCommandeComponent implements OnInit {

  @Input()
  ligneCommande: LigneCommandeDto = {};

  constructor() { }

  ngOnInit(): void {
  }
}
