import { Rent } from '@model/rent';
import { Notice } from '@model/notice';
import { Tenant } from '@model/tenant';
import { Payment } from '@model/payment';
import { Invoice } from '@model/invoice';
import { Penality } from '@model/penality';
import { Contract } from '@model/contract';
import { Inventory } from '@model/inventory';
import { Terminate } from '@model/terminate';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ShortContract } from '@model/short-contract';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { RendService } from '@service/rdv/rend.service';
import { RentService } from '@service/rent/rent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '@service/tenant/tenant.service';
import { FilterService } from '@service/filter/filter.service';
import { NoticeService } from '@service/notice/notice.service';
import { TicketService } from '@service/ticket/ticket.service';
import { PaymentService } from '@service/payment/payment.service';
import { InvoiceService } from '@service/invoice/invoice.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { PenalityService } from '@service/penality/penality.service';
import { ContractService } from '@service/contract/contract.service';
import { ActivityService } from '@service/activity/activity.service';
import { InventoryService } from '@service/inventory/inventory.service';
import { TenantAddComponent } from '../tenant-add/tenant-add.component';
import { TerminateService } from '@service/terminate/terminate.service';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import {GroupedContractService} from "@service/grouped-contract/grouped-contract.service";

@Component({
  selector: 'app-tenant-show',
  templateUrl: './tenant-show.component.html',
  styleUrls: ['./tenant-show.component.scss']
})
export class TenantShowComponent implements OnInit {
  publicLink = environment.publicUrl;
  public activeTab: string = 'LOCATAIRE';
  public activeLoyerTab: string = '';
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  tenant: Tenant;
  contrat : Contract;
  locataire: boolean = false;
  typeI: string = '';
  terminates: Terminate[] = [];
  contracts: Contract[] = [];
  shortContracts: ShortContract[] = [];
  inventories: Inventory[] = [];
  invoices: Invoice[] = [];
  autres: Invoice[] = [];
  invoicesTerminate: Invoice[] = [];
  shortInvoices: Invoice[] = [];
  rents: Rent[] = [];
  penalities: Penality[] = [];
  notices: Notice[] = [];
  payments: Payment[] = [];
  publicUrl = environment.publicUrl;
  type: string = 'LOCATAIRE';
  etatRow = [];
  tickets: any[] = []
  typeRow = [
    { label: 'LOCATAIRE', value: 'LOCATAIRE' },
    { label: 'CONTRAT', value: 'CONTRAT' },
    {label: 'CONTRAT COURT TERME', value: 'SHORT_CONTRACT'},
    { label: 'RESILIATION', value: 'RESILIATION' },
    { label: 'ETAT DES LIEUX', value: 'ETAT' },
    { label: 'LOYER', value: 'LOYER' },
    { label: 'FACTURE', value: 'FACTURE' },
    { label: 'AUTRES FACTURES', value: 'AUTRE' },
    { label: 'PENALITE', value: 'PENALITE' },
    { label: 'AVIS ECHEANCE', value: 'AVIS' },
    { label: 'PAIEMENT', value: 'PAIEMENT' },
    { label: 'RESILIATION', value: 'FACTRESILIATION' },
    { label: 'FACTURE COURT TERME', value: 'COURT-TERME'}
  ];
  categorieRow = [
    { label: 'PARTICULIER', value: 'PARTICULIER' },
    { label: 'ENTREPRISE', value: 'ENTREPRISE' }
  ];
  minTitle: string = "Montant MIN"
  userTitle: string = "Crée par"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de locataire"
  etatTitle: string = "Disponibilité ?"
  file: any;
  rdvs = []
  notes = []

  faire = 0
  cours = 0
  ferme = 0


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
  contratUuid: any;

