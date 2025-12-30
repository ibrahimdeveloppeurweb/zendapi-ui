import { Subdivision } from './../../../../model/subdivision';
import { BuildingService } from './../../../../service/building/building.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OffreService } from '@service/offre/offre.service';
import { Promotion } from '@model/promotion';
import { Building } from '@model/building';
import { Home } from '@model/home';
import { Islet } from '@model/islet';
import { Lot } from '@model/lot';
import { House } from '@model/house';
import { HomeService } from '@service/home/home.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { IsletService } from '@service/islet/islet.service';
import { LotService } from '@service/lot/lot.service';
import { HouseService } from '@service/house/house.service';

@Component({
  selector: 'app-offre-add',
  templateUrl: './offre-add.component.html',
  styleUrls: ['./offre-add.component.scss']
})
export class OffreAddComponent implements OnInit {

  title = null;
  type = '';
  edit: boolean = false;
  offre: any;
  form: FormGroup;
  pieceForm: FormGroup;
  equipementForm: FormGroup;
  galleryForm: FormGroup;
  videoForm: FormGroup;
  planForm: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  map?: any;
  types?: any[] = [];
  cities?: any[] = [];
  biens?: any[] = [];
  typeOffres = [
    { label: 'OUI', value: 'OUI' },
    { label: 'NON', value: 'NON' }
  ];
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  professionnelleRow = [
    { label: 'Agent de l\'Etat', value: 'Agent de l\'Etat' },
    { label: 'Agent(e) du secteur privé', value: 'Agent(e) du secteur privé' },
    { label: 'Artisan(e)', value: 'Artisan(e)' },
    { label: 'Agriculteur', value: 'Agriculteur' },
    { label: 'Profession libérale', value: 'Profession libérale' },
    { label: 'Commerçant(e)', value: 'Commerçant(e)' },
    { label: 'Autre, à préciser', value: 'Autre, à préciser' },
  ]

  disponibilites = [
    {label : 'VENTE', value: 'VENTE'},
    {label : 'LOCATION', value: 'LOCATION'},
  ]
  typeRow = [
    {label : 'OFFRE LIBRE', value: 'LIBRE'},
    {label : 'MAISON DE PROMOTION IMMOBILIER', value: 'MAISON'},
    {label : 'LOT DE PROJET DE LOTISSEMENT', value: 'LOT'},
    {label : 'MAISON EN VENTE', value: 'HOUSE'},
  ]
  typeSelected: any

