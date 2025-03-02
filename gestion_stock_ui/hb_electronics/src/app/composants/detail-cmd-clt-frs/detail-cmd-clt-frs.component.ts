import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-cmd-clt-frs',
  templateUrl: './detail-cmd-clt-frs.component.html',
  styleUrls: ['./detail-cmd-clt-frs.component.scss']
})
export class DetailCmdCltFrsComponent implements OnInit {
  ngOnInit(): void {
  }

  @Input()
  commande: any = {};

  
  modifierClick(): void {
  }
}
