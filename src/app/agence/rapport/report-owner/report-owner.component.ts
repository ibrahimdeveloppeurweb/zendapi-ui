import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import {OwnerService} from '@service/owner/owner.service';

@Component({
  selector: 'app-report-owner',
  templateUrl: './report-owner.component.html',
  styleUrls: ['./report-owner.component.scss']
})
export class ReportOwnerComponent implements OnInit {
  filter: any;
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  type: string = 'COMPTE'
  etatRow = [];
  typeRow = [
    { label: 'COMPTE', value: 'COMPTE' },
    { label: 'RECOUVREMENT', value: 'RECOUVREMENT' },
    { label: 'PAIEMENT', value: 'PAIEMENT' },
    { label: 'REVERSEMENT', value: 'REVERSEMENT' },
    { label: 'SITUATION DES BIENS', value: 'SITUATION_BIEN' },
    { label: 'COMMISSION ', value: 'COMMISSION' }
  ]
  categorieRow = [];
  nameTitle: string = "Nom / Raison sociale"
  bienTitle: string = "Propriétaire"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de propriétaire"
  etatTitle: string = "Disponibilité ?"
  autreTitle: string = "Promotion"
  bien: boolean = false;
  etat: boolean = false
  categorie: boolean = false
  autreEtat: boolean = false

  constructor(
    public router: Router,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {
  }

  onFilter($event) {
    this.filter = $event
    this.ownerService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'COMPTE'){
      this.nameTitle = 'Nom / Raison sociale'
      this.autreEtat = false
      this.categorie = false
      this.etat = false
      this.categorieRow = [];
    } else if($event === 'PAIEMENT'){
      this.categorie = false
      this.etat = true
      this.bien = true;
      this.etatTitle = "Etat"
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de bien'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'EN ATTENTE DE VALIDATION', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
    } else if($event === 'RECOUVREMENT'){
      this.categorie = false
      this.etat = false
      this.bien = true;
      this.etatTitle = "Etat"
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de bien'
      this.etatRow = [];
      this.categorieRow = [];
    } else if($event === 'REVERSEMENT'){
      this.bien = false;
      this.etat = true
      this.categorie = true
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'INVALIDE', value: 'INVALIDE'},
        {label: 'VALIDE', value: 'VALIDE'}
      ];
      this.categorieRow = [
        {label: 'VENTE', value: 'VENTE'},
        {label: 'LOCATION', value: 'LOCATION'}
      ];
    } else if($event === 'COMMISSION'){
      this.etat = false
      this.categorie = true
      this.bien = true;
      this.bienTitle = "Bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'INVALIDE', value: 'INVALIDE'},
        {label: 'VALIDE', value: 'VALIDE'}
      ];
      this.categorieRow = [
        {label: 'VENTE', value: 'VENTE'},
        {label: 'LOCATION', value: 'LOCATION'}
      ];
    } else if($event === 'SITUATION_BIEN'){
      this.etat = false
      this.categorie = false
      this.bien =false;
      this.bienTitle = "Bien"
      this.nameTitle = "Propriétaire"
      this.etatRow = [];
      this.categorieRow = [];
    }
  }

}
