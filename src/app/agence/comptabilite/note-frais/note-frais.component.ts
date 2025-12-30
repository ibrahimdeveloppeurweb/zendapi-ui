import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-note-frais',
  templateUrl: './note-frais.component.html',
  styleUrls: ['./note-frais.component.scss']
})
export class NoteFraisComponent implements OnInit {

  noteFrais: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
