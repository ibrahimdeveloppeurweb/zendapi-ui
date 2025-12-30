import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-balance-list',
  templateUrl: './balance-list.component.html',
  styleUrls: ['./balance-list.component.scss']
})
export class BalanceListComponent implements OnInit {

  balances: any[] =[]
  dtOptions = {}

  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

}
