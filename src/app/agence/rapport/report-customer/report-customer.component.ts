import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { FolderService } from '@service/folder/folder.service';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';

@Component({
  selector: 'app-report-customer',
  templateUrl: './report-customer.component.html',
  styleUrls: ['./report-customer.component.scss']
})
export class ReportCustomerComponent implements OnInit {
  filter: any;
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  type: string = 'COMPTE'
  typeRow = [
    { label: 'COMPTE', value: 'COMPTE' },
    { label: 'DOSSIER', value: 'DOSSIER' },
    { label: 'PAIEMENT', value: 'PAIEMENT' }
  ]
  categorieRow = [];
  nameTitle: string = "Nom / Raison sociale"
  categorieTitle: string = "Catégorie"
  autreTitle: string = "Promotion"
  autreEtat: boolean = false
  categorieEtat: boolean = false

  constructor(
    public router: Router,
    private folderService: FolderService,
    private paymentCustomerService: PaymentCustomerService,
  ) {}

  ngOnInit(): void {}

  onFilter($event) {
    this.filter = $event
    if(this.type === 'COMPTE'){
      this.folderService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'DOSSIER'){
      this.folderService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    } else if(this.type === 'PAIEMENT'){
      this.folderService.getReport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter)
    }
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'COMPTE'){
      this.nameTitle = 'Nom / Raison sociale'
      this.autreTitle = ''
      this.autreEtat = false
      this.categorieEtat = false
      this.categorieRow = [];
    } else if($event === 'DOSSIER'){
      this.autreEtat = true
      this.categorieEtat = true
      this.autreTitle = 'Promotion'
      this.categorieTitle = 'Catégorie'
      this.categorieRow = [
        {label: 'PROMOTION IMMOBILIERE', value: 'PROMOTION'},
        {label: 'PROJET DE LOTISSEMENT', value: 'LOTISSEMENT'},
        {label: 'ACQUISITION AUPRES D\'PROPRIETAIRE', value: 'VENTE'}
      ];
    } else if($event === 'PAIEMENT'){
      this.autreEtat = true
      this.nameTitle = 'Client';
      this.autreTitle = 'Promotion'
      this.categorieRow = [];
    }
  }
  onPrinter() {
    if(this.type === 'COMPTE'){
      this.folderService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DOSSIER') {
      this.folderService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.paymentCustomerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
}
