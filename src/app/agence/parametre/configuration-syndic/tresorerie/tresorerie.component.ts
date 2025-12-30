import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-tresorerie',
  templateUrl: './tresorerie.component.html',
  styleUrls: ['./tresorerie.component.scss']
})
export class TresorerieComponent implements OnInit {

  tresoreire: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
