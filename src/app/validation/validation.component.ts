import { Component, Input, OnInit } from '@angular/core';
import {AuthService} from '@service/auth/auth.service';
import {FilterService} from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';


@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {
  // isFilterVisible: boolean = true
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
    autre: null,
    bien: null,
    ordre: "ASC",
    type: "PAIEMENT",
    uuid: null
  }

  type: string = 'PAIEMENT';
  default = "PAIEMENT";
  typeRow = [
    {label: 'PAIEMENT LOCATION', value: 'PAIEMENT'},
    {label: 'PAIEMENT VENTE', value: 'PAIEMENT-VENTE'},
    {label: 'CONTRAT DE LOCATION', value: 'CONTRAT'},
    {label: 'DOSSIER DE VENTE', value: 'FOLDER'},
    {label: 'MANDAT', value: 'MANDAT'},
    {label: 'REVERSEMENT', value: 'REVERSEMENT'},
    {label: 'ETAT DES LIEUX', value: 'ETAT'},
    {label: 'RESILIATION DE CONTRAT', value: 'RESILIATION'},
    {label: 'RESILIATION DE DOSSIER', value: 'RESILIATION-DOSSIER'},
    {label: 'RENOUVELLEMENT DE CONTRAT', value: 'RENOUVELLEMENT'},
    {label: 'MUTATION DE CONTRAT', value: 'MUTATION'},
    { label: "DEMANDE DE FOND", value: "DEMANDE" }
  ];

  autreTitle = "Propriétaire";
  autre: boolean = false;
  autreType = 'ENTITY';
  autreClass= 'Owner';
  autreNamespace= 'Client';
  autreGroups= 'owner';

  bienTitle: string = "Nom du bien"
  bien: boolean = false
  bienType = 'ENTITY';
  bienClass= 'House';
  bienNamespace= 'Client';
  bienGroups= 'house';

  nameTitle: string = "Locataire"
  name: boolean = false;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  token = null;
  widget = null;
  datas = [];

  constructor(
    private auth: AuthService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService,
    private filterService: FilterService,
  ) {
    
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.token = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.loadData();
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_VALIDATE') {
        this.widget.pay = this.widget.pay - 1
      }
      if (data.action === 'INVENTORY_VALIDATE') {
        this.widget.inv = this.widget.inv - 1
      }
      if (data.action === 'CONTRACT_ACTIVATE') {
        this.widget.cont = this.widget.cont - 1
      }
      if (data.action === 'RENEW_ACTIVATE') {
        this.widget.renew = this.widget.renew - 1
      }
      if (data.action === 'TERMINATE_RESILIE') {
        this.widget.resili = this.widget.resili - 1
      }
      if (data.action === 'MANDAT_VALIDATE') {
        this.widget.mandat = this.widget.mandat - 1
      }
      if (data.action === 'REPAYMENT_VALIDATE') {
        this.widget.repay = this.widget.repay - 1
      }
      if (data.action === 'FOLDER_ACTIVATE') {
        this.widget.fol = this.widget.fol - 1
      }
      if (data.action === 'MUTATE_VALIDATE') {
        this.widget.mutate = this.widget.mutate - 1
      }
      if (data.action === 'FOLDER_TERMINATE_ACTIVATE') {
        // this.widget.mandat = this.widget.mandat - 1
      }
      if (data.action === 'PAYMENT_CUSTOMER_VALIDATE') {
        this.widget.payCl = this.widget.payCl - 1
      }
      if (data.action === 'TERMINATE_FOLDER__VALIDATE') {
        this.widget.resiliF = this.widget.resiliF - 1
      }
      if (data.action === 'DEMANDE_VALIDATE') {
        this.widget.fund = this.widget.fund - 1
      }
    });
  }

  onFilter($event) {
    $event.type = this.default;
    this.filterService.type = this.type;
    this.datas = []
    this.filterService.search($event, 'validation', this.token.uuid).subscribe(
      res => {
        this.datas = res        
        console.log(this.datas, "donnée data");
        return this.datas
    }, err => { })
   
    
  }
  loadData() {
    this.filterService.dashboard(this.event, 'validation', this.token.uuid).subscribe(
      res => {
        this.widget = res;
        this.onFilter(this.event);
        console.log(this.event,"data event");
      }, err => { }
    )
  }
  onChangeLoad(type){
    this.type = type
    this.event.type = type;
    if(type === 'PAIEMENT'){
      this.typeRow = [{label: 'PAIEMENT LOCATION', value: 'PAIEMENT'} ];
      this.default = "PAIEMENT";
      this.onFilter(this.event)
    }else if(type === 'PAIEMENT-VENTE'){
      this.typeRow = [ {label: 'PAIEMENT VENTE', value: 'PAIEMENT-VENTE'}];
      this.default = "PAIEMENT-VENTE";
      this.onFilter(this.event)
    }else if(type === 'CONTRAT'){
      this.typeRow = [{label: 'CONTRAT DE LOCATION', value: 'CONTRAT'}];
      this.default = "CONTRAT";
      this.onFilter(this.event)
    }else if(type === 'FOLDER'){
      this.typeRow = [{label: 'DOSSIER DE VENTE', value: 'FOLDER'} ];
      this.default = "FOLDER";
      this.onFilter(this.event)
    }else if(type === 'MANDAT'){
      this.typeRow = [{label: 'MANDAT', value: 'MANDAT'}];
      this.default = "MANDAT";
      this.onFilter(this.event)
    }else if(type === 'REVERSEMENT'){
      this.typeRow = [{label: 'REVERSEMENT', value: 'REVERSEMENT'}];
      this.default = "REVERSEMENT";
      this.onFilter(this.event)
    }else if(type === 'ETAT'){
      this.typeRow = [{label: 'ETAT DES LIEUX', value: 'ETAT'}];
      this.default = "ETAT";
      this.onFilter(this.event)
    }else if(type === 'RESILIATION'){
      this.typeRow = [{label: 'RESILIATION DE CONTRAT', value: 'RESILIATION'} ];
      this.default = "RESILIATION";
      this.onFilter(this.event)
    }else if(type === 'RESILIATION-DOSSIER'){
      this.typeRow = [{label: 'RESILIATION DE DOSSIER', value: 'RESILIATION-DOSSIER'}];
      this.default = "RESILIATION-DOSSIER";
      this.onFilter(this.event)
    }else if(type === 'RENOUVELLEMENT'){
      this.typeRow = [{label: 'RENOUVELLEMENT DE CONTRAT', value: 'RENOUVELLEMENT'}];
      this.default = "RENOUVELLEMENT";
      this.onFilter(this.event)
    }else if(type === 'MUTATION'){
      this.typeRow = [{label: 'MUTATION DE CONTRAT', value: 'MUTATION'}];
      this.default = "MUTATION";
      this.onFilter(this.event)
    }else if(type === 'APPROVISIONNEMNT'){
      this.typeRow = [{label: 'APPROVISIONNEMNT', value: 'APPROVISIONNEMNT'}];
      this.default = "APPROVISIONNEMNT";
      this.onFilter(this.event)
    }else if(type === 'DEPENSE'){
      this.typeRow = [{label: 'DEPENSE', value: 'DEPENSE'}];
      this.default = "DEPENSE";
      this.onFilter(this.event)
    }else if(type === 'DEMANDE'){
      this.typeRow = [{label: 'DEMANDE', value: 'DEMANDE'}];
      this.default = "DEMANDE";
      this.onFilter(this.event)
    }
  }

}
