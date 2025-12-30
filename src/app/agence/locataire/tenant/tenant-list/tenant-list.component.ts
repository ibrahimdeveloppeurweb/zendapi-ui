import {Rent} from '@model/rent';
import {Renew} from '@model/renew';
import {Tenant} from '@model/tenant';
import {Invoice} from '@model/invoice';
import {Router} from '@angular/router';
import {Penality} from '@model/penality';
import {Contract} from '@model/contract';
import {Terminate} from '@model/terminate';
import {environment} from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NgbModal,NgbAccordionModule} from '@ng-bootstrap/ng-bootstrap';
import {ShortContract} from '@model/short-contract';
import {RentService} from '@service/rent/rent.service';
import { NgxPermissionsService } from 'ngx-permissions';
import {RenewService} from '@service/renew/renew.service';
import {FilterService} from '@service/filter/filter.service';
import {TenantService} from '@service/tenant/tenant.service';
import { NoticeService } from '@service/notice/notice.service';
import {PaymentService} from '@service/payment/payment.service';
import {InvoiceService} from '@service/invoice/invoice.service';
import {EmitterService} from '@service/emitter/emitter.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {ContractService} from '@service/contract/contract.service';
import {PenalityService} from '@service/penality/penality.service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import {TerminateService} from '@service/terminate/terminate.service';
import {InventoryService} from '@service/inventory/inventory.service';
import {GenerationComponent} from '@modal/generation/generation.component';
import {RentAddComponent} from '@locataire/rent/rent-add/rent-add.component';
import {ShortContractService} from '@service/short-contract/short-contract.service';
import {TenantAddComponent} from '@locataire/tenant/tenant-add/tenant-add.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import {PaymentAddComponent} from '@locataire/payment/payment-add/payment-add.component';
import {PenalityAddComponent} from '@locataire/penalty/penality-add/penality-add.component';
import { EntranceInvoiceService } from '@service/entrance-invoice/entrance-invoice.service';
import {ContractAddComponent} from '@locataire/contract/contract-add/contract-add.component';
import {InvoiceAddComponent} from '@agence/locataire/invoice/invoice-add/invoice-add.component';
import {InventoryAddComponent} from '@locataire/inventory/inventory-add/inventory-add.component';
import {TerminateAddComponent} from '@locataire/terminate/terminate-add/terminate-add.component';
import { RenewContractAddComponent } from '@locataire/renew-contract/renew-contract-add/renew-contract-add.component';
import { ShortContractAddComponent } from '@agence/locataire/short-contract/short-contract-add/short-contract-add.component';
import { ExtendContract } from '@model/extend-contract';
import { ExtendContractService } from '@service/extend-contract/extend-contract.service';
import { RenewPaymentService } from '@service/renew-payment/renew-payment.service';
import { InventoryModelAddComponent } from '@agence/locataire/inventory-model/inventory-model-add/inventory-model-add.component';
import { InventoryModelService } from '@service/inventory-model/inventory-model.service';
import { InventoryModel } from '@model/inventory-model';
import {GroupedContractService} from "@service/grouped-contract/grouped-contract.service";
import {
  GroupedContractAddComponent
} from "@locataire/grouped-contract/grouped-contract-add/grouped-contract-add.component";

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit, AfterViewInit {
  filter: any;
  notices = [];
  payments = [];
  renewPayments = [];
  rents: Rent[];
  renews: Renew[];
  autres: Invoice[];
  tenants: Tenant[];
  invoices: Invoice[];
  contracts: Contract[];
  courtTermes: Invoice[];
  penalities: Penality[];
  terminates: Terminate[];
  visible: boolean = false;
  locataire: boolean = true;
  extends: ExtendContract[];
  shortContracts: ShortContract[];
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user
  inventories = [];
  type: string = 'LOCATAIRE';
  typeRow = [
    {label: 'LOCATAIRE', value: 'LOCATAIRE'},
     {label: 'LOCATAIRE ARCHIVÉS', value: 'ARCHIVE'},
    {label: 'CONTRAT', value: 'CONTRAT'},
    {label: 'CONTRAT GROUPÉ', value: 'GROUPED_CONTRACT'},
    {label: 'CONTRAT COURT TERME', value: 'SHORT_CONTRACT'},
    {label: 'PAIEMENT', value: 'PAIEMENT'},
    {label: 'LOYER', value: 'LOYER'},
    {label: 'FACTURE D\'ENTREE', value: 'ENTREE'},
    {label: 'AVIS ECHEANCE', value: 'AVIS'},
    {label: 'PENALITE', value: 'PENALITE'},
    {label: 'AUTRES FACTURES', value: 'AUTRE'},
    {label: 'FACTURE CONTRAT COURT TERME', value: 'COURT-TERME'},
    {label: 'ETAT DES LIEUX', value: 'ETAT'},
    {label: 'RENOUVELLEMENT', value: 'RENEW'},
    {label: 'PROLONGEMENT', value: 'EXTEND'},
    {label: 'RESILIATION', value: 'RESILIATION'},
    {label: 'FACTURE / CONTRAT', value: 'FACTURE/CONTRAT'},
    {label: 'MODEL D\'ETAT DES LIEUX', value: 'INVENTORY_MODEL'}
    // {label: 'RENOUVELLEMENT PAIEMENT', value: 'RENOUVELLEMENT_PAIEMENT'}

  ];
  categorieRow = [
    {label: 'PARTICULIER', value: 'PARTICULIER'},
    {label: 'ENTREPRISE', value: 'ENTREPRISE'}
  ];
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de locataire"
  etatTitle: string = "Périodicité"

  nameTitle: string = "Nom / Raison sociale"
  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  autreTitle = "Propriétaire";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Owner';
  autreNamespace= 'Client';
  autreGroups= 'owner';

  bienTitle: string = "Nom du bien"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'House';
  bienNamespace= 'Client';
  bienGroups= 'house';

  libelleTitle: string = "N° Contrat"
  libelle: boolean = false
  libelleType = 'TEXT';
  libelleClass= 'House';
  libelleNamespace= 'Client';
  libelleGroups= 'house';

  cookie: string = ''
  max: boolean = false;
  min: boolean = false;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })

  etatRow = [
    { label: "AUCUN CONTRAT", value: "AUCUN" },
    { label: "JOURNALIER", value: "JOURNALIER" },
    { label: "MENSUEL", value: "MENSUEL" },
    { label: "TRIMESTRIEL", value: "TRIMESTRIEL" },
    { label: "SEMESTRIEL", value: "SEMESTRIEL" },
    { label: "ANNUEL", value: "ANNUEL" },
  ]

  view: boolean = false
  dtOptions: any = {};

  totalImpaye: number = 0
  models: InventoryModel[] = [];


  faire = 0
  cours = 0
  ferme = 0

  groupedContracts: any[] = []

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private rentService: RentService,
    private renewService: RenewService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private tenantService: TenantService,
    private noticeService: NoticeService,
    private filterService: FilterService,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private penalityService: PenalityService,
    private inventoryService: InventoryService,
    private terminateService: TerminateService,
    private permissionsService: NgxPermissionsService,
    private shortContractService: ShortContractService,
    private extendContractService: ExtendContractService,
    private entranceInvoiceService: EntranceInvoiceService,
    private renewPaymentService: RenewPaymentService,
    private inventoryModelService: InventoryModelService,
    private groupedContractService: GroupedContractService,

  ) {
    this.tenantService.getList(null,null,"NON_ARCHIVE").subscribe(res => {
      res.forEach((tenant: any) => {
        this.totalImpaye += tenant.impaye
      })
      return this.tenants = res;
    }, error => {});
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TENANT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TENANT_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('tenant');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-tenant') {
    //   this.boarding.tenant(etat);
    // }
    // this.boarding.tenant(etat);
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.tenants = []
    this.contracts = []
    this.terminates = []
    this.autres = []
    this.inventories = []
    this.invoices = []
    this.rents = []
    this.penalities = []
    this.payments = []
    this.notices = []
    this.renews = []
    this.shortContracts = []
    this.extends = []
    this.courtTermes = []
    this.filterService.search($event, 'tenant', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'LOCATAIRE' || this.type === 'ARCHIVE'){
          res.forEach((tenant: any) => {
            this.totalImpaye += tenant.impaye
          })
          this.tenants = res;
        } else if(this.type === 'CONTRAT'){
          this.contracts = res;
          return this.contracts;
        } else if(this.type === 'RESILIATION'){
          this.terminates = res;
          return this.terminates;
        } else if(this.type === 'ETAT'){
          this.inventories = res;
          return this.inventories;
        } else if(this.type === 'ENTREE'){
          this.invoices = res;
          return this.invoices;
        } else if(this.type === 'AUTRE'){
          this.autres = res;
          return this.autres;
        } else if(this.type === 'COURT-TERME'){
          this.courtTermes = res;
          return this.courtTermes;
        } else if(this.type === 'LOYER'){
          this.rents = res;
          return this.rents;
        } else if(this.type === 'PENALITE'){
          this.penalities = res;
          return this.penalities;
        } else if(this.type === 'AVIS'){
          this.notices = res;
        } else if(this.type === 'PAIEMENT'){
          this.payments = res;
          return this.payments;
        } else if(this.type === 'RENEW'){
          this.renews = res;

        } else if(this.type === 'SHORT_CONTRACT'){
          this.shortContracts = res;
        } else if(this.type === 'EXTEND'){
          this.extends = res;
        } else if(this.type === 'GROUPED_CONTRACT'){
          this.groupedContracts = res;
          return this.groupedContracts;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'LOCATAIRE' || $event === 'ARCHIVE'){
      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.nameTitle = 'Nom / Raison sociale'
      this.nameType = 'TEXT';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.categorieTitle = 'Type de locataire'

      this.etatTitle = 'Périodicité'
      this.etatRow = [
        { label: "AUCUN CONTRAT", value: "AUCUN" },
        { label: "JOURNALIER", value: "JOURNALIER" },
        { label: "MENSUEL", value: "MENSUEL" },
        { label: "TRIMESTRIEL", value: "TRIMESTRIEL" },
        { label: "SEMESTRIEL", value: "SEMESTRIEL" },
        { label: "ANNUEL", value: "ANNUEL" },
      ];
      this.categorieRow = [
        {label: 'PARTICULIER', value: 'PARTICULIER'},
        {label: 'ENTREPRISE', value: 'ENTREPRISE'}
      ];
      this.visible = false;
      this.autre = true;
      this.min = false;
      this.max = false;
      this.tenants =  [];
      let typetenant = null;
      if ($event === 'ARCHIVE') { typetenant = "ARCHIVE"} else{ typetenant = "NON_ARCHIVE"}
      this.tenantService.getList(null,null,typetenant).subscribe(res => {
        res.forEach((tenant: any) => {
          this.totalImpaye += tenant.impaye
        })
        return this.tenants = res;
      }, error => {} );
    } else if($event === 'CONTRAT'){
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'ACTIF', value: 'ACTIF'},
        {label: 'INACTIF', value: 'INACTIF'},
        {label: 'RESILIE', value: 'RESILIE'}
      ]
      this.categorieTitle = 'Type de contrat'
      this.categorieRow = [
        {label: 'HABITATION', value: 'HABITATION'},
        {label: 'COMMERCIAL', value: 'COMMERCIAL'}
      ];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.contractService.getList(null, null).subscribe(res => { return this.contracts = res; }, error => {} );
    } else if($event === 'RESILIATION'){
      this.libelleTitle = 'N° Contrat';
      this.libelleType = 'TEXT';
      this.libelle = false;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.autre = true;
      this.autreTitle = "Propriétaire";
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner'

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';;

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ]
      this.categorieRow = []
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.terminateService.getList(null).subscribe(res => { return this.terminates = res; }, error => {} );
    } else if($event === 'ETAT'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.categorieTitle = 'Type d\'etat des lieux';
      this.categorieRow = [
        {label: 'ENTREE', value: 'ENTREE'},
        {label: 'SORTIE', value: 'SORTIE'}
      ]

      this.etatRow = [
        {label: 'EN ATTENTE', value: 'EN ATTENTE'},
        {label: 'VALIDE', value: 'VALIDE'}
      ];
      this.visible = true
      this.autre = true;
      this.min = false;
      this.max = false;
      this.inventoryService.getList(null).subscribe(res => { return this.inventories = res; }, error => {} );
    } else if($event === 'AUTRE'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.categorieRow = [];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.invoiceService.getList(null, 'AUTRE', null, null, null, null, null, null, null).subscribe(res => { return this.autres = res; }, error => {} );
    } else if($event === 'COURT-TERME'){
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.categorieRow = [];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.invoiceService.getList(null, 'COURT-TERME', null, null, null, null, null, null, null).subscribe(res => { this.courtTermes = res;}, error => {} );
    } else if($event === 'ENTREE'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.etatTitle = 'Etat'
      this.categorieRow = []
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.invoiceService.getList(null, 'ENTREE', null, null, null, null, null, null, null).subscribe(res => { return this.invoices = res; }, error => {} );
    } else if($event === 'PENALITE'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.categorieRow = [];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.penalityService.getList(null, null).subscribe(res => { return this.penalities = res; }, error => {} );
    } else if($event === 'LOYER'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE + ATTENTE + EN COURS', value: 'IMPAYE_ATTENTE_EN_COURS'},
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        {label: 'LOYER', value: 'LOYER'},
        {label: 'AVANCE', value: 'AVANCE'}
      ];
      this.visible = false;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.rentService.getList(null, null).subscribe(res => { return this.rents = res; }, error => {} );
    } else if($event === 'AVIS'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;

      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = []
      this.categorieRow = []
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.noticeService.getList(null).subscribe(res => { return this.notices = res; }, error => {} );
    }
    else if($event === 'PAIEMENT'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';
      
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'EN ATTENTE DE VALIDATION', value: 'INVALIDE'}
      ]
      this.categorieTitle = 'Type facture'
      this.categorieRow = [
        {label: "FACTURE D'ENTREE", value: 'ENTREE'},
        {label: "AUTRES FACTURE", value: 'AUTRE'},
        {label: 'LOYER', value: 'LOYER'},
        {label: 'PENALITE', value: 'PENALITE'},
      ];
      this.visible = false;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.paymentService.getList(null, null, null, null, null, null, 30).subscribe(res => { return this.payments = res; }, error => {} );
    } else if($event === 'RENEW'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'ACTIF', value: 'ACTIF'},
        {label: 'INACTIF', value: 'INACTIF'},
        {label: 'EXPIRER', value: 'EXPIRER'}
      ];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.renewService.getList(null, null).subscribe(res => { return this.renews = res; }, error => {} );
    } else if($event === 'SHORT_CONTRACT'){
      this.libelleTitle = 'N° Contrat';
      this.libelle = true;
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'ACTIF', value: 'ACTIF'},
        {label: 'INACTIF', value: 'INACTIF'},
        {label: 'EXPIRER', value: 'EXPIRER'}
      ];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.shortContractService.getList(null, null).subscribe(res => { this.shortContracts = res;}, error => {} );
    } else if($event === 'EXTEND'){
      this.bienTitle = 'N° Contrat';
      this.etatTitle = 'Etat'
      this.nameTitle = 'Locataire'
      this.autreTitle = "Propriétaire";
      this.etatRow = [
        {label: 'ACTIF', value: 'ACTIF'},
        {label: 'INACTIF', value: 'INACTIF'},
        {label: 'EXPIRER', value: 'EXPIRER'}
      ];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.extendContractService.getList(null, null).subscribe(res => { return this.extends = res; }, error => {} );
    }else if($event === 'INVENTORY_MODEL'){
      this.autreTitle = "Propriétaire";
      this.autre = false;
       this.bien = false;
      this.nameTitle = 'libellé'
      this.etatRow = []
      this.inventoryModelService.getList().subscribe(res => {
        return this.models = res;
      }, error => {});
    } else if($event === 'GROUPED_CONTRACT'){
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'ACTIF', value: 'ACTIF'},
        {label: 'INACTIF', value: 'INACTIF'},
        {label: 'RESILIE', value: 'RESILIE'}
      ]
      this.categorieTitle = 'Type de contrat'
      this.categorieRow = [
        {label: 'HABITATION', value: 'HABITATION'},
        {label: 'COMMERCIAL', value: 'COMMERCIAL'}
      ];
      this.visible = true;
      this.autre = true;
      this.min = true;
      this.max = true;
      this.groupedContractService.getList(null, null).subscribe(res => { return this.groupedContracts = res; }, error => {} );
    }

  }
  onPrinter() {
    if(this.type === 'LOCATAIRE'){
      this.tenantService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CONTRAT') {
      this.contractService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.paymentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }  else if(this.type === 'LOYER') {
      this.rentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ENTREE') {
      this.entranceInvoiceService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'AVIS') {
      this.noticeService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PENALITE') {
      this.penalityService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'AUTRE') {
      this.invoiceService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ETAT') {
      this.inventoryService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RENEW') {
      this.renewService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RESILIATION') {
      this.terminateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'SHORT_CONTRACT') {
      this.shortContractService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'EXTEND') {
      this.extendContractService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'GROUPED_CONTRACT') {
      this.groupedContractService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onExport() {
    if(this.type === 'LOCATAIRE'){
      this.tenantService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'CONTRAT') {
      this.contractService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.paymentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'LOYER') {
      this.rentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ENTREE') {
      this.entranceInvoiceService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'AVIS') {
      this.noticeService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PENALITE') {
      this.penalityService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'AUTRE') {
      this.invoiceService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ETAT') {
      this.inventoryService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RENEW') {
      this.renewService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RESILIATION') {
      this.terminateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'SHORT_CONTRACT') {
      this.shortContractService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'EXTEND') {
      this.extendContractService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'GROUPED_CONTRACT') {
      this.groupedContractService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel(){
    if(this.type === 'LOCATAIRE'){
      this.tenantService.getGenerer();
    } else if(this.type === 'PAIEMENT') {
      this.paymentService.getGenerer();
    } else if(this.type === 'LOYER') {
      this.rentService.getGenerer();
    }
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  appendToList(tenant): void {
    this.tenants.unshift(tenant);
  }
  update(tenant): void {
    const index = this.tenants.findIndex(x => x.uuid === tenant.uuid);
    if (index !== -1) {
      this.tenants[index] = tenant;
    }
  }
  addTenant(type) {
    this.modalService.dismissAll();
    this.tenantService.edit = false;
    this.tenantService.type = type;
    this.modal(TenantAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addGenerate(){
    this.modal(GenerationComponent, 'modal-basic-title', 'md', true, 'static');
  }
  showTenant(row) {
    this.tenantService.setTenant(row);
    this.router.navigate(['/admin/locataire/show/' + row.uuid]);
  }
  editTenant(row) {
    this.tenantService.setTenant(row);
    this.tenantService.edit = true;
    this.tenantService.type = row.type;
    this.modal(TenantAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerTenant(row): void {
    this.tenantService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  addContract() {
    this.modalService.dismissAll();
    this.contractService.edit = false;
    this.modal(ContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addGroupedContract() {
    this.modalService.dismissAll();
    this.groupedContractService.edit = false;
    this.modal(GroupedContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  renewContract(){
    this.modalService.dismissAll();
    this.contractService.setContract(null);
    this.modal(RenewContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addPayement() {
    this.modalService.dismissAll();
    this.paymentService.edit = false;
    this.paymentService.isTreso = "NON";
    this.paymentService.treasury = null;
    this.modal(PaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addInventory() {
    this.modalService.dismissAll();
    this.inventoryService.edit = false;
    this.modal(InventoryAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addRent() {
    this.modalService.dismissAll();
    this.rentService.edit = false;
    this.modal(RentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addInvoice() {
    this.modalService.dismissAll();
    this.invoiceService.edit = false;
    this.modal(InvoiceAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addPenality() {
    this.modalService.dismissAll();
    this.penalityService.edit = false;
    this.modal(PenalityAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addTerminate() {
    this.modalService.dismissAll();
    this.terminateService.edit = false;
    this.contractService.setContract(null);
    this.modal(TerminateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addShortContract() {
    this.modalService.dismissAll();
    this.shortContractService.edit = false;
    this.shortContractService.setShortContract(null);
    this.modal(ShortContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  addModelLieux() {
    this.modalService.dismissAll();
    this.terminateService.edit = false;
    this.inventoryModelService.edit = false;
    this.contractService.setContract(null);
    this.modal(InventoryModelAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer ce locataire ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.tenantService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.tenants.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.tenants.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  timelapse(date): void { DateHelperService.getTimeLapse(date); }

  onChangeView() {
    this.view = !this.view
  }
}
