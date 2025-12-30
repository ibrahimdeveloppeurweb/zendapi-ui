import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss']
})
export class ProduitComponent implements OnInit {

  produits: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }


}
