import { ToastrService } from 'ngx-toastr';
import { Promotion } from '@model/promotion';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, OnInit } from '@angular/core';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ReportListComponent } from '@agence/promotion/report/report-list/report-list.component';

@Component({
  selector: 'app-promotion-add',
  templateUrl: './promotion-add.component.html',
  styleUrls: ['./promotion-add.component.scss']
})
export class PromotionAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = "";
  activeTab: string = "PIECES";
  edit: boolean = false;
  promotion: Promotion;
  promotions: Promotion[] = [];
  form: FormGroup;
  pieceForm: FormGroup;
  equipementForm: FormGroup;
  galleryForm: FormGroup;
  videoForm: FormGroup;
  planForm: FormGroup;
  submit: boolean = false;
  required = Globals.required;
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  canCloseAccordion = false;

  map ?: any;
  etatRow = [
    {label: "INDISPONIBLE", value: "INDISPONIBLE"},
    {label: "DISPONIBLE", value: "DISPONIBLE"}
  ];
  typeRow = [
    {label: "TYPE A", value: "TYPE_A"},
    {label: "TYPE B", value: "TYPE_B"},
    {label: "TYPE C", value: "TYPE_C"}
  ];
  public galleryFile :any[];
  public planFile :any[];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private promotionService: PromotionService,
    public uploadService: UploaderService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.promotionService.edit
    this.promotion = this.promotionService.getPromotion()
    this.promotionService.getList().subscribe((res) =>{
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        if ( this.promotion?.uuid != element.uuid) {
          this.promotions.push(element);
        }
      }

    })
    this.title = (!this.edit) ? "Ajouter une promotion" : "Modifier la promotion "+this.promotion.libelle;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      date: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      type: ["TYPE_A", [Validators.required]],
      etat: ["DISPONIBLE", [Validators.required]],
      superficie: [null, [Validators.required, Validators.min(0)]],
      nbrMaison: [0, [Validators.required, Validators.min(0)]],
      ville: [null, [Validators.required]] ,
      commune: [null, [Validators.required]] ,
      quartier: [null, [Validators.required]],
      surfaceBati: [0, [Validators.pattern(ValidatorsEnums.decimal)]],
      montantCr: [0, [Validators.pattern(ValidatorsEnums.decimal)]],
      montantCc: [0, [Validators.pattern(ValidatorsEnums.decimal)]],
      montantAdmin: [0, [Validators.pattern(ValidatorsEnums.decimal)]],
      montantVrd: [0, [Validators.pattern(ValidatorsEnums.decimal)]],
      lng: [null],
      lat: [null],
      zoom: [null],
      folderUuid: [null],
      parent: [null],
      isOffre: [null, [Validators.required]],
      dateOffre: [null],
      homes: this.formBuild.array([]),
      buildings: this.formBuild.array([]),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      piece: [null],
      equipement: [null],
      video: [null],
      gallery: [null],
      plan: [null]
    });

    this.form.get('isOffre').valueChanges.subscribe(res => {
      if(res === 'OUI') {
        this.form.get('dateOffre').setValidators(Validators.required);
      } else {
        this.form.get('dateOffre').clearValidators();
      }
      this.form.get('dateOffre').updateValueAndValidity();
    })
    this.form.get('type').valueChanges.subscribe(res => {
      if (!this.edit) {
        this.form.get('nbrMaison').setValue(0);
        this.home.clear();
        this.building.clear();
        if(res === 'TYPE_C') {
          this.form.get('nbrMaison').clearValidators();
          this.form.get('nbrMaison').disable();
        } else {
          this.form.get('nbrMaison').setValidators(Validators.required);
          this.form.get('nbrMaison').enable();
        }
        this.form.get('nbrMaison').updateValueAndValidity();
      }
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
  editForm() {
    if (this.edit) {
      const data = { ...this.promotionService.getPromotion() }
      this.lat = data.lat ? data.lat : Globals.lat;
      this.lng = data.lng ? data.lng : Globals.lng;
      this.form.get('uuid').setValue(this.promotion.uuid);
      data.date = DateHelperService.fromJsonDate(data.date);
      this.form.patchValue(data)
      if (data.parent) {
        this.form.get('parent').setValue(data.parent.uuid);
      }
      this.form.get('uuid').setValue(this.promotion.uuid);
    }
  }
  setHomeTypeUuid(uuid, row){
    if(uuid){
      row.get('type').setValue(uuid);
    } else {
      row.get('type').setValue(null);
    }
  }
  onChangeLoad(type) {
    this.activeTab = type;

  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.f.plan.setValue(this.planForm.getRawValue());
      this.f.piece.setValue(this.pieceForm.getRawValue());
      this.f.video.setValue(this.videoForm.getRawValue());
      this.f.gallery.setValue(this.galleryForm.getRawValue());
      this.f.equipement.setValue(this.equipementForm.getRawValue());
      this.promotionService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'PROMOTION_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PROMOTION_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
    }
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
  onChangeHome() {
    if (this.f.type.value === 'TYPE_A') {
      this.home.controls.length = 0;
      var nbr = (this.f.nbrMaison.value >= 0) ? this.f.nbrMaison.value : 0;
      if (this.home.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var num = i + 1;
          this.home.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              lot: [{value: num, disabled: true}, [Validators.required]],
              type: [null, [Validators.required]],
              ilot: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              montant: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              superficie: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            })
          );
        }
        return this.home;
      } else {
        this.home.clear();
      }
    } else if (this.f.type.value === 'TYPE_B') {
      this.building.controls.length = 0;
      var nbr = (this.f.nbrMaison.value >= 0) ? this.f.nbrMaison.value : 0;
      if (this.building.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var num = i + 1;
          this.building.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              libelle: [null, [Validators.required]],
              niveau: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              superficie: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            })
          );
        }
        return this.building;
      } else {
        this.building.clear();
      }
    }
  }
  loadfile(data) {
    if(data && data !== null){
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
    if(data && data !== null){
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
  upload(files) {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value) {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'promotion'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset(){
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    }else{
      this.form.reset()
      this.form.controls['folderUuid'].setValue(null);
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
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title)
    } else if (type == 'success') {
      this.toastr.success(msg, title)
    } else if (type == 'warning') {
      this.toastr.warning(msg, title)
    } else if (type == 'error') {
      this.toastr.error(msg, title)
    }
  }

  get f() { return this.form.controls; }
  get home() { return this.form.get('homes') as FormArray; }
  get building() { return this.form.get('buildings') as FormArray; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
