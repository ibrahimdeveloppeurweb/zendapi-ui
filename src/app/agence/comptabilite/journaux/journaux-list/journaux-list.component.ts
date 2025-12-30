import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-journaux-list',
  templateUrl: './journaux-list.component.html',
  styleUrls: ['./journaux-list.component.scss']
})
export class JournauxListComponent implements OnInit {

  filter: any;
  action: boolean = true;
  total = 0;
  dtOptions: any = {};
  etat: boolean = false;
  visible: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  type: string = 'JOURNAUX';
  syndics: any[] = [];
  mandate: any[];
  copropriete: any[];
  etatRow = [
    { label: 'PREVU', value: 'PREVU' },
    { label: 'EN COURS', value: 'EN COURS' },
    { label: 'STOPPER', value: 'STOPPER' },
    { label: 'ACHEVE', value: 'ACHEVE' }
  ];
  typeRow = [
    { label: 'JOURNAUX', value: 'JOURNAUX' },
    { label: 'GRAND LIVRE', value: 'LIVRE' },
    { label: 'BALANCE DES COMPTES', value: 'BALANCE' }
  ];
  nameTitle: string = "Libellé"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  cookie: string = ''
  categorieRow = [];
  journaux: any[] =[]


  constructor() { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  onFilter($event){
  }

  onChangeLoad($event){
    this.type = $event
  }
}
