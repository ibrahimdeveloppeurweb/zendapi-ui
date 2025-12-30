import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { Promotion } from '@model/promotion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionService } from '@service/promotion/promotion.service';
import { PromotionAddComponent } from '../promotion-add/promotion-add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '@service/filter/filter.service';
import { HomeService } from '@service/home/home.service';
import { environment } from '@env/environment';
import { Home } from '@model/home';
import { UploaderService } from '@service/uploader/uploader.service';
import { TaskAddComponent } from '@agence/promotion/taks/task-add/task-add.component';
import { Worksite } from '@model/worksite';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Tasks } from '@model/tasks';
import { FormField } from '@theme/shared/components/search/search.component';
import { Building } from '@model/building';
import { BuildingService } from '@service/building/building.service';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-promotion-show',
  templateUrl: './promotion-show.component.html',
  styleUrls: ['./promotion-show.component.scss']
})
export class PromotionShowComponent implements OnInit {
  public activeTab: string = 'PROMOTION';
  ilot: boolean = false;
  lot: boolean = false;
  mtnFiltre: Boolean = false;
  showTask: Boolean = false;
  promotionUuid: string = ''
  sousPromotions: Promotion[] = [];
  promotionLibelle: string = ''
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  promotion: Promotion
  homes: Home[]
  buildings: Building[]
  tasks: Tasks[]
  worksites: Worksite[]

  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  icon = { url: 'assets/images/map-geo.png', scaledSize: {height: 40, width: 40}}

  type: string = 'PROMOTION';
  etatRow = [
    {label: 'DISPONIBLE', value: 'DISPONIBLE'},
    {label: 'INDISPONIBLE', value: 'INDISPONIBLE'}
  ];
  typeRow = [
    {label: 'PROMOTION', value: 'PROMOTION'},
    {label: 'MAISON', value: 'MAISON'}
  ];
  categorieRow = [
    {label: 'RURAL', value: 'RURAL'},
    {label: 'URBAIN', value: 'URBAIN'}
  ];
  sousProjetRow = [];
  nameTitle: string = "Nom du PROMOTION"
  userTitle: string = "Crée par"
  ilotTitle: string = "N° Ilot"
  lotTitle: string = "N° Lot"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de PROMOTION"
  etatTitle: string = "Disponibilité ?"
  file: any;

  countRow = [
    { key: "0", value: "Tout" },
    { key: "1", value: "1" },
    { key: "5", value: "5" },
    { key: "10", value: "10" },
    { key: "25", value: "25" },
    { key: "50", value: "50" },
    { key: "100", value: "100" },
    { key: "200", value: "200" }
  ];

