import { Home } from '@model/home';
import { Router } from '@angular/router';
import { Worksite } from '@model/worksite';
import { Building } from '@model/building';
import { HomeType } from '@model/home-type';
import { Promotion } from '@model/promotion';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { HomeService } from '@service/home/home.service';
import { FilterService } from '@service/filter/filter.service';
import { ReportService } from '@service/report/report.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { WorksiteService } from '@service/worksite/worksite.service';
import { BuildingService } from '@service/building/building.service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { HomeAddComponent } from '@promotion/home/home-add/home-add.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { ReportAddComponent } from '@agence/promotion/report/report-add/report-add.component';
import { HomeTypeAddComponent } from '@promotion/home-type/home-type-add/home-type-add.component';
import { PromotionAddComponent } from '@promotion/promotion/promotion-add/promotion-add.component';
import { WorksiteAddComponent } from '@agence/promotion/worksite/worksite-add/worksite-add.component';
import { BuildingAddComponent } from '@agence/promotion/building/building-add/building-add.component';
import { Report } from '@model/report';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {
  ilot: boolean = false;
  lot: boolean = false;
  mtnFiltre: Boolean = false;
  promotions: Promotion[] = []
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
  homes: Home[] = [];
  homeTypes: HomeType[] = [];
  worksites: Worksite[] = [];
  buildings: Building[] = [];
  reports: Report[] = [];
  filter: any;
  type: string = 'PROMOTION';
  etatRow = [
    { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
    { label: 'DISPONIBLE', value: 'DISPONIBLE' }
  ];
  typeRow = [
    { label: 'PROMOTION', value: 'PROMOTION' },
    { label: 'BÂTIMENT', value: 'BUILDING' },
    { label: 'MAISON', value: 'MAISON' },
    { label: 'TYPE DE MAISON', value: 'HOMETYPE' },
    { label: 'TYPE DE CHANTIER', value: 'TYPE_CHANTIER' },
    { label: 'RAPPORT', value: 'RAPPORT' }
  ];
  userTitle: string = "Crée par";
  nameTitle: string = "Promotion";
  ilotTitle: string = "N° Ilot";
  lotTitle: string = "N° Lot";
  minTitle: string = "Montant MIN";
  maxTitle: string = "Montant MAX";
  etatTitle: string = "Disponibilité ?";
  cookie: string = "";

  constructor (
    private router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private homeService: HomeService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private filterService: FilterService,
    private reportService: ReportService,
    private buildingService: BuildingService,
    private homeTypeService: HomeTypeService,
    private worksiteService: WorksiteService,
    private workSiteService: WorksiteService,
    private promotionService: PromotionService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.promotionService.getList().subscribe(res => { return this.promotions = res; }, error => {});
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROMOTION_ADD') { this.appendToList(data.payload); }
      if (data.action === 'PROMOTION_UPDATED') { this.update(data.payload); }
    });
  }

  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('promotion');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-promotion') {
    //   this.boarding.promotion(etat);
    // }
    // this.boarding.promotion(etat);
  }

  appendToList(item): void {
    this.promotions.unshift(item);
  }
  update(item): void {
    const index = this.promotions.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.promotions[index] = item;
    }
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  onFilter($event){
    this.filterService.type = this.type;
    this.filter = null;
    this.promotions = [];
    this.homes = [];
    this.homeTypes = [];
    this.worksites = [];
    this.filterService.search($event, 'promotion', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'PROMOTION'){
          this.promotions = res;
          return this.promotions;
        } else if(this.type === 'BUILDING'){
          this.buildings = res;
          return this.buildings;
        } else if(this.type === 'MAISON'){
          this.homes = res;
          return this.homes;
        } else if(this.type === 'HOMETYPE'){
          this.homeTypes = res;
          return this.homeTypes;
        } else if(this.type === 'TYPE_CHANTIER'){
          this.worksites = res;
          return this.worksites;
        } else if(this.type === 'RAPPORT'){
          this.reports = res;
          return this.reports;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'PROMOTION'){
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false
      this.nameTitle = 'Promotion'
      this.etatTitle = "Disponibilité ?"
      this.etatRow = [
        { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { label: 'DISPONIBLE', value: 'DISPONIBLE' }
      ]
      this.promotionService.getList().subscribe(res => { return this.promotions = res; }, error => {} );
    } else if($event === 'BUILDING'){
      this.mtnFiltre = true
      this.ilot = false;
      this.lot = true;
      this.lotTitle = "Promotion"
      this.nameTitle = "Bâtiment";
      this.etatTitle = null;
      this.etatRow = [];
      this.buildingService.getList(null).subscribe(res => { return this.buildings = res; }, error => {} );
    } else if($event === 'MAISON'){
      this.mtnFiltre = true
      this.ilot = true;
      this.lot = true;
      this.nameTitle = 'Promotion'
      this.etatTitle = "Disponibilité ?"
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ]
      this.homeService.getList().subscribe(res => { return this.homes = res; }, error => {} );
    } else if($event === 'HOMETYPE'){
      this.ilot = false;
      this.lot = true;
      this.mtnFiltre = false
      this.nameTitle = 'libellé'
      this.etatRow = []
      this.homeTypeService.getList().subscribe(res => { return this.homeTypes = res; }, error => {} );
    } else if($event === 'TYPE_CHANTIER'){
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false
      this.nameTitle = 'libellé'
      this.etatRow = []
      this.workSiteService.getList().subscribe(res => {
        return this.worksites = res; }, error => {} );
    } else if($event === 'RAPPORT'){
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false
      this.nameTitle = 'libellé'
      this.etatRow = []
      this.reportService.setEtat(false)
      this.reportService.getList().subscribe(res => {
        return this.reports = res; }, error => {} );
    }
  }
  onPrinter() {
    if(this.type === 'PROMOTION'){
      this.promotionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'BUILDING') {
      this.buildingService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'MAISON') {
      this.homeService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'HOMETYPE') {
      this.homeTypeService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'TYPE_CHANTIER') {
      this.workSiteService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RAPPORT') {
      this.reportService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel(){
    if(this.type === 'PROMOTION'){
      this.promotionService.getGenerer();
    } else if(this.type === 'BUILDING') {
      this.buildingService.getGenerer();
    } else if(this.type === 'MAISON') {
      this.homeService.getGenerer();
    } else if(this.type === 'HOMETYPE') {
      this.homeTypeService.getGenerer();
    } else if(this.type === 'TYPE_CHANTIER') {
      this.workSiteService.getGenerer();
    } else if(this.type === 'RAPPORT') {
      this.reportService.getGenerer();
    }
  }
  onExport() {
    if(this.type === 'PROMOTION'){
      this.promotionService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'MAISON') {
      this.homeService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'HOMETYPE') {
      this.homeTypeService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'TYPE_CHANTIER') {
      this.workSiteService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'RAPPORT') {
      this.reportService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  addPromotion(){
    this.modalService.dismissAll();
    this.promotionService.edit = false;
    this.modal(PromotionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editPromotion(row) {
    this.promotionService.setPromotion(row);
    this.promotionService.edit = true;
    this.modal(PromotionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPromotion(row) {
    this.promotionService.setPromotion(row);
    this.router.navigate(['/admin/promotion/show/' + row.uuid]);
  }
  printerPromotion(row): void {
    this.promotionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  genererOffre(row): void {
    const data = {
      uuid: row.uuid
    }
    this.promotionService.getGenererOffre(data).subscribe(res => {
    }, error => {
    })
  }
  addHome(){
    this.modalService.dismissAll();
    this.homeService.edit = false;
    this.modal(HomeAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addReport(){
    this.modalService.dismissAll();
    this.reportService.edit = false;
    this.modal(ReportAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addHomeType(){
    this.modalService.dismissAll();
    this.homeTypeService.edit = false;
    this.modal(HomeTypeAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  addWorksite(){
    this.modalService.dismissAll();
    this.worksiteService.edit = false;
    this.modal(WorksiteAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  addBuilding() {
    this.modalService.dismissAll();
    this.buildingService.edit = false;
    this.modal(BuildingAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
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
        this.promotionService.getDelete(item.uuid).subscribe(res => {
          if (res?.code === 200) {
            const index = this.promotions.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.promotions.splice(index, 1);
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

