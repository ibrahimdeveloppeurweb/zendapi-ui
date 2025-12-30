import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@env/environment';
import { TenantService } from '@service/tenant/tenant.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-report-tenant',
  templateUrl: './report-tenant.component.html',
  styleUrls: ['./report-tenant.component.scss']
})
export class ReportTenantComponent implements OnInit {
  filter: any;
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;
  type: string = 'COMPTE';
  etat: boolean = false;
  categorie: boolean = false;
  typeRow = [
    {label: 'COMPTE', value: 'COMPTE'},
    {label: 'LOYER', value: 'LOYER'},
    {label: 'CONTRAT', value: 'CONTRAT'},
    {label: 'CONTRAT À TERME', value: 'CONTRAT-TERME'},
    {label: 'PAIEMENT', value: 'PAIEMENT'},
  ];
  etatRow = []
  categorieRow = [
    {label: 'FACTURE D\'ENTRÉE', value: 'ENTREE'},
    {label: 'LOYER', value: 'LOYER'},
    {label: 'PENALITE', value: 'PENALITE'}
  ];
  categorieTitle: string = "Type de locataire"
  autreTitle: string = "Promotion"
  nameTitle: string = "Nom / Raison sociale"
  etatTitle: string = "Disponibilité ?"
  bienTitle: string = "Nom du bien"
  autre: boolean = false
  bien: boolean = false;

  constructor(
    public router: Router,
    private tenantService: TenantService,
  ) { }

  ngOnInit(): void {
    this.onChangeLoad(this.type);
  }

  onFilter($event) {
    this.filter = $event
    if(this.type === 'COMPTE'){
      this.tenantService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'LOYER'){
      this.tenantService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'CONTRAT'){
      this.tenantService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'PAIEMENT'){
      this.tenantService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'CONTRAT-TERME'){
      this.tenantService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    }
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'COMPTE'){
      this.nameTitle = 'Nom / Raison sociale'
      this.bien = false;
      this.autre = false;
      this.categorie = true;
      this.categorieTitle = 'Excepter';
      this.categorieRow = [
        {label: 'FACTURE D\'ENTRÉE', value: 'ENTREE'},
        {label: 'LOYER', value: 'LOYER'},
        {label: 'PENALITE', value: 'PENALITE'}
      ];
      this.etatRow = [];
    } else if($event === 'LOYER'){
      this.bienTitle = 'Bien';
      this.autreTitle = 'Propriétaire'
      this.bien = true;
      this.autre = true;
      this.etat = true;
      this.nameTitle = 'Locataire'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'},
      ]
      this.categorie = true;
      this.categorieTitle = 'Type';
      this.categorieRow = [
        {label: 'LOYER', value: 'LOYER'},
        {label: 'AVANCE', value: 'AVANCE'},
      ];
    } else if($event === 'CONTRAT'){
      this.bienTitle = 'Nom du bien';
      this.bien = true;
      this.autre = false;
      this.etat = false;
      this.categorie = false;
      this.nameTitle = 'Locataire';
      this.etatTitle = 'Etat';
      this.categorieTitle = 'Type de contrat';
      this.categorieRow = [];
      this.etatRow = [];
    } else if($event === 'CONTRAT-TERME'){
      this.bienTitle = 'Nom du bien';
      this.bien = true;
      this.autre = false;
      this.etat = false;
      this.categorie = false;
      this.nameTitle = 'Locataire';
      this.etatTitle = 'Etat';
      this.categorieTitle = 'Type de contrat';
      this.categorieRow = [];
      this.etatRow = [];
    }  else if($event === 'PAIEMENT'){
      this.bienTitle = 'N° Contrat';
      this.nameTitle = 'Locataire'
      this.etat = false;
      this.categorie = false;
      this.bien = true;
      this.autre = false;
      this.etatTitle = 'Etat';
      this.categorieTitle = 'Type facture';
      this.categorieRow = [];
      this.etatRow = [];
    }
  }
  onPrinter() {
    if(this.type === 'COMPTE'){
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'LOYER') {
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CONTRAT') {
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CONTRAT-TERME') {
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }

}
