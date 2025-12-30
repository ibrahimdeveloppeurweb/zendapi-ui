import { FilterService } from '@service/filter/filter.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Globals } from '@theme/utils/globals';
import { Construction } from '@model/construction';
import { Production } from '@model/production';
import { Quote } from '@model/quote';
import { Router } from '@angular/router';
import { Funding } from '@model/funding';
import { ConstructionService } from '@service/construction/construction.service';
import { ConstructionAddComponent } from '@chantier/construction/construction-add/construction-add.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '@service/quote/quote.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';

import { FundingService } from '@service/funding/funding.service';
import { ProductionService } from '@service/production/production.service';
import { QuoteAddComponent } from '@chantier/quote/quote-add/quote-add.component';
import { FundingAddComponent } from '@chantier/funding/funding-add/funding-add.component';
import { ProductionAddComponent } from '@chantier/production/production-add/production-add.component';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { InvoiceCoAddComponent } from '@agence/chantier/invoice-co/invoice-co-add/invoice-co-add.component';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { InvoicePaymentAddComponent } from '@agence/chantier/invoice-payment/invoice-payment-add/invoice-payment-add.component';
import { InvoicePaymentService } from '@service/invoice-payment/invoice-payment.service';
import { FormField } from '@theme/shared/components/search/search.component';
import { ProviderService } from '@service/provider/provider.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-construction-list',
  templateUrl: './construction-list.component.html',
  styleUrls: ['./construction-list.component.scss']
})
export class ConstructionListComponent implements OnInit {
  filter: any;
  action: boolean = true;
  total = 0;
  dtOptions: any = {};
  etat: boolean = false;
  visible: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  type: string = 'INTERVENTION';
  list: string = 'LOCATIVE';
  constructions: Construction[] = [];
  quotes: Quote[];
  bons: Quote[];
  invoiceCos: InvoiceCo[] = [];
  invoicePayments: InvoiceCo[] = [];
  fundings: Funding[];
  productions: Production[];
  modelRef: NgbModalRef
  typeRowLocative = [
    { label: 'INTERVENTION', value: 'INTERVENTION' },
    { label: 'DEVIS', value: 'DEVIS' },
    { label: 'BON DE COMMANDE', value: 'BON' },
    { label: 'FACTURE', value: 'FACTURE' },
    { label: 'FINANCEMENT', value: 'FINANCEMENT' },
    { label: 'REALISATION', value: 'REALISATION' }
  ];
  typeRowSyndic = [
    { label: 'INTERVENTION', value: 'INTERVENTION' },
    { label: 'DEVIS', value: 'DEVIS' },
    { label: 'BON DE COMMANDE', value: 'BON' },
    { label: 'FACTURE', value: 'FACTURE' },
    { label: 'REALISATION', value: 'REALISATION' }
  ];
  typeRow = this.typeRowLocative
  listRow = [
    { key: 'LOCATIVE', value: 'LOCATIVE' },
    { key: 'SYNDIC', value: 'SYNDIC' },
  ];
  nameTitle: string = "Nom prénoms / Raison sociale"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  cookie: string = ''
  categorieRow = [];
  providers = [];
  trustees = [];
  isSyndic = false;
  autorisation = Globals.autorisation

  countRow = [
    { key: "0", value: "Tout" },
    { key: "1", value: "1" },
    { key: "5", value: "5" },
    { key: "10", value: "10" },
    { key: "25", value: "25" },
    { key: "50", value: "50" },
    { key: "100", value: "100" },
    { key: "200", value: "200" }
  ];

