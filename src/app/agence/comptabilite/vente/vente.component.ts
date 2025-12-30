import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss']
})
export class VenteComponent implements OnInit {

  ventes: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
