import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-tresorerie',
  templateUrl: './tresorerie.component.html',
  styleUrls: ['./tresorerie.component.scss']
})
export class TresorerieComponent implements OnInit {

  @Input() operations: any[] =[]
  dtOptions = {}

  constructor() { 
    console.log(this.operations)
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