  inputs: FormField<string>[] = [
    new FormField<string>({
      controlType: "dropdown",
      key: "list",
      label: "MODE",
      top: true,
      //visible: this.isSyndic,
      value: this.list,
      options: this.listRow,
      groups: ["ALL"],
      column: 3
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "syndic",
      label: "Syndic",
      //visible: this.isSyndic,
      top: true,
      options: this.trustees,
      groups: ["ALL"],
      column: 3
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "provider",
      label: "Fournissseur/Prestataire",
      top: true,
      options: this.providers,
      groups: ["DEVIS", "BON", "FACTURE"],
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "etat",
      label: "Etat",
      top: true,
      options: [
        { key: 'VALIDE', value: 'VALIDE' },
        { key: 'INVALIDE', value: 'INVALIDE' }
      ],
      groups: ["DEVIS", "BON", "FACTURE"],
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "etat",
      label: "Etat",
      top: true,
      options: [
        { key: 'PREVU', value: 'PREVU' },
        { key: 'EN COURS', value: 'EN COURS' },
        { key: 'STOPPER', value: 'STOPPER' },
        { key: 'ACHEVE', value: 'ACHEVE' }
      ],
      groups: ["INTERVENTION"],
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'code',
      type: 'text',
      label: 'N° Référence',
      groups: ['ALL'],
      top: true
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'name',
      type: 'text',
      label: 'Libéllé',
      groups: ['ALL'],
      top: true
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateD',
      type: 'date',
      label: 'Date de début',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateF',
      type: 'date',
      label: 'Date de fin',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'min',
      type: 'number',
      label: 'Montant Min',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'max',
      type: 'number',
      label: 'Montant Max',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'user',
      type: 'text',
      label: 'Créé par',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'create',
      type: 'date',
      label: 'Date de création',
      groups: ['ALL'],
      top: false,
      column: 3
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "ordre",
      label: "Ordre",
      top: false,
      options: [
        { key: 'DESC', value: 'Décroissant' },
        { key: 'ASC', value: 'Croissant' }
      ],
      groups: ["INTERVENTION"],
      column: 3
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: 'count',
      label: 'Nombre',
      options: this.countRow,
      groups: ['ALL'],
      top: false,
      column: 3
    }),
  ];

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private quoteService: QuoteService,
    private trusteeService: SyndicService,
    private providerService: ProviderService,
    private filterService: FilterService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private fundingService: FundingService,
    private invoiceCoService: InvoiceCoService,
    private productionService: ProductionService,
    private constructionService: ConstructionService,
    private permissionsService: NgxPermissionsService,
    private invoicePaymentService: InvoicePaymentService
  ) {
    this.constructionService.getList(null, null, null, null, this.list).subscribe(res => { return this.constructions = res; }, error => { });
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.trusteeService.getList().subscribe((list) => {
      for (const key in list) {
        this.trustees.push({
          key: list[key].id,
          value: list[key].nom
        });
      }
    })
    this.providerService.getList(null).subscribe((list) => {
      for (const key in list) {
        this.providers.push({
          key: list[key].id,
          value: list[key].nom
        });
      }
    })
    console.log(this.autorisation.SYNDIC)
    if(this.autorisation.SYNDIC){
      this.isSyndic = true;
      this.typeRow = this.typeRowSyndic
    }
  }

  ngOnInit(): void {
    this.etat = this.constructions ? true : false;
    if (this.etat) {
      this.constructions.forEach(item => {
        this.total += (item?.budget ? item?.budget : 0)
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CONSTRUCTION_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'CONSTRUCTION_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('construction');
    var etat = this.cookie ? true : false;
    if (this.cookie !== 'on-boarding-construction') {
      this.boarding.construction(etat);
    }
    this.boarding.construction(etat);
  }

  appendToList(item): void {
    this.constructions.unshift(item);
  }
  update(item): void {
    const index = this.constructions.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.constructions[index] = item;
    }
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.constructions = []
    this.quotes = []
    this.fundings = []
    this.productions = []
    this.filterService.search($event, 'construction', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if (this.type === 'INTERVENTION') {
          this.constructions = res;
          return this.constructions;
        } else if (this.type === 'DEVIS') {
          this.quotes = res;
          return this.quotes;
        } else if (this.type === 'BON') {
          this.bons = res;
          return this.quotes;
        } else if (this.type === 'FACTURE') {
          this.invoiceCos = res;
          return this.invoiceCos;
        } else if (this.type === 'PAIEMENT') {
          this.invoicePayments = res;
          return this.invoiceCos;
        } else if (this.type === 'FINANCEMENT') {
          this.fundings = res;
          return this.fundings;
        } else if (this.type === 'REALISATION') {
          this.productions = res;
          return this.productions;
        }
      }, err => { })
  }
  onChangeLoad($event) {
    var oldList = this.list
    this.type = $event
    this.list = oldList
    if ($event === 'INTERVENTION') {
      this.constructionService.getList(null, null, null, null, this.list).subscribe(res => { return this.constructions = res; }, error => { });
    } else if ($event === 'DEVIS') {
      this.quoteService.getList(null, null, null, null, null, null, this.list).subscribe(res => { return this.quotes = res; }, error => { });
    } else if ($event === 'BON') {
      this.quoteService.getList(null, null, null, 1, null, null, this.list).subscribe(res => { return this.bons = res; }, error => { });
    } else if ($event === 'FACTURE') {
      this.invoiceCoService.getList().subscribe(res => { return this.invoiceCos = res; }, error => { });
    } else if ($event === 'PAIEMENT') {
      this.invoicePaymentService.getList().subscribe(res => { return this.invoicePayments = res; }, error => { });
    } else if ($event === 'FINANCEMENT') {
      this.fundingService.getList().subscribe(res => { return this.fundings = res; }, error => { });
    } else if ($event === 'REALISATION') {
      this.productionService.getList(null).subscribe(res => { return this.productions = res; }, error => { });
    }
  }
  public searchChanged(event) {
    event.get("list").valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((data) => {
        if (data && data ) {
          this.list = data
          var oldType = this.type
          if (this.list == "LOCATIVE") {
            this.typeRow = this.typeRowLocative
          }else {
            this.typeRow = this.typeRowSyndic
          }
          this.type = oldType
          if (this.type === 'INTERVENTION') {
            this.constructionService.getList(null, null, null, null, this.list).subscribe(res => { return this.constructions = res; }, error => { });
          } else if (this.type === 'DEVIS') {
            this.quoteService.getList(null, null, null, null, null, null, this.list).subscribe(res => { return this.quotes = res; }, error => { });
          } else if (this.type === 'BON') {
            this.quoteService.getList(null, null, null, 1, null, null, this.list).subscribe(res => { return this.bons = res; }, error => { });
          }
        } 
      });
    
  }
  onPrinter() {
    if (this.type === 'INTERVENTION') {
      this.constructionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'DEVIS') {
      this.quoteService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'BON') {
      this.quoteService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'FINANCEMENT') {
      this.fundingService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'REALISATION') {
      this.productionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'FACTURE') {
      this.invoiceCoService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    if (this.type === 'INTERVENTION') {
      this.constructionService.getGenerer();
    }
  }
  onExport() {
    if (this.type === 'INTERVENTION') {
      this.constructionService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'DEVIS') {
      this.quoteService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'BON') {
      this.quoteService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'FACTURE') {
      this.invoiceCoService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'FINANCEMENT') {
      this.fundingService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'REALISATION') {
      this.productionService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  addConstruction(type, typeIntervention?) {
    this.modalService.dismissAll();
    this.constructionService.edit = false;
    this.constructionService.type = type;
    this.modal(ConstructionAddComponent, 'modal-basic-title', 'lg', true, 'static');
    this.modelRef.componentInstance.type = typeIntervention ?? "LOCATIVE"

  }

  addQuote(type) {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE"
  }
  addBon(type) {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE"
    this.modelRef.componentInstance.isBon = true
  }
  addInvoiceCo(type) {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE"
  }
  addInvoicePayment(type) {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.modal(InvoicePaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addFunding() {
    this.modalService.dismissAll();
    this.fundingService.edit = false;
    this.modal(FundingAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addProduction() {
    this.modalService.dismissAll();
    this.productionService.edit = false;
    this.modal(ProductionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  modal(component, type, size, center, backdrop, inputs?) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    })
  }
  readableDate(date): string { return DateHelperService.readable(date); }
  formatDate(date): string { return DateHelperService.fromJsonDate(date); }
  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }
}
