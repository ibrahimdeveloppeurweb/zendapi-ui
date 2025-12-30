import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-grand-livre-list',
  templateUrl: './grand-livre-list.component.html',
  styleUrls: ['./grand-livre-list.component.scss']
})
export class GrandLivreListComponent implements OnInit {

  grandLivres: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