  inputs: FormField<string>[] = [
    new FormField<string>({
      controlType: "textbox",
      key: 'code',
      type: 'text',
      label: 'N° Référence',
      groups: ['ALL'],
      top: true
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "promotionId",
      label: "Sous promotion",
      top: true,
      options:this.sousProjetRow,
      groups: ["MAISON", "BUILDING"],
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'autre',
      type: 'text',
      label: 'N° Lot',
      groups: ['MAISON'],
      top: true
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'bien',
      type: 'text',
      label: 'N° Ilot',
      groups: ['MAISON'],
      top: true
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "etat",
      label: "Disponibilité ?",
      top: false,
      options:[
        { key: 'DISPONIBLE', value: 'DISPONIBLE' },
        { key: 'INDISPONIBLE', value: 'INDISPONIBLE' }
      ],
      groups: ["SOUS_PROMOTION"],
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "etat",
      label: "Etat",
      top: true,
      options:[
        { key: 'DISPONIBLE', value: 'DISPONIBLE' },
        { key: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { key: 'VENDU', value: 'VENDU' }
      ],
      groups: ["MAISON"],
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateD',
      type: 'date',
      label: 'Date de début',
      groups: ['SOUS_PROMOTION', 'BUILDING'],
      top: true,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateF',
      type: 'date',
      label: 'Date de fin',
      groups: ['SOUS_PROMOTION', 'BUILDING'],
      top: true,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateD',
      type: 'date',
      label: 'Date de début',
      groups: ['MAISON'],
      top: true,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'dateF',
      type: 'date',
      label: 'Date de fin',
      groups: ['MAISON'],
      top: true,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'min',
      type: 'number',
      label: 'Montant Min',
      groups: ['MAISON', 'BUILDING'],
      top: false,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'max',
      type: 'number',
      label: 'Montant Max',
      groups: ['MAISON', 'BUILDING'],
      top: false,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'user',
      type: 'text',
      label: 'Créé par',
      groups: ['ALL'],
      top: false,
    }),
    new FormField<string>({
      controlType: "textbox",
      key: 'create',
      type: 'date',
      label: 'Date de création',
      groups: ['ALL'],
      top: false,
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: "ordre",
      label: "Ordre",
      top: false,
      options:[
        { key: 'DESC', value: 'Décroissant' },
        { key: 'ASC', value: 'Croissant' }
      ],
      groups: ["ALL"],
    }),
    new FormField<string>({
      controlType: "dropdown",
      key: 'count',
      label: 'Nombre',
      options: this.countRow,
      groups: ['ALL'],
      top: false,
    }),
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private emitter: EmitterService,
    private modalService: NgbModal,
    private homeService: HomeService,
    private uploader: UploaderService,
    private filterService: FilterService,
    private buildingsService: BuildingService,
    private promotionService: PromotionService,

  ) {
    this.onChangeLoad(this.type);
    this.promotionService.getList(this.route.snapshot.params.id).subscribe((res) => {
      this.sousPromotions = res;

      for (let index = 0; index < this.sousPromotions.length; index++) {
        const element = this.sousPromotions[index];
        this.sousProjetRow.push( { key: element.id, value: element.libelle })
      }
      }, error => {}
    );
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'REPORT_ADD') { this.onChangeLoad('TRAVAUX'); }
      if (data.action === 'REPORT_UPDATED') { this.onChangeLoad('TRAVAUX'); }
    });
  }

  onFilter($event) {
    this.homes = []
    $event.type = this.activeTab
    this.filterService.search($event, 'promotion', this.promotion.uuid).subscribe(
      res => {
      if(this.activeTab === 'MAISON'){
        return this.homes = res;
      }
      if(this.activeTab === 'BUILDING'){
        return this.buildings = res;
      }
      if(this.activeTab === 'SOUS_PROMOTION'){
        return this.sousPromotions = res;
      }
    }, err => { })
  }
  addTask() {
    this.promotionService.setPromotion(this.promotion)
    this.showTask = true
    this.modalService.dismissAll();
    this.modal(TaskAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if(type === 'PROMOTION'){
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false
      if(!this.promotion){
        this.promotionService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.promotion = res;
        });
      }
    }
    if(type === 'MAISON') {
      this.typeRow = [{label: 'MAISON', value: 'MAISON'}];
      this.mtnFiltre = true
      this.ilot = true;
      this.lot = true;
      this.categorieRow = []
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ]
      this.homeService.getList(this.promotion.uuid).subscribe((res) => {
        return this.homes = res;
        }, error => {}
      );
    }
    if(type === 'BUILDING') {
      this.typeRow = [{label: 'BATIMENT', value: 'BUILDING'}];
      this.buildingsService.getList(this.promotion.uuid).subscribe((res) => {
        return this.buildings = res;
        }, error => {}
      );
    }
    if(type === 'TRAVAUX') {
      this.typeRow = [{label: 'MAISON', value: 'MAISON'}];
      this.mtnFiltre = true
      this.ilot = true;
      this.lot = true;
      this.categorieRow = []
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ]
      this.homeService.getList(this.promotion.uuid,null,'LIST').subscribe((res) => {
        console.log('homes',res)
        return this.homes = res;
        }, error => {}
      );
    }if(type === 'SOUS_PROMOTION'){
      this.typeRow = [{label: 'SOUS PROMOTION', value: 'SOUS_PROMOTION'}];
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false
      this.nameTitle = 'Sous Promotion'
      this.etatTitle = "Disponibilité ?"
      this.etatRow = [
        { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { label: 'DISPONIBLE', value: 'DISPONIBLE' }
      ]
      this.promotionService.getList(this.promotion.uuid).subscribe((res) => {
        return this.sousPromotions = res;
        }, error => {}
      );
    }
  }
  editPromotion(row) {
    this.promotionService.setPromotion(row)
    this.promotionService.edit = true
    this.modal(PromotionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerPromotion(row): void {
    this.promotionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  showPromotion(row) {
    this.promotionService.setPromotion(row);
    this.router.navigate(['/admin/promotion/show/souspromotion/' + row.uuid]);
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
      if (willDelete.dismiss) { }
      else {
        this.promotionService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {this.back()}
        });}
    });
  }
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
  }
  updateZoom(event): void {}
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  back(){ window.history.back(); }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}
