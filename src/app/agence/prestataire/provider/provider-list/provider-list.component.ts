import { ProviderAddComponent } from '@prestataire/provider/provider-add/provider-add.component';
import { ProductAddComponent } from '@prestataire/product/product-add/product-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProviderService } from '@service/provider/provider.service';
import { ProductService } from '@service/product/product.service';
import { Provider } from '@model/provider';
import { Product } from '@model/product';
import { FilterService } from '@service/filter/filter.service';
import { Component, OnInit } from '@angular/core';
import {EmitterService} from '@service/emitter/emitter.service';
import { FamilyService } from '@service/family/family.service';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';
import { SubFamilyAddComponent } from '@agence/prestataire/subFamily/sub-family-add/sub-family-add.component';
import { SubFamily } from '@model/sub-family';
import { ProviderContractService } from '@service/provider-contract/provider-contract.service';
import { ProviderContractAddComponent } from '@agence/prestataire/provider-contract/provider-contract-add/provider-contract-add.component';
import { ProviderContract } from '@model/prestataire/provider-contract';
import { Family } from '@model/Family';


@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit {
  filter: any
  providers: Provider[] = []
  products: Product[] = []
  providerContracts: ProviderContract[] = []
  familys: Family[] = []
  subFamilys: SubFamily[] = []
  type: string = 'PRESTATAIRE'
  categorie: boolean = true
  userSession = Globals.user
  typeRow = [
    { label: 'PRESTATAIRE', value: 'PRESTATAIRE' },
    { label: 'CONTRAT', value: 'CONTRAT' },
    { label: 'FAMILLE', value: 'FAMILY' },
    { label: 'SOUS-FAMILLE', value: 'SUBFAMILY' },
    { label: 'RESSOURCE', value: 'PRODUIT' }
  ]
  categorieRow = [
    {label: 'PARTICULIER', value: 'PARTICULIER'},
    {label: 'ENTREPRISE', value: 'ENTREPRISE'}
  ];
  etatRow = [];
  nameTitle: string = "Nom prénoms / Raison sociale"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de prestataire"
  etatTitle: string = "Disponibilité ?"

  cookie: string = ''

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private filterService: FilterService,
    private productService: ProductService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private familyService: FamilyService,
    private subFamilyService: SubFamilyService,
    private providerService: ProviderService,
    private permissionsService: NgxPermissionsService,
    private providerContractService: ProviderContractService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.providerService.getList(null).subscribe(res => {
      return this.providers = res;
      }, error => {}
    );
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROVIDER_ADD' || data.action === 'FAMILY_ADD' || data.action === 'SUBFAMILY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PROVIDER_UPDATED'|| data.action === 'FAMILY_UPDATED' || data.action === 'SUBFAMILY_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('provider');
    var etat = this.cookie ? true : false;
    if(this.cookie !== 'on-boarding-provider') {
      this.boarding.provider(etat);
    }
    this.boarding.provider(etat);
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.providers = []
    this.products = []
    this.filterService.search($event, 'provider', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'PRESTATAIRE'){
          this.providers = res;
          return this.providers;
        }
        if(this.type === 'PRODUIT'){
          this.products = res;
          return this.products;
        }
        if(this.type === 'FAMILY'){
          this.familys = res;
          return this.familys;
        }
        if(this.type === 'SUBFAMILY'){
          this.subFamilys = res;
          return this.subFamilys;
        }if(this.type === 'CONTRAT'){
          this.providerContracts = res;
          return this.providerContracts;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'PRESTATAIRE'){
      this.nameTitle = 'Nom prénoms / Raison sociale'
      this.categorieTitle = 'Type de prestataire'
      this.etatRow = [];
      this.categorieRow = [
        {label: 'PARTICULIER', value: 'PARTICULIER'},
        {label: 'ENTREPRISE', value: 'ENTREPRISE'}
      ];
      this.providerService.getList(null).subscribe(res => { return this.providers = res; }, error => {} );
    } else if($event === 'PRODUIT'){
      this.nameTitle = "Libellé"
      this.categorieTitle = 'Type de prestataire'
      this.etatRow = [];
      this.categorieRow = [];
      this.productService.getList().subscribe(res => { return this.products = res; }, error => {} );
    } else if($event === 'FAMILY'){
      this.nameTitle = "Libellé"
      this.categorie = false
      this.etatRow = [];
      this.familyService.getList().subscribe(res => { return this.familys = res; }, error => {} );
    } else if($event === 'SUBFAMILY'){
      this.nameTitle = "Libellé"
      this.categorie = false
      this.etatRow = [];
      this.subFamilyService.getList().subscribe(res => { return this.subFamilys = res; }, error => {} );
    }else if($event === 'CONTRAT'){
      this.nameTitle = "Libellé"
      this.categorie = false
      this.etatRow = [];
      this.providerContractService.getList().subscribe(res => { return this.providerContracts = res; }, error => {} );
    }
  }
  onPrinter() {
    if(this.type === 'PRESTATAIRE'){
      this.providerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PRODUIT') {
      this.productService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel(){
    if(this.type === 'PRESTATAIRE'){
      this.providerService.getGenerer();
    } else if(this.type === 'PRODUIT') {
      this.productService.getGenerer();
    }
  }
  onExport() {
    if(this.type === 'PRESTATAIRE'){
      this.providerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'PRODUIT') {
      this.productService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  appendToList(provider): void {
    this.providers.unshift(provider);
  }
  update(provider): void {
    const index = this.providers.findIndex(x => x.uuid === provider.uuid);
    if (index !== -1) {
      this.providers[index] = provider;
    }
  }
  addProvider() {
    this.modalService.dismissAll()
    this.providerService.edit = false
    this.modal(ProviderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addProviderContract() {
    this.modalService.dismissAll()
    this.providerContractService.edit = false
    this.modal(ProviderContractAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addFamily() {
    this.modalService.dismissAll()
    this.familyService.edit = false
    this.modal(FamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  addSubfamily() {
    this.modalService.dismissAll()
    this.subFamilyService.edit = false
    this.modal(SubFamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  addProduct(){
    this.modalService.dismissAll()
    this.productService.edit = false
    this.modal(ProductAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  editProvider(row) {
    this.providerService.setProvider(row)
    this.providerService.edit = true
    this.modal(ProviderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showProvider(row) {
    this.providerService.setProvider(row)
    this.router.navigate(['/admin/prestataire/show/' + row.uuid]);
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
        this.providerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.providers.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.providers.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
          }
        });
      }
    });
  }

}
