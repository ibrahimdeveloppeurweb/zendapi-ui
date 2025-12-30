import { Owner } from '@model/owner';
import { House } from '@model/house';
import { Rental } from '@model/rental';
import { Router } from '@angular/router';
import { Mandate } from '@model/mandate';
import { Repayment } from '@model/repayment';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenewMandate } from '@model/renew-mandate';
import { NgxPermissionsService } from 'ngx-permissions';
import { OwnerService } from '@service/owner/owner.service';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { OwnerAddComponent } from '@proprietaire/owner/owner-add/owner-add.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { CookieService } from 'ngx-cookie-service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { Terminate } from '@model/terminate';
import { HomeCoService } from '@service/syndic/home-co.service';
import { CondominiumAddComponent } from '@agence/proprietaire/condominium/condominium-add/condominium-add.component';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { InfrastructureShowComponent } from '@agence/syndic/infrastructure/infrastructure-show/infrastructure-show.component';
import { InfrastructureAddComponent } from '@agence/syndic/infrastructure/infrastructure-add/infrastructure-add.component';
import { SyndicService } from '@service/syndic/syndic.service';
import { HouseCo } from '@model/syndic/house-co';
import { HouseCoService } from '@service/syndic/house-co.service';

@Component({
  selector: 'app-owner-co-list',
  templateUrl: './owner-co-list.component.html',
  styleUrls: ['./owner-co-list.component.scss']
})
export class OwnerCoListComponent implements OnInit {
  proprietaire: boolean = true;
  bien: boolean = false;
  min: boolean = false;
  max: boolean = false;
  name: boolean = true
  filter: any;
  etat: boolean = true
  owners: HouseCo[];
  houses: House[];
  rentals: Rental[];
  mandates: Mandate[];
  renews: RenewMandate[];
  terminates: Terminate[] = [];
  repayments: Repayment[];
  coproprietes: any[];
  infrastructures: any[];
  homeCo: any[];
  visible: boolean = false;
  userSession = Globals.user
  publicUrl = environment.publicUrl;
  type: string = 'PROPRIETAIRE';
  etatRow = [];
  typeRow = [
    { label: 'COPROPRIETAIRE', value: 'PROPRIETAIRE' },
    { label: 'LOT', value: 'LOT' },
    { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
  ];
  categorieRow = [
    { label: 'PARTICULIER', value: 'PARTICULIER' },
    { label: 'ENTREPRISE', value: 'ENTREPRISE' }
  ];
  nameTitle: string = "Nom / Raison sociale"
  userTitle: string = "Crée par"
  bienTitle: string = "Propriétaire"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de propriétaire"
  etatTitle: string = "Syndic"
  cookie: string = ''
  categorie: boolean = true
  autorisation: any = Globals.autorisation;
  dtOptions = {}
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private ownerService: HouseCoService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private filterService: FilterService,
    private copoprieteService: CoproprieteService,
    private homeService: HomeCoService,
    private syndicService: SyndicService,
    private infrastructureService: InfrastructureService,
    private permissionsService: NgxPermissionsService
  ) {
    if(this.ownerService.return === "PROPRIETAIRE"){
      this.onChangeLoad('LOT')
      this.ownerService.return = null
    }else {
      this.ownerService.getList(null).subscribe(res => { return this.owners = res; }, error => { });
      this.getSyndic()
      const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
      this.permissionsService.loadPermissions(permission);
    }
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
    this.emitter.event.subscribe((data) => {
      if (data.action === 'OWNER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'OWNER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  ngAfterViewInit(): void {
    // this.cookie = this.cookieService.get('owner');
    // var etat = this.cookie ? true : false;
    // if (this.cookie !== 'on-boarding-owner') {
    //   this.boarding.owner(etat);
    // }
    // this.boarding.owner(etat);
  }

  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.owners = []
    this.coproprietes = []
    this.infrastructures = []
    this.filterService.search($event, 'trustee', null).subscribe(
      res => {
        this.filter = this.filterService.filter

        if (this.type === 'PROPRIETAIRE') {
          return this.owners = res;
        }else if (this.type === 'LOT') {
          return this.coproprietes = res;
        }else if (this.type === 'INFRASTRUCTURE') {
          return this.infrastructures = res;
        }
      }, err => { })
  }

  onChangeLoad($event) {
    this.type = $event
    this.getSyndic()
    if ($event === 'PROPRIETAIRE') {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.categorie = true
      this.name = true
      this.nameTitle = "Nom / Raison sociale"
      this.categorieTitle = 'Type de propriétaire'
      this.etat = false
      this.categorieRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' }
      ];
      this.typeRow = [
        { label: 'COPROPRIETAIRE', value: 'PROPRIETAIRE' },
        { label: 'LOT', value: 'LOT' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.visible = false;
      this.ownerService.getList(null).subscribe(res => { return this.owners = res; }, error => { });
    }else if($event === 'LOT'){
      this.bien = true;
      this.min = false;
      this.max = false;
      this.name = false
      this.bienTitle = 'Nom du lot';
      this.categorieTitle = 'Type de lot'
      this.categorie = true
      this.etat = true
      this.typeRow = [
        { label: 'LOT', value: 'LOT' },
        { label: 'COPROPRIETAIRE', value: 'PROPRIETAIRE' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.categorieRow = [
        { label: 'VERTICAL', value: 'VERTICAL' },
        { label: 'HORIZONTAL', value: 'HORIZONTAL' }
      ];
      this.homeService.getList(null, null, null, null).subscribe((res: any) => {
        return this.coproprietes = res
      })
    }else if($event === 'INFRASTRUCTURE'){
      this.bien = true;
      this.min = false;
      this.max = false;
      this.name = false
      this.bienTitle = 'Nom du lot';
      this.categorieTitle = 'Type d\'infrastructure'
      this.categorie = true
      this.etat = true
      this.categorieRow = [
        {label: 'Ascenseur', value: 'ASCENSEUR'},
        {label: 'Partie commune', value: 'PARTIE COMMUNE'},
        {label: 'Parking', value: 'PARKING'},
        {label: 'Jardin', value: 'JARDIN'},
        {label: 'Piscine', value: 'PISCINE'},
        {label: 'Aire de jeux', value: 'AIRE DE JEUX'}
      ];
      this.typeRow = [
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
        { label: 'COPROPRIETAIRE', value: 'PROPRIETAIRE' },
        { label: 'LOT', value: 'LOT' },
      ];
      this.infrastructureService.getList(null, null, null).subscribe(res => {
        return this.infrastructures = res
      }, error => {})
    }
  }
  onPrinter() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null);
    }
    else if (this.type === 'LOT') {
      let category = this.filter.categorie;
      if (category === 'HORIZONTAL' || category === null) {
        this.homeService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null, null);
      }
      else if (category === 'VERTICAL') {
        this.copoprieteService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null, null);
      }
    }
    else if (this.type === 'INFRASTRUCTURE') {
      this.infrastructureService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getGenerer();
    }
  }
  onExport() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  appendToList(owner): void {
    this.owners.unshift(owner);
  }
  update(owner): void {
    const index = this.owners.findIndex(x => x.uuid === owner.uuid);
    if (index !== -1) {
      this.owners[index] = owner;
    }
  }
  addOwner(type) {
    this.modalService.dismissAll();
    this.ownerService.edit = false;
    this.ownerService.type = type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  editOwner(row) {
    this.ownerService.setHouseCo(row);
    this.ownerService.edit = true;
    this.ownerService.type = row.type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  showOwner(row) {
    this.ownerService.setHouseCo(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }

  addCopropriete(){
    this.modalService.dismissAll()
    this.copoprieteService.edit = false
    this.modal(CondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static',)
  }

  printerOwner(row, type?): void {
    this.ownerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid, type);
  }

  getSyndic(){
    this.syndicService.getList().subscribe((res: any) => {
      this.etatRow = []
      res.forEach(element => {
        this.etatRow.push({
          label: element?.nom , value: element?.uuid
        }
      )
      return this.etatRow
      });
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
        this.ownerService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.owners.findIndex(x => x.id === item.id);
            if (index !== -1) { this.owners.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  showInfrastructure(item){
    this.infrastructureService.setInfrastructure(item)
    this.modal(InfrastructureShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  editInfrastructure(item){
    this.infrastructureService.setInfrastructure(item)
    this.infrastructureService.edit = true
    this.modal(InfrastructureAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printInfrastructure(item){
    this.infrastructureService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, item?.trustee?.uuid, item.uuid);
  }

  deleteInfrastructure(item){
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
        this.infrastructureService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.infrastructures.findIndex(x => x.id === item.id);
            if (index !== -1) { this.infrastructures.splice(index, 1); }
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
      backdrop: backdrop,
    }).result.then((result) => {
      if(result == 'OWNER'){
        this.ownerService.getList(null).subscribe((res: any) => {
          return this.owners = res
        })
      }else if(result == 'COPROPRIETE'){
        this.copoprieteService.getList(null, null).subscribe((res: any) => {
          return this.coproprietes = res
        })
      }else if(result == 'INFRASTRUCTURE'){
        this.infrastructureService.getList().subscribe((res: any) => {
          return this.infrastructures = res
        })
      }
    }, (reason) => { });
  }
}