  promotionSelected: any
  subdivisionSelected: any
  houseSelected: any
  promotion: Promotion
  building: Building
  home: Home
  subdivsion: Subdivision
  ilot: Islet
  lot: Lot
  house: House
  buildings: Building[] = []
  homes: Home[] = []
  ilots: Islet[] = []
  lots: Lot[] = []
  houses: House []= []
  rentals: House []= []
  public galleryFile :any[];
  public planFile :any[];

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private lotService: LotService,
    private emitter: EmitterService,
    private homeService: HomeService,
    private isletService: IsletService,
    private offreService: OffreService,
    private houseService: HouseService,
    public uploadService: UploaderService,
    private buildingService: BuildingService,
    private promotionService: PromotionService,
    public prospectionService: ProspectionService
  ) {
    this.edit = this.prospectionService.edit;
    this.type = this.prospectionService.type;
    this.offre = this.prospectionService.getProspection();
    this.title = (!this.edit) ? 'Ajouter une offre' : 'Modifier l\'offre ' + this.offre.nom;
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      type: [null, [Validators.required]],
      promotion: [null],
      subdivision: [null],
      house: [null],
      building: [null],
      home: [null],
      islet: [null],
      lot: [null],

      libelle: [null],
      bien: [null],
      ville: [null],
      commune: [null],
      quartier: [null],
      prix: [0],
      surfaceT: [0],
      surfaceB: [0],
      eau: [0],
      disponibilite: [null],
      nbPiece: [0],
      qte: [0],
      lat: [null],
      typeBien: [null],
      lng: [null],
      offreVedette: [null],
      description: [null],
      folderUuid: [null],
      piece: [null],
      equipement: [null],
      video: [null],
      gallery: [null],
      plan: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    })
    this.pieceForm = this.formBuild.group({
      chambre: [0],
      douche: [0],
      salon: [0],
      cuisine: [0],
      garage: [0],
    });
    this.equipementForm = this.formBuild.group({
      wifi: [false],
      clim: [false],
      securite: [false],
      parking: [false],
      incendie: [false],
      urgence: [false],
      piscine: [false],
      concierge: [false],
      nbPlace: [0],
    });
    this.galleryForm = this.formBuild.group({
      files: [null],
    });
    this.planForm = this.formBuild.group({
      files: [null],
    });
    this.videoForm = this.formBuild.group({
      link: [null],
    });
  }
  onChangeType(){
    if(this.f.type.value === 'HOUSE'){
      this.loadHouse()
    }else{
      this.houses = []
    }
  }
  setPromotionUuid(uuid) {
    if (uuid) {
      this.f.promotion.setValue(uuid);
      this.loadPromotion(uuid)
    }else{
      this.f.promotion.setValue(uuid);
      this.promotionSelected = null;
      this.promotion = null;
      this.homes = [];
      this.buildings = [];
    }
  }
  loadPromotion(uuid) {
    if(uuid){
      this.promotionService.getSingle(uuid).subscribe(res => {
        if(res){
          this.promotion = res
          if(this.promotion.type === 'TYPE_A'){
            this.loadHome(uuid, null)
          }else if(this.promotion.type === 'TYPE_B'){
            this.loadBuilding(uuid)
          }
          return this.promotion
        }
       });
    }else{
      this.promotion = null
    }
  }
  loadBuilding(uuid) {
    if(uuid){
      this.buildingService.getList(uuid).subscribe(res => {
        if(res){
          this.buildings = res
          return this.buildings
        }
       });
    }else{
      this.buildings = []
    }
  }
  onChangeBuilding(uuid) {
    if(uuid){
      this.loadHome(this.f.promotion.value, uuid)
    }else{
      this.f.building.setValue(null)
    }
  }
  loadHome(promotion, building) {
    if(promotion || building){
      this.homeService.getList(promotion, building).subscribe(res => {
        if(res){
          this.homes = res
          return this.homes
        }
       });
    }else{
      this.homes = []
    }
  }
  setSubdivisionUuid(uuid) {
    if (uuid) {
      this.f.subdivision.setValue(uuid);
      this.loadIslet(uuid)
    }else{
      this.f.subdivision.setValue(uuid);
      this.subdivisionSelected = null;
      this.ilots = [];
      this.lots = [];
    }
  }
  loadIslet(uuid) {
    if(uuid){
      this.isletService.getList(uuid).subscribe(res => {
        if(res){
          this.ilots = res
          return this.ilots
        }
       });
    }else{
      this.ilots = []
    }
  }
  onChangeIslet(uuid) {
    if(uuid){
      this.lotService.getList(this.f.subdivision.value, uuid).subscribe(res => {
        if(res){
          this.lots = res
          return this.lots
        }
       });
    }else{
      this.lots = []
    }
  }
  loadHouse() {
    this.houseService.getList(null, 'VENTE').subscribe(res => {
      if(res){
        this.houses = res
        return this.houses
      }
    });
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  setTypeUuid(uuid) {
    if (uuid) {
      this.f.typeBien.setValue(uuid);
    }else{
      this.f.typeBien.setValue(uuid);
    }
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    this.f.plan.setValue(this.planForm.getRawValue());
    this.f.piece.setValue(this.pieceForm.getRawValue());
    this.f.video.setValue(this.videoForm.getRawValue());
    this.f.gallery.setValue(this.galleryForm.getRawValue());
    this.f.equipement.setValue(this.equipementForm.getRawValue());
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.offreService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'OFFRE_UPDATED' : 'OFFRE_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
      return;
    }
  }

  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
  }
  files(data) {
    if (data && data !== null) {
      data.forEach(item => {
        this.folder.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  uploadFile(data, type) {
    if(type === "GALLERY"){
      this.galleryForm.get('files').setValue(data);
    }
    if(type === "PLAN"){
      this.planForm.get('files').setValue(data);
    }
  }
  filesPlan(data) {
    this.planForm.get('files').setValue(data);
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
    this.form.controls.lat.setValue(event.coords.lat);
    this.form.controls.lng.setValue(event.coords.lng);
  }
  updateZoom(event): void {
    this.form.controls.zoom.setValue(event);
  }

  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }

  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
      this.form.reset()
  }

  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }



}
