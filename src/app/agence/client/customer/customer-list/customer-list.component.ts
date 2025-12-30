import { Mutate } from '@model/mutate';
import { Folder } from '@model/folder';
import { Router } from '@angular/router';
import { Customer } from '@model/customer';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceFolder } from '@model/invoice-folder';
import { NgxPermissionsService } from 'ngx-permissions';
import { FolderTerminate } from '@model/folder-terminate';
import { PaymentCustomer } from '@model/payment-customer';
import { FilterService } from '@service/filter/filter.service';
import { FolderService } from '@service/folder/folder.service';
import { MutateService } from '@service/mutate/mutate.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { CustomerService } from '@service/customer/customer.service';
import { CustomerAddComponent } from '../customer-add/customer-add.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { FolderAddComponent } from '@agence/client/folder/folder-add/folder-add.component';
import { MutateAddComponent } from '@agence/client/mutate/mutate-add/mutate-add.component';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { FolderTerminateService } from '@service/folder-terminate/folder-terminate.service';
import { PaymentCustomerAddComponent } from '@client/payment/payment-customer-add/payment-customer-add.component';
import { FolderTerminateAddComponent } from '@agence/client/folder-terminate/folder-terminate-add/folder-terminate-add.component';
import { CookieService } from 'ngx-cookie-service';
import { InvoiceFolderService } from '@service/invoice-folder/invoice-folder.service';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  filter: any;
  customers: Customer[];
  payments: PaymentCustomer[]
  folders: Folder[]
  invoices: InvoiceFolder[]
  mutates: Mutate[]
  visible: boolean = false;
  terminates: FolderTerminate[]
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  type: string = 'CLIENT'
  etatRow = [
    { label: 'ACTIF', value: 'ACTIF' },
    { label: 'INACTIF', value: 'INACTIF' }
  ]
  typeRow = [
    { label: 'CLIENT', value: 'CLIENT' },
    { label: 'DOSSIER', value: 'DOSSIER' },
    { label: 'FACTURE', value: 'FACTURE' },
    { label: 'PAIEMENT', value: 'PAIEMENT' },
    { label: 'MUTATION', value: 'MUTATION' },
    { label: 'RESILIATION', value: 'RESILIATION' }
  ]
  categorieRow = [
    {label: 'PARTICULIER', value: 'PARTICULIER'},
    {label: 'ENTREPRISE', value: 'ENTREPRISE'}
  ];

  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de locataire"
  etatTitle: string = "Disponibilité ?"
  cookie: string = ''
  
  nameTitle: string = "Nom / Raison sociale"
  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  autreTitle = "Promotion";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Promotion';
  autreNamespace= 'Client';
  autreGroups= 'promotion';

  bienTitle: string = "Projet de lotissement"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'Subdivision';
  bienNamespace= 'Client';
  bienGroups= 'subdivision';

  libelleTitle: string = "Commercial"
  libelle: boolean = true
  libelleType = 'ENTITY';
  libelleClass= 'User';
  libelleNamespace= 'Admin';
  libelleGroups= 'user';

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private folderService: FolderService,
    private mutateService: MutateService,
    private filterService: FilterService,
    private customerService: CustomerService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private terminateService: FolderTerminateService,
    private permissionsService: NgxPermissionsService,
    private invoiceFolderService: InvoiceFolderService,
    private paymentCustomerService: PaymentCustomerService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.customerService.getList().subscribe(res => { return this.customers = res; }, error => {});
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CUSTOMER_ADD') {
        this.appendCustomerToList(data.payload);
      }
      if (data.action === 'CUSTOMER_UPDATED') {
        this.updateCustomer(data.payload);
      }
    });
  }

  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('customer');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-customer') {
    //   this.boarding.customer(etat);
    // }
    // this.boarding.customer(etat);
  }

  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.customers = []
    this.folders = []
    this.mutates = []
    this.payments = []
    this.terminates = []
    this.invoices = []
    this.filterService.search($event, 'customer', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'CLIENT'){
          this.customers = res;
          return this.customers;
        } else if(this.type === 'DOSSIER'){
          this.folders = res;
          return this.folders;
        } else if(this.type === 'FACTURE'){
          this.invoices = res;
          return this.payments;
        }  else if(this.type === 'PAIEMENT'){
          this.payments = res;
          return this.payments;
        } else if(this.type === 'MUTATION'){
          this.mutates = res;
          return this.mutates;
        } else if(this.type === 'RESILIATION'){
          this.terminates = res;
          return this.terminates;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'CLIENT'){
      this.nameTitle = 'Nom / Raison sociale'
      this.categorieTitle = 'Type de locataire'
      this.etatRow = [];
      this.categorieRow = [
        {label: 'PARTICULIER', value: 'PARTICULIER'},
        {label: 'ENTREPRISE', value: 'ENTREPRISE'}
      ];
      this.visible = false;
      this.customerService.getList().subscribe(res => { return this.customers = res; }, error => {} );
    } else if($event === 'DOSSIER'){
      this.nameTitle = 'Client';
      this.categorieRow = [];
      this.etatTitle = 'Etat';
      this.etatRow = [
        {label: 'INVALIDE', value: 'INVALIDE'},
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'RESILIE', value: 'RESILIE'}
      ];
      this.visible = true;
      this.folderService.getList().subscribe(res => { return this.folders = res; }, error => {} );
    } else if($event === 'FACTURE'){
      this.nameTitle = 'Client';
      this.categorieTitle = 'Type';
      this.etatTitle = 'Etat';
      this.categorieRow = [
        {label: 'DOSSIER', value: 'DOSSIER'},
        {label: 'MUTATION', value: 'MUTATION'},
        {label: 'RESILIATION', value: 'RESILIATION'}
      ];
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ];
      this.visible = true;
      this.invoiceFolderService.getList().subscribe(res => { return this.invoices = res; }, error => {} );
    } else if($event === 'PAIEMENT'){
      this.nameTitle = 'Client';
      this.categorieTitle = 'Type';
      this.categorieRow = [
        {label: 'DEBIT', value: 'DEBIT'},
        {label: 'CREDIT', value: 'CREDIT'}
      ];
      this.etatTitle = 'Etat';
      this.etatRow = [
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.visible = false;
      this.paymentCustomerService.getList(null).subscribe(res => { return this.payments = res; }, error => {} );
    } else if($event === 'MUTATION'){
      this.nameTitle = 'N°dossier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
      this.visible = true;
      this.mutateService.getList().subscribe(res => { return this.mutates = res; }, error => {} );
    } else if($event === 'RESILIATION'){
      this.nameTitle = 'N°dossier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
      this.visible = true;
      this.terminateService.getList().subscribe(res => { return this.terminates = res; }, error => {} );
    }
  }
  onPrinter() {
    if(this.type === 'CLIENT'){
      this.customerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DOSSIER') {
      this.folderService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.paymentCustomerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'MUTATION') {
      this.mutateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RESILIATION') {
      this.terminateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel(){
    if(this.type === 'CLIENT'){
      this.customerService.getGenerer();
    }else if(this.type === 'PAIEMENT') {
      this.paymentCustomerService.getGenerer();
    }
  }
  onExport() {
    if(this.type === 'CLIENT'){
      this.customerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'DOSSIER') {
      this.folderService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PAIEMENT') {
      this.paymentCustomerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'MUTATION') {
      this.mutateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RESILIATION') {
      this.terminateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport(){
    var type = this.type === 'PAIEMENT' ? 'PAIEMENT_CUSTOMER' : this.type
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = type;
  }
  addCustomer(type){
    this.modalService.dismissAll()
    this.customerService.edit = false
    this.customerService.type = type
    this.modal(CustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  editCustomer(row) {
    this.customerService.setCustomer(row)
    this.customerService.edit = true
    this.customerService.type = row.type
    this.modal(CustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showCustomer(row) {
    this.customerService.setCustomer(row)
    this.router.navigate(['/admin/client/show/'+row.uuid])
  }
  printerCustomer(row): void {
    this.customerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  addFolder(){
    this.modalService.dismissAll()
    this.folderService.edit = false
    this.modal(FolderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addMutate(){
    this.modalService.dismissAll()
    this.mutateService.edit = false
    this.modal(MutateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addTerminate(){
    this.modalService.dismissAll()
    this.mutateService.edit = false
    this.modal(FolderTerminateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addPayment(){
    this.modalService.dismissAll();
    this.paymentCustomerService.edit = false;
    this.paymentCustomerService.treasury = null;
    this.modal(PaymentCustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  appendCustomerToList(customer) {
    this.customers.unshift(customer);
  }
  updateCustomer(customer) {
    const index = this.customers.findIndex(x => x.uuid === customer.uuid);
    if (index !== -1) {
      this.customers[index] = customer;
    }
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
        this.customerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.customers.findIndex(x => x.id === item.id);
            if (index !== -1) { this.customers.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }
}
