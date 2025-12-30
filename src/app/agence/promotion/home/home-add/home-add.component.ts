import {Home} from '@model/home';
import {Promotion} from '@model/promotion';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {HomeService} from '@service/home/home.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { PromotionService } from '@service/promotion/promotion.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home-add',
  templateUrl: './home-add.component.html',
  styleUrls: ['./home-add.component.scss']
})
export class HomeAddComponent implements OnInit {
  title: string = '';
  edit: boolean = false;
  form: FormGroup;
  submit: boolean = false;
  home: Home;
  promotion: Promotion;
  promotions: Promotion[] = [];
  sousPromotions: Promotion[] = [];
  promotionSelected: any;
  typeSelected: any;
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private homeService: HomeService,
    private promotionService: PromotionService,
    public uploadService: UploaderService,
    private emitter: EmitterService
  ) {
    this.edit = this.homeService.edit;
    this.home = this.homeService.getHome();
    this.title = (!this.edit) ? 'Ajouter une maison' : 'Modifier la maison ' + this.home?.searchableTitle + " de la promotion " + this.home?.promotion?.libelle;
    this.newForm();
    if (!this.edit) {
      this.promotionService.getList().subscribe((res) => {
        this.promotions = res;
        this.promotions = this.promotions.filter(promo => promo.type != 'TYPE_B');
      })
    }else{
      this.promotions.push(this.home.promotion)
    }
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      promotion: [null, [Validators.required]],
      sousPromotion: [null],
      type: [null],
      ilot: [null, [Validators.required]],
      lot: [null],
      nbrMaison: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      superficie: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      folderUuid: [null],
      photoUuid: [null],
      maisons: this.formBuild.array([]),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      label: [null]
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.homeService.getHome()};
      this.form.get('uuid').setValue(this.home.uuid);
      this.promotionSelected = data.promotion.uuid;
      this.setPromotionUuid(data.promotion);
      this.form.patchValue(data);
      this.setCurrentType(data?.type);
      this.f.promotion.setValue(data?.promotion?.uuid)
    }
  }
  setPromotionUuid(promotion) {
    this.promotion = promotion;
    if(promotion) {
      this.f.promotion.setValue(promotion.uuid);
      this.onChangePromotion(promotion);
      this.loadSousPromotions();
    }
  }
  loadSousPromotions() {
    this.sousPromotions = [];
    this.promotionService.getList(this.f.promotion.value).subscribe((res) => {
      this.sousPromotions = res;
      this.sousPromotions = this.sousPromotions.filter(promo => promo.type != 'TYPE_A');
    })
  }
  setCurrentType(type){
    this.setHomeTypeUuid(type?.uuid);
    this.typeSelected = {
      photoSrc: type?.photoSrc,
      title: type?.searchableTitle,
      detail: type?.searchableDetail
    };
  }
  setHomeTypeUuid(uuid){
    if(uuid){
      this.f.type.setValue(uuid);
    } else {
      this.f.type.setValue(null);
    }
  }
  onChangePromotion(event) {
    if (event) {
      this.promotionService.getSingle(event?.uuid).subscribe((res)=>{
        this.promotion = res;
      if(!this.edit){
        this.onChangeMaison()
        this.loadSousPromotions();
      }
      if(!this.edit && res?.type === 'TYPE_B') {
        Swal.fire({
          title: 'ATTENTION',
          text: 'Il est impossible d\'ajouter des maisons ou appartements directement sur des promotions de type B.',
          icon: 'error',
          showCancelButton: false,
          showCloseButton: false
        }).then((willDelete) => {
          this.setHomeTypeUuid(null);
          this.promotion = null;
          this.f.promotion.setValue(null)
          this.f.sousPromotion.setValue(null)
        });
      }
      })
    }else{
      this.promotion = null;
      this.f.promotion.setValue(null)
      this.f.sousPromotion.setValue(null)
    }
  }
  onChangeSousPromotion(event) {
    if (event) {
      this.promotionService.getSingle(event?.uuid).subscribe((res)=>{
        this.promotion = res;
        this.f.sousPromotion.setValue(res.uuid)
        if (!this.edit && res?.type) {
          this.onChangeMaison();
        }
        if(res?.type === 'TYPE_B') {
          Swal.fire({
            title: 'ATTENTION',
            text: 'Il est impossible d\'ajouter des maisons ou appartements directement sur des promotions de type B.',
            icon: 'error',
            showCancelButton: false,
            showCloseButton: false
          }).then((willDelete) => {
            this.f.sousPromotion.setValue(null)
          });
        }
      })
    }else{
      this.f.sousPromotion.setValue(null)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.f.sousPromotion.value != null) {
      this.f.promotion.setValue(this.f.sousPromotion.value)
    }
    if (this.form.valid) {
      this.homeService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'HOME_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'HOME_ADD', payload: res?.data});
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
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  onChangeMaison() {
    this.maison.controls.length = 0;
    var nbr = (this.f.nbrMaison.value >= 0) ? this.f.nbrMaison.value : 0;
    if (this.maison.controls.length < nbr) {
      for (let i = 0; i < nbr; i++) {
        var num = this.promotion?.nbrMaison + (i + 1);
        this.maison.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            type: [this.f.type.value, [Validators.required]],
            montant: [this.f.montant.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            ilot: [{value: this.f.ilot.value, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            lot: [num, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            superficie: [this.f.superficie.value, [Validators.required]],
          })
        );
      }
      return this.maison;
    } else {
      this.maison.clear();
    }
  }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get maison() { return this.form.get('maisons') as FormArray; }
}
