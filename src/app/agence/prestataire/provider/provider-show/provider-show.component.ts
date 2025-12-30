import { ProviderAddComponent } from '@prestataire/provider/provider-add/provider-add.component';
import { Component, OnInit } from '@angular/core';
import { Provider } from '@model/provider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProviderService } from '@service/provider/provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { FilterService } from '@service/filter/filter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Quote } from '@model/quote';
import { QuoteService } from '@service/quote/quote.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { InvoiceCoAddComponent } from '@agence/chantier/invoice-co/invoice-co-add/invoice-co-add.component';
import { QuoteAddComponent } from '@agence/chantier/quote/quote-add/quote-add.component';
import { InvoicePaymentService } from '@service/invoice-payment/invoice-payment.service';
import { ProviderContractService } from '@service/provider-contract/provider-contract.service';
import { ProviderContractAddComponent } from '@agence/prestataire/provider-contract/provider-contract-add/provider-contract-add.component';


@Component({
  selector: 'app-provider-show',
  templateUrl: './provider-show.component.html',
  styleUrls: ['./provider-show.component.scss']
})
export class ProviderShowComponent implements OnInit {
  public activeTab: string = 'PRESTATAIRE';
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  provider: Provider;
  prestataire: boolean = false;
  quotes: Quote[];
  bons: Quote[];
  invoices: InvoiceCo[];
  payments: any[] = [];
  contrats: any[] = [];
  publicUrl = environment.publicUrl;
  type: string = 'PRESTATAIRE';
  nameTitle: string = ""
  etatRow = [];
  typeRow = [];
  categorieRow = [
    { label: 'PARTICULIER', value: 'PARTICULIER' },
    { label: 'ENTREPRISE', value: 'ENTREPRISE' }
  ];
  minTitle: string = "Montant MIN"
  userTitle: string = "Crée par"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de prestataire"
  etatTitle: string = ""
  modelRef: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private quoteService: QuoteService,
    private filterService: FilterService,
    private invoiceService: InvoiceCoService,
    private providerService: ProviderService,
    private permissionsService: NgxPermissionsService,
    private invoicePaymentService: InvoicePaymentService,
    private providerContractService: ProviderContractService,
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.onChangeLoad(this.type);
  }

  ngOnInit(): void {
  }

  onFilter($event) {
    $event.type = this.activeTab
    $event.provider = this.provider.id
    this.quotes = []
    if (this.activeTab == 'PAYMENT') {
      
    }else if(this.activeTab == 'CONTRAT'){
      this.filterService.search($event, 'provider', null).subscribe(
        res => {
          if (this.activeTab === 'CONTRAT') {
            return this.contrats = res;
          }
        }, err => { })
    }else{
      this.filterService.search($event, 'construction', null).subscribe(
        res => {
          if (this.activeTab === 'DEVIS') {
            return this.quotes = res;
          }if (this.activeTab === 'BON') {
            return this.bons = res;
          }if (this.activeTab === 'FACTURE') {
            return this.invoices = res;
          }
        }, err => { })
    }
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'PRESTATAIRE') {
      if (!this.provider) {
        this.providerService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.provider = res
        });
      }
    } else if (type === 'DEVIS') {
      this.typeRow = [
        { label: 'DEVIS', value: 'DEVIS' },
      ];
      this.quoteService.getList(this.provider.uuid, 'DEVIS').subscribe(
        (res) => {
          if (this.activeTab === 'DEVIS') {
            return this.quotes = res;
          }
        }, error => { }
      );
      this.nameTitle = 'Nom du chantier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
    } else if (type === 'BON') {
      this.typeRow = [
        { label: 'BON DE COMMANDE', value: 'BON' },
      ];
      this.quoteService.getList(this.provider.uuid, 'DEVIS', null, 1).subscribe((res) => {
        return this.bons = res;
      }, error => { }
      );
      this.nameTitle = 'Nom du chantier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
    } else if (type === 'FACTURE') {
      this.typeRow = [
        { label: 'FACTURE', value: 'FACTURE' },
      ];
      this.invoiceService.getList(this.provider.uuid, 'FACTURE').subscribe(
        (res) => {
          if (this.activeTab === 'FACTURE') {
            return this.invoices = res;
          }
        }, error => { }
      );
      this.nameTitle = 'Nom du chantier'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
    }else if (type === 'PAYMENT') {
      this.typeRow = [
        { label: 'PAIEMENT', value: 'PAYMENT' },
      ];
      this.invoicePaymentService.getList(null,this.provider.uuid).subscribe(
        (res) => {
          if (this.activeTab === 'PAYMENT') {
            return this.payments = res;
          }
        }, error => { }
      );
      this.nameTitle = 'Numero paiement'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
    }else if (type === 'CONTRAT') {
      this.typeRow = [
        { label: 'CONTRAT', value: 'CONTRAT' },
      ];
      this.providerContractService.getList(null,this.provider.uuid).subscribe(
        (res) => {
          if (this.activeTab === 'CONTRAT') {
            return this.contrats = res;
          }
        }, error => { }
      );
      this.nameTitle = 'Libellé'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
    }
  }
  addQuote() {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.quoteService.setProvider(this.provider);
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = "SYNDIC"
  }
  addBon() {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.quoteService.setProvider(this.provider);
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = "SYNDIC"
    this.modelRef.componentInstance.isBon = true
  }
  addInvoiceCo() {
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.invoiceService.setProvider(this.provider);
    this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addProviderContract() {
    this.modalService.dismissAll();
    this.providerContractService.edit = false;
    this.providerContractService.setProvider(this.provider);
    this.modal(ProviderContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editProvider(row) {
    this.providerService.setProvider(row);
    this.providerService.edit = true;
    this.modal(ProviderAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerProvider(row): void {
    this.providerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  modal(component, type, size, center, backdrop, inputs?) {
    this.modelRef = this.modalService.open(component, {
       ariaLabelledBy: type,
       size: size,
       centered: center,
       backdrop: backdrop
     })
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
        this.providerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/prestataire']) }
        });
      }
    });
  }
  back() { this.router.navigate(['/admin/prestataire']) }
  date(value) { return DateHelperService.readable(value); }
}
