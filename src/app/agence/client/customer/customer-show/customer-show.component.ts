import { Folder } from '@model/folder';
import { Mutate } from '@model/mutate';
import { Router } from '@angular/router';
import { Customer } from '@model/customer';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FolderTerminate } from '@model/folder-terminate';
import { PaymentCustomer } from '@model/payment-customer';
import { FilterService } from '@service/filter/filter.service';
import { FolderService } from '@service/folder/folder.service';
import { MutateService } from '@service/mutate/mutate.service';
import { CustomerService } from '@service/customer/customer.service';
import { CustomerAddComponent } from '@client/customer/customer-add/customer-add.component';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { FolderTerminateService } from '@service/folder-terminate/folder-terminate.service';
import { InvoiceFolder } from '@model/invoice-folder';
import { InvoiceFolderService } from '@service/invoice-folder/invoice-folder.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { UploaderService } from '@service/uploader/uploader.service';
import { ActivityService } from '@service/activity/activity.service';
import { RendService } from '@service/rdv/rend.service';
import { TicketService } from '@service/ticket/ticket.service';

@Component({
  selector: 'app-customer-show',
  templateUrl: './customer-show.component.html',
  styleUrls: ['./customer-show.component.scss']
})
export class CustomerShowComponent implements OnInit {
  publicLink = environment.publicUrl;
  public activeTab: string = 'CLIENT';
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  filter: any;
  customer: Customer;
  client: boolean = false;
  name: boolean = false;
  folders: Folder[] =[];
  invoices: InvoiceFolder[] =[];
  terminates: FolderTerminate[] =[];
  mutates: Mutate[] =[];
  payments: PaymentCustomer[] = [];
  type: string = 'CLIENT';
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
  nameTitle: string = "Client"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de bien"
  etatTitle: string = "Disponibilité ?"
  file: any;
  rdvs = []
  notes = []
  tickets: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private folderService: FolderService,
    private mutateService: MutateService,
    private filterService: FilterService,
    private customerService: CustomerService,
    private invoiceService: InvoiceFolderService,
    private terminateService: FolderTerminateService,
    private permissionsService: NgxPermissionsService,
    private paymentCustomerService: PaymentCustomerService,
    private uploader: UploaderService,
    private activityService: ActivityService,
    private rdvService: RendService,
    public ticketService: TicketService
  ) {
    this.customer = this.customerService.getCustomer();
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.onChangeLoad(this.type);
  }

  ngOnInit(): void {
  }

  onFilter($event) {
    this.folders = []
    this.payments = []
    this.mutates = []
    this.terminates = []
    this.invoices = []
    $event.type = this.activeTab
    this.filterService.search($event, 'customer', this.customer.uuid).subscribe(
      res => {
      if(this.activeTab === 'CLIENT'){
        return this.customer = res;
      } else if(this.activeTab === 'DOSSIER'){
        return this.folders = res;
      } else if(this.activeTab === 'PAIEMENT'){
        return this.payments = res;
      } else if(this.activeTab === 'FACTURE'){
        return this.invoices = res;
      } else if(this.activeTab === 'MUTATION'){
        return this.mutates = res;
      } else if(this.activeTab === 'RESILIATION'){
        return this.terminates = res;
      }
    }, err => { })
  }

  onChangeLoad(type): void {
    this.activeTab = type;
    if(type === 'CLIENT'){
      if(!this.customer){
        this.customerService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          if (res) { return this.customer = res; }
        });
      }
    } else if(type === 'DOSSIER'){
      this.typeRow = [{label: 'DOSSIER', value: 'DOSSIER'}];
      this.folderService.getList(this.customer.uuid, null).subscribe((res) => {
        return this.folders = res;
        }, error => {}
      );
      // this.nameTitle = "Client"
      this.name= false
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = []
    } else if(type === 'FACTURE'){
      this.typeRow = [{label: 'FACTURE', value: 'FACTURE'}];
      this.invoiceService.getList(null, null, null, this.customer.uuid).subscribe((res) => {
        return this.invoices = res;
        }, error => {}
      );
      this.name= false
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'IMPAYE', value: 'IMPAYE'},
        {label: 'ATTENTE', value: 'ATTENTE'},
        {label: 'EN COURS', value: 'EN COURS'},
        {label: 'SOLDE', value: 'SOLDE'}
      ]
      this.categorieTitle = 'Type'
      this.categorieRow = []
    } else if(type === 'PAIEMENT') {
      this.name= true
      this.typeRow = [{label: 'PAIEMENT', value: 'PAIEMENT'}];
      this.paymentCustomerService.getList(this.customer.uuid).subscribe((res) => {
        return this.payments = res;
        }, error => {}
      );
      this.etatTitle = 'Etat'
      this.nameTitle = 'N°dossier'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ]
      this.categorieTitle = 'Type facture'
      this.categorieRow = []
    } else if(type === 'MUTATION'){
      this.name= true
      this.typeRow = [{label: 'MUTATION', value: 'MUTATION'}];
      this.mutateService.getList(this.customer.uuid).subscribe((res) => {
        return this.mutates = res;
        }, error => {}
      );
      this.nameTitle = 'N°dossier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
    } else if(type === 'RESILIATION') {
      this.name= true
      this.typeRow = [{label: 'RESILIATION', value: 'RESILIATION'}];
      this.terminateService.getList(this.customer.uuid, null).subscribe((res) => {
        return this.terminates = res;
        }, error => {}
      );
      this.nameTitle = 'N°dossier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        {label: 'VALIDE', value: 'VALIDE'},
        {label: 'INVALIDE', value: 'INVALIDE'}
      ];
      this.categorieRow = [];
    } else if (type === 'NOTE_INTERNE'){
      this.activityService.getList(null, null, null, this.customer.uuid).subscribe((res: any) => {
        return this.notes = res
      })
      this.rdvService.getList(null, null, null, this.customer.uuid).subscribe((res: any) => {
        return this.rdvs = res
      })
    }else if (type === 'TICKET'){
      this.ticketService.getList(null,null,null,null,null,this.customer.uuid,null).subscribe(res => {
        return this.tickets = res; 
    }, error => { });
    }
  }
  editCustomer(row) {
    this.customerService.setCustomer(row)
    this.customerService.edit = true
    this.customerService.type = row.type
    this.modal(CustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerCustomer(row): void {
    this.customerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
      if (willDelete.dismiss) { } else {
        this.customerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.router.navigate(['/admin/client'])
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
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
  backCustomer(){ this.router.navigate(['/admin/client']) }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}
