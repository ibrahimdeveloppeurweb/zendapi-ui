import { Lot } from '@model/lot';
import { Islet } from '@model/islet';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Subdivision } from '@model/subdivision';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LotService } from '@service/lot/lot.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { IsletService } from '@service/islet/islet.service';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { LotAddComponent } from '@lotissement/lot/lot-add/lot-add.component';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { LocalisationService } from '@service/localisation/localisation.service';
import { IsletAddComponent } from '@lotissement/islet/islet-add/islet-add.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { SubdivisionAddComponent } from '@lotissement/subdivision/subdivision-add/subdivision-add.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { AddComponent } from '@agence/localisation/add/add.component';

@Component({
  selector: 'app-subdivision-list',
  templateUrl: './subdivision-list.component.html',
  styleUrls: ['./subdivision-list.component.scss']
})
export class SubdivisionListComponent implements OnInit {
  mtnFiltre: Boolean = false;
  publicUrl = environment.publicUrl;
  userSession = Globals.user
  bien: boolean = false;
  subdivisions: Subdivision[] = []
  islets: Islet[] = []
  lots: Lot[] = []
  filter: any
  type: string = 'LOTISSEMENT'
  etatRow = [
    { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
    { label: 'DISPONIBLE', value: 'DISPONIBLE' }
  ]
  typeRow = [
    { label: 'LOTISSEMENT', value: 'LOTISSEMENT' },
    { label: 'ILOT', value: 'ILOT' },
    { label: 'LOT', value: 'LOT' }
  ]
  categorieRow = [
    { label: 'RURAL', value: 'RURAL' },
    { label: 'URBAIN', value: 'URBAIN' }
  ]
  nameTitle: string = "Projet de lotissement"
  userTitle: string = "Crée par"
  bienTitle: string = "Lotissement"
  minTitle: string = "Montant MIN"
  refTitle: string = "N° Référence"
  maxTitle: string = "Montant MAX"
  etatTitle: string = "Disponibilité ?"
  categorieTitle: string = "Type de lotissement"
  cookie: string = ''


  constructor(
    public router: Router,
    private modalService: NgbModal,
    private lotService: LotService,
    private emitter: EmitterService,
    public boarding: OnBoardingService,
    private isletService: IsletService,
    private filterService: FilterService,
    private cookieService: CookieService,
    private subdivisionService: SubdivisionService,
    private localisationService: LocalisationService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.subdivisionService.getList().subscribe(res => { return this.subdivisions = res; }, error => {});
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SUBDIVISION_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SUBDIVISION_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('lotissement');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-lotissement') {
    //   this.boarding.subdivision(etat);
    // }
    // this.boarding.subdivision(etat);
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  appendToList(item): void {
    this.subdivisions.unshift(item);
  }
  update(item): void {
    const index = this.subdivisions.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.subdivisions[index] = item;
    }
  }
  onFilter($event){
    this.filterService.type = this.type;
    this.filter = null
    this.subdivisions = []
    this.islets = []
    this.lots = []
    this.filterService.search($event, 'subdivision', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'LOTISSEMENT'){
          this.subdivisions = res;
          return this.subdivisions;
        } else if(this.type === 'ILOT'){
          this.islets = res;
          return this.islets;
        } else if(this.type === 'LOT'){
          this.lots = res;
          return this.lots;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'LOTISSEMENT'){
      this.mtnFiltre = true
      this.bien = false;
      this.refTitle = "N° Référence"
      this.nameTitle = 'Lotissement'
      this.etatTitle = "Disponibilité ?"
      this.categorieTitle = "Type de lotissement"
      this.etatRow = [
        { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { label: 'DISPONIBLE', value: 'DISPONIBLE' }
      ]
      this.categorieRow = [
        { label: 'RURAL', value: 'RURAL' },
        { label: 'URBAIN', value: 'URBAIN' }
      ]
      this.subdivisionService.getList().subscribe(res => { return this.subdivisions = res; }, error => {} );
    } else if($event === 'ILOT'){
      this.mtnFiltre = false
      this.bienTitle = 'N° Ilot';
      this.bien = true;
      this.refTitle = "N° Référence"
      this.nameTitle = 'Lotissement'
      this.etatTitle = "Disponibilité ?"
      this.etatRow = [
        { label: 'ESPACE DISPONIBLE', value: 'false' },
        { label: 'ESPACE VERT', value: 'true' }
      ]
      this.categorieRow = []
      this.isletService.getList().subscribe(res => { return this.islets = res; }, error => {} );
    } else if($event === 'LOT'){
      this.mtnFiltre = true
      this.bienTitle = 'N° Lot';
      this.bien = true;
      this.refTitle = "N° Référence"
      this.nameTitle = 'Lotissement'
      this.etatTitle = "Disponibilité ?"
      this.categorieTitle = "Type de lot"
      this.etatRow = [
        { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ]
      this.categorieRow = [
        { label: 'ESPACE DISPONIBLE', value: 'false' },
        { label: 'ESPACE VERT', value: 'true' }
      ]
      this.lotService.getList().subscribe(res => { return this.lots = res; }, error => {} );
    }
  }
  onPrinter() {
    if(this.type === 'LOTISSEMENT'){
      this.subdivisionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ILOT') {
      this.isletService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'LOT') {
      this.lotService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel(){
    if(this.type === 'LOTISSEMENT'){
      this.subdivisionService.getGenerer();
    } else if(this.type === 'ILOT') {
      this.isletService.getGenerer();
    } else if(this.type === 'LOT') {
      this.lotService.getGenerer();
    }
  }
  onExport() {
    if(this.type === 'LOTISSEMENT'){
      this.subdivisionService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'ILOT') {
      this.isletService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'LOT') {
      this.lotService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  map(item) {
    this.modalService.dismissAll()
    this.localisationService.edit = false
    this.localisationService.type = 'LOTISSEMENT';
    this.localisationService.setLocalisation(item)
    this.modal(AddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  addSubdivision(){
    this.modalService.dismissAll()
    this.subdivisionService.edit = false
    this.modal(SubdivisionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  editSubdivision(row) {
    this.subdivisionService.setSubdivision(row)
    this.subdivisionService.edit = true
    this.modal(SubdivisionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  showSubdivision(row) {
    this.subdivisionService.setSubdivision(row)
    this.router.navigate(['/admin/lotissement/show/' + row.uuid]);
  }

  printerSubdivision(row): void {
    this.subdivisionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  addIslet(){
    this.modalService.dismissAll()
    this.isletService.edit = false
    this.modal(IsletAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  addLot(){
    this.modalService.dismissAll()
    this.lotService.edit = false
    this.modal(LotAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
        this.subdivisionService.getDelete(item.uuid).subscribe(res => {
          if (res?.code === 200) {
            const index = this.subdivisions.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.subdivisions.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }

}
