import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { FilterService } from '@service/filter/filter.service';

@Component({
  selector: 'app-dash-prospection',
  templateUrl: './dash-prospection.component.html',
  styleUrls: ['./dash-prospection.component.scss']
})
export class DashProspectionComponent implements OnInit {
  dtOptions: any = {};
  type: string = 'TOUT';
  etat: boolean = false
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  typeRow = [
    {label: 'TOUT', value: 'TOUT'}
  ];
  performances = [
    {label: "Vignachou cristian", cont: 34, qual: 34, gan: 9, perdu: 0},
    {label: "Adediran Ramadan", cont: 0, qual: 4, gan: 2, perdu: 2},
    {label: "Bolojo Tum Zeinab", cont: 34, qual: 10, gan: 1, perdu: 0},
    {label: "Mubarak issouf cherif", cont: 4, qual: 11, gan: 1, perdu: 2},
    {label: "Aladji Maimouna", cont: 9, qual: 23, gan: 0, perdu: 1}
  ]
  leadattentes = [
    {label: "Kolawele mohamed", cont: 34, qual: 34, gan: 9, perdu: 15},
    {label: "Bamba wakasso", cont: 0, qual: 4, gan: 2, perdu: 15},
    {label: "Aninata Diomande", cont: 34, qual: 10, gan: 1, perdu: 15},
    {label: "Coulibaly moussa nambele", cont: 4, qual: 11, gan: 15, perdu: 15},
  ]
  event = {
    categorie: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    etat: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "TOUT",
    uuid: null
  }

  constructor(
    public router: Router,
    private filterService: FilterService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }
  onFilter($event) {
    this.type = $event.type
    this.filterService.dashboard($event, 'prospection', null).subscribe(
      res => {}, err => { })
  }

  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
    } else if($event === 'LOTISSEMENT'){
    } else if($event === 'ILOT'){
    }else if($event === 'LOT'){
    }
  }

}