  groupedContracts: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private rdvService: RendService,
    private rentService: RentService,
    private uploader: UploaderService,
    public ticketService: TicketService,
    private noticeService: NoticeService,
    private filterService: FilterService,
    private tenantService: TenantService,
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private penalityService: PenalityService,
    private activityService: ActivityService,
    private inventoryService: InventoryService,
    private terminateService: TerminateService,
    private permissionsService: NgxPermissionsService,
    private shortContractService: ShortContractService,
    private groupedContractService: GroupedContractService
  ) {
    this.tenant = this.tenantService.getTenant();
    this.onChangeLoad(this.type);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  onFilter($event) {
    this.rents = [];
    this.autres = [];
    this.notices = [];
    this.payments = [];
    this.invoices = [];
    this.terminates = [];
    this.penalities = [];
    this.inventories = [];
    this.shortInvoices = [];
    this.shortContracts = [];
    this.invoicesTerminate = [];
    $event.type = this.activeTab;
    $event.contract = this.contratUuid;
    if (this.activeTab != 'LOYER') {
      this.contracts = [];
    }

    this.filterService.search($event, 'tenant', this.tenant.uuid).subscribe(
      res => {
        if (this.activeTab === 'CONTRAT') {
          return this.contracts = res;
        } else if (this.activeTab === 'SHORT_CONTRACT') {
          return this.shortContracts = res;
        } else if (this.activeTab === 'ETAT') {
          return this.inventories = res;
        } else if (this.activeTab === 'ENTREE') {
          return this.invoices = res;
        } else if (this.activeTab === 'AUTRE') {
          return this.autres = res;
        } else if (this.activeTab === 'LOYER') {
          if (res && Array.isArray(res) && res.length > 0) {
            // Utiliser un Map pour regrouper les contrats par UUID
            let contractMap = new Map<string, any>();
            res.forEach(item => {
                if (item.contract?.uuid) {
                    contractMap.set(item.contract.uuid, item.contract);
                }
            });
            // Convertir le Map en tableau et l'affecter à this.contracts
            // this.contracts = Array.from(contractMap.values());
            // Filtrer les rents en fonction des contrats regroupés
            this.rents = res.filter(rent =>
                rent.contract?.uuid && contractMap.has(rent.contract.uuid)
            );
          }
          return this.rents;
        } else if (this.activeTab === 'PENALITE') {
          return this.penalities = res;
        } else if (this.activeTab === 'PAIEMENT') {
          return this.payments = res;
        } else if (this.activeTab === 'AVIS') {
          return this.notices = res;
        } else if (this.activeTab === 'RESILIATION') {
          return this.terminates = res;
        } else if (this.activeTab === 'FACTRESILIATION') {
          return this.invoicesTerminate = res;
        } else if (this.activeTab === 'COURT-TERME') {
          return this.shortInvoices = res;
        } else if (this.activeTab === 'FACTURE_CONTRAT') {
          // return this.shortInvoices = res;
        }
      }, err => { })
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'LOCATAIRE') {
      if (!this.tenant) {
        this.tenantService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.tenant = res
        });
      }
    } else if (type === 'CONTRAT') {
      this.name = false;
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
      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.typeRow = [
        { label: 'CONTRAT', value: 'CONTRAT' },
        { label: 'RESILIATION', value: 'RESILIATION' },
        { label: 'COURT TERME', value: 'SHORT_CONTRACT' },
      ];
      this.contractService.getList(this.tenant.uuid, null).subscribe((res) => {
        return this.contracts = res;
      }, error => { }
      );
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'ACTIF', value: 'ACTIF' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'RESILIE', value: 'RESILIE' }
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        { label: 'HABITATION', value: 'HABITATION' },
        { label: 'COMMERCIAL', value: 'COMMERCIAL' }
      ]
    } else if (type === 'CONTRAT_GROUPED') {
      this.name = false;
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
      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.typeRow = [
        { label: 'CONTRAT GROUPÉ', value: 'CONTRAT_GROUPED' }
      ];
      this.groupedContractService.getList(this.tenant.uuid, null).subscribe((res) => {
          return this.contracts = res;
        }, error => { }
      );
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'ACTIF', value: 'ACTIF' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'RESILIE', value: 'RESILIE' }
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        { label: 'COMMERCIAL', value: 'COMMERCIAL' }
      ]
    } else if (type === 'SHORT_CONTRACT') {
      this.name = false;
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

      this.typeRow = [
        { label: 'COURT TERME', value: 'SHORT_CONTRACT' },
        { label: 'CONTRAT', value: 'CONTRAT' },
        { label: 'RESILIATION', value: 'RESILIATION' },
      ];
      this.shortContractService.getList(this.tenant.uuid, null).subscribe((res) => {
        return this.shortContracts = res;
      }, error => { }
      );
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'ACTIF', value: 'ACTIF' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'RESILIE', value: 'RESILIE' }
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        { label: 'HABITATION', value: 'HABITATION' },
        { label: 'COMMERCIAL', value: 'COMMERCIAL' }
      ]
    } else if (type === 'RESILIATION') {
      this.name = false;
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

      this.typeRow = [
        { label: 'RESILIATION', value: 'RESILIATION' },
        { label: 'CONTRAT', value: 'CONTRAT' },
        { label: 'COURT TERME', value: 'SHORT_CONTRACT' },
      ];
      this.terminateService.getList(this.tenant.uuid).subscribe((res) => {
        return this.terminates = res;
      }, error => { }
      );
    } else if (type === 'ETAT') {
      this.name = false;
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

      this.typeRow = [{ label: 'ETAT', value: 'ETAT' }];
      this.inventoryService.getList(this.tenant.uuid).subscribe((res) => {
        return this.inventories = res;
      }, error => { }
      );
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'EN ATTENTE', value: 'ATTENTE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'SORTIE', value: 'SORTIE' }
      ]
    } else if (type === 'AUTRE') {
      this.name = false;
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

      this.typeI = 'autre'
      this.invoiceService.getList(this.tenant.uuid, type, null).subscribe((res) => {
        return this.autres = res;
      }, error => { }
    );
      this.typeRow = [
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'LOYER', value: 'LOYER' },
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
        { label: 'FACTURE COURT TERME', value: 'COURT-TERME'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieRow = []
    } else if (type === 'ENTREE') {
      this.name = false;
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

      this.invoiceService.getList(this.tenant.uuid, type, null).subscribe((res) => {
        return this.invoices = res;
      }, error => { }
      );
      this.typeRow = [
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'LOYER', value: 'LOYER' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'FACTURE COURT TERME', value: 'COURT-TERME'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieRow = []
    } else if (type === 'FACTRESILIATION') {
      this.name = false;
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

      this.typeI = 'resiliation'
      this.invoiceService.getList(this.tenant.uuid, 'RESILIATION', null).subscribe((res) => {
        return this.invoicesTerminate = res;
      }, error => { }
      );
      this.typeRow = [
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
        { label: 'LOYER', value: 'LOYER' },
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'FACTURE COURT TERME', value: 'COURT-TERME'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieRow = []
    }  else if (type === 'COURT-TERME') {
      this.name = false;
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

      this.typeI = 'factureCourtTerme'
      this.invoiceService.getList(this.tenant.uuid, 'COURT-TERME', null).subscribe((res) => {
        return this.shortInvoices = res;
      }, error => { }
      );
      this.typeRow = [
        { label: 'FACTURE COURT TERME', value: 'COURT-TERME'},
        { label: 'LOYER', value: 'LOYER' },
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieRow = []
    } else if (type === 'PENALITE') {
      this.name = false;
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

      this.penalityService.getList(this.tenant.uuid).subscribe((res) => {
        return this.penalities = res;
      }, error => { }
      );
      this.typeRow = [
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'LOYER', value: 'LOYER' },
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'FACTURE COURT TERME', value: 'SHORT_CONTRACT'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieRow = []
    } else if (type === 'LOYER') {
      this.name = false;
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

      this.libelleTitle  = "N° Contrat"
      this.libelle = true
      this.libelleType = 'TEXT';
      this.libelleClass= 'House';
      this.libelleNamespace= 'Client';
      this.libelleGroups= 'house';

      // this.rentService.getList(this.tenant.uuid).subscribe((res) => {
      //   return this.rents = res;
      // }, error => { }
      // // this.rentService.getList(this.contrat.uuid).subscribe((res) => {
      // //   return this.rents = res;
      // // }, error => { }
      // );

      this.contractService.getList(this.tenant.uuid, null).subscribe((res) => {
        this.activeLoyerTab = ""
        if (res) {
          console.log(res)
          this.activeLoyerTab = res[0]?.code;
          this.contratUuid = res[0]?.id;
          this.onChangeLoadLoyer(res[0], this.activeLoyerTab)
        }
        return this.contracts = res;
      }, error => {});

    


      this.typeRow = [
        { label: 'LOYER', value: 'LOYER' },
        { label: 'ENTREE', value: 'ENTREE' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: 'AUTRE', value: 'AUTRE' },
        { label: 'RESILIATION', value: 'FACTRESILIATION' },
        { label: 'FACTURE COURT TERME', value: 'SHORT_CONTRACT'},
      ];
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'SOLDE', value: 'SOLDE' }
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = [
        { label: 'LOYER', value: 'LOYER' },
        { label: 'AVANCE', value: 'AVANCE' }
      ]

    } else if (type === 'AVIS') {
      this.name = false;
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

      this.noticeService.getList(this.tenant.uuid).subscribe((res) => {
        return this.notices = res;
      }, error => { }
      );
      this.typeRow = [{ label: 'AVIS', value: 'AVIS' }];
      this.etatRow = []
      this.categorieRow = []
    } else if (type === 'PAIEMENT') {
      this.name = false;
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

      this.typeRow = [{ label: 'PAIEMENT', value: 'PAIEMENT' }];
      this.paymentService.getList(this.tenant.uuid).subscribe((res) => {
        return this.payments = res;
      }, error => { }
      );
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'EN ATTENTE DE VALIDATION', value: 'INVALIDE' }
      ]
      this.categorieTitle = 'Type facture'
      this.categorieRow = [
        { label: 'LOYER', value: 'LOYER' },
        { label: "FACTURE D'ENTREE", value: 'ENTREE' },
        { label: 'PENALITE', value: 'PENALITE' },
        { label: "AUTRES FACTURE", value: 'AUTRE' },
      ]
    } else if (type === 'NOTE_INTERNE'){
      this.activityService.getList(null, null, null, this.tenant.uuid).subscribe((res: any) => {
        return this.notes = res
      })
      this.rdvService.getList(null, null, null, this.tenant.uuid).subscribe((res: any) => {
        return this.rdvs = res
      })
    } else if (type === 'TICKET'){
      this.ticketService.getList(null,null,null,this.tenant.uuid).subscribe(res => {
        return this.tickets = res;
    }, error => { });
    }


  }

  onChangeLoadLoyer(contract, type): void {
    console.log(contract);
    this.activeLoyerTab = type;
    this.contratUuid = contract?.id;
    this.rents = []
    this.rentService.getList(this.tenant.uuid, contract.uuid).subscribe((res) => {
      this.rents = res;
      console.log(this.rents);
    }, error => { });

  }
  // getRentsByContract(contract: any){
  //   this.rentService.getList(this.tenant.uuid, contract.uuid).subscribe((res) => {
  //     console.log("data",res)
  //     return this.rents = res;
  //   }, error => { });
  // }

  // getRentsByContract(contract: any) {
  //   this.rentService.getList(this.tenant.uuid, contract.uuid).subscribe((res) => {
  //     this.rents = res;
  //   }, error => { });
  // }
  selectedContractUuid: string | null = null;


  getRentsByContract(contract: any) {
    this.selectedContractUuid = contract.uuid; // Stocke l'UUID du contrat sélectionné
    this.rentService.getList(this.tenant.uuid, contract.uuid).subscribe((res) => {
      this.rents = res.filter(rent => rent.contract?.uuid === contract.uuid);
    }, error => { });
  }


  editTenant(row) {
    this.tenantService.setTenant(row);
    this.tenantService.edit = true;
    this.modal(TenantAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerTenant(row): void {
    this.tenantService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.tenantService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/locataire']) }
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
    }).result.then((result) => {

    }, (reason) => {

    });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }


  back() { this.router.navigate(['/admin/locataire']) }
}
