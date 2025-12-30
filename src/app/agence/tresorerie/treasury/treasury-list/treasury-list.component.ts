import { Supply } from '@model/supply';
import { SupplyService } from '@service/supply/supply.service';
import { FilterService } from '@service/filter/filter.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Treasury } from '@model/treasury';
import { TreasuryService } from '@service/treasury/treasury.service';
import { TransactionService } from '@service/transaction/transaction.service';
import { TreasuryAddComponent } from '@agence/tresorerie/treasury/treasury-add/treasury-add.component';
import { Router } from '@angular/router';
import { SupplyAddComponent } from '@agence/tresorerie/supply/supply-add/supply-add.component';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { Transaction } from '@model/transaction';
import { PaymentService } from '@service/payment/payment.service';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { TreasuryAccountStatementComponent } from '../treasury-account-statement/treasury-account-statement.component';

@Component({
  selector: 'app-treasury-list',
  templateUrl: './treasury-list.component.html',
  styleUrls: ['./treasury-list.component.scss']
})
export class TreasuryListComponent implements OnInit {
  treasury: boolean = true;
  filter: any
  treasuries: Treasury[]
  supplies: Supply[]
  supplys: Supply[]
  transactions: Transaction[]
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  type: string = 'TRESORERIE'
  etatRow = []
  typeRow = [
    { label: "TRESORERIE", value: "TRESORERIE" },
    { label: "APPROVISIONNEMENT", value: "APPROVISIONNEMENT" },
    { label: "TRANSACTION", value: "TRANSACTION" }
  ]
  categorieRow = [
    { label: 'CAISSE', value: 'CAISSE' },
    { label: 'BANQUE', value: 'BANQUE' }
  ];
  nameTitle: string = "Nom / Raison sociale"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de tresorerie"
  etatTitle: string = "Disponibilité ?"
  cookie: string = ''


  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    public boarding: OnBoardingService,
    private filterService: FilterService,
    private supplyService: SupplyService,
    private cookieService: CookieService,
    public paymentService: PaymentService,
    private treasuryService: TreasuryService,
    public transactionService: TransactionService,
    private permissionsService: NgxPermissionsService,
    public paymentCustomerService: PaymentCustomerService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.treasuryService.getList().subscribe(res => { return this.treasuries = res; }, error => { });
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TREASURY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TREASURY_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('treasury');
    var etat = this.cookie ? true : false;
    // if (this.cookie !== 'on-boarding-treasury') {
    //   this.boarding.treasury(etat);
    // }
    // this.boarding.treasury(etat);
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.treasuries = []
    this.supplies = []
    this.transactions = []
    this.filterService.search($event, 'treasury', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if (this.type === 'TRESORERIE') {
          this.treasuries = res;
          return this.treasuries;
        } else if (this.type === 'APPROVISIONNEMENT') {
          this.supplies = res;
          return this.supplies;
        } else if (this.type === 'TRANSACTION') {
          this.transactions = res;
          return this.transactions;
        }
      }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if ($event === 'TRESORERIE') {
      this.nameTitle = 'Nom'
      this.categorieTitle = 'Type de tréksorerie'
      this.etatRow = [];
      this.categorieRow = [
        { label: 'CAISSE', value: 'CAISSE' },
        { label: 'BANQUE', value: 'BANQUE' }
      ];
      this.treasuryService.getList().subscribe(res => { return this.treasuries = res; }, error => { });
    } else if ($event === 'APPROVISIONNEMENT') {
      this.nameTitle = 'Trésorerie'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'INVALIDE', value: 'INVALIDE' }
      ]
      this.categorieRow = []
      this.supplyService.getList().subscribe(res => { return this.supplies = res; }, error => { });
    } else if ($event === 'TRANSACTION') {
      this.etatRow = [
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'INVALIDE', value: 'INVALIDE' }
      ]
      this.categorieRow = []
      this.transactionService.getList().subscribe(res => { this.transactions = res; }, error => { });
    }
  }
  onPrinter() {
    if (this.type === 'TRESORERIE') {
      this.treasuryService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'APPROVISIONNEMENT') {
      console.log(this.filter);
      
     // this.supplyService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    if (this.type === 'TRESORERIE') {
      this.treasuryService.getGenerer();
    } else if (this.type === 'APPROVISIONNEMENT') {
      this.supplyService.getGenerer();
    }
  }
  onExport() {
    if (this.type === 'TRESORERIE') {
      this.treasuryService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'APPROVISIONNEMENT') {
      this.supplyService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  appendToList(treasury): void {
    this.treasuries.unshift(treasury);
  }
  update(treasury): void {
    const index = this.treasuries.findIndex(x => x.uuid === treasury.uuid);
    if (index !== -1) {
      this.treasuries[index] = treasury;
    }
  }
  addTreasury() {
    this.modalService.dismissAll()
    this.treasuryService.edit = false
    this.modal(TreasuryAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  addSupply() {
    this.modalService.dismissAll()
    this.supplyService.edit = false
    this.modal(SupplyAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editTreasury(row) {
    this.treasuryService.setTreasury(row)
    this.treasuryService.edit = true
    this.modal(TreasuryAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showTreasury(row) {
    this.treasuryService.setTreasury(row)
    this.paymentService.treasury = row.uuid;
    this.paymentCustomerService.treasury = row.uuid;
    this.treasuryService.day = row?.days?.length > 0 ? true : false;
    this.router.navigate(['/admin/tresorerie/show/' + row.uuid])
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
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
        this.treasuryService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.treasuries.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.treasuries.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
          }
        });
      }
    });
  }

  getAccountStatement() {
    console.log("Relevé de compte")
    this.modal(TreasuryAccountStatementComponent, 'modal-basic-title', 'xl', true, 'static');
  }
}
