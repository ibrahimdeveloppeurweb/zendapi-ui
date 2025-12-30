import { Building } from '@model/building';
import { Promotion } from '@model/promotion';
import { Globals } from '@theme/utils/globals';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from '@service/building/building.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { HomeType } from '@model/home-type';

@Component({
  selector: 'app-building-add',
  templateUrl: './building-add.component.html',
  styleUrls: ['./building-add.component.scss']
})
export class BuildingAddComponent implements OnInit {
  title: string = '';
  edit: boolean = false;
  form: FormGroup;
  submit: boolean = false;
  building: Building;
  buildings: Building[] = [];
  promotions: Promotion[] = [];
  sousPromotions: Promotion[] = [];
  homeTypes: HomeType[] = [];
  promotion: Promotion;
  promotionSelected: any;
  sousPromotionSelected: any;
  required = Globals.required;
  typeRow = [
    { label: 'BÂTIMENT INEXISTANT', value: 'ADD' },
    { label: 'BÂTIMENT EXISTANT', value: 'UPDATE' }
  ];
  etageRow = [];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private buildingService: BuildingService,
    private homeTypeService: HomeTypeService,
    private _changeDetector: ChangeDetectorRef,
    private promotionService: PromotionService
  ) {
    this.edit = this.buildingService.edit;
    this.building = this.buildingService.getBuilding();
    this.title = (!this.edit) ? 'Ajouter un bâtiment' : 'Modifier le bâtiment ' + this.building?.libelle + ' de la promotion ' + this.building?.promotion?.libelle;
    this.newForm();
    if (!this.edit) {
      this.promotionService.getList().subscribe((res) => {
        this.promotions = res;
        this.promotions = this.promotions.filter(promo => promo.type != 'TYPE_A');
      })
      this.homeTypeService.getList().subscribe((res) => {
        this.homeTypes = res;
      })
    } else {
      this.promotions.push(this.building.promotion)
    }
  }

  ngOnInit() {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['ADD', [Validators.required]],
      promotion: [null, [Validators.required]],
      sousPromotion: [null],
      niveau: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      libelle: [null, [Validators.required]],
      nbr: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      superficie: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      appartements: this.formBuild.array([]),
      buildings: this.formBuild.array([]),
    });

    this.form.get('type').valueChanges.subscribe(res => {
      this.form.get('uuid').setValue(null);
      this.form.get('niveau').setValue(null);
      this.form.get('libelle').setValue(null);
      this.form.get('superficie').setValue(null);
      if (!this.edit && res === 'ADD') {
        this.form.get('uuid').clearValidators();

        this.form.get('niveau').enable();
        this.form.get('libelle').enable();
        this.form.get('superficie').enable();
      } else if (!this.edit && res === 'UPDATE') {
        this.loadBuilding(this.f.sousPromotion.value ?? this.f.promotion.value);

        this.form.get('uuid').setValidators(Validators.required);
        this.form.get('niveau').disable();
        this.form.get('libelle').disable();
        this.form.get('superficie').disable();
      }
      this.form.get('uuid').updateValueAndValidity();
    });
    this.form.get('uuid').valueChanges.subscribe(res => {
      if (!this.edit && res) {
        this.building = this.buildings.find(build => build.uuid = res);
        this.form.get('libelle').setValue(this.building?.libelle);
        this.form.get('niveau').setValue(this.building?.niveau);
        this.form.get('superficie').setValue(this.building?.superficie);
      }
    });
    this.form.get('niveau').valueChanges.subscribe(res => {
      this.etageRow = [];
      if (!this.edit && res > 0) {
        this.etageRow.push({ label: "Rez-de-chaussée", value: "Rez-de-chaussée" });
        for (let index = 1; index <= res; index++) {
          this.etageRow.push({ label: index + "e étage", value: index });
        }
      }
    });
    this.form.get('buildings')?.statusChanges.subscribe(status => {
      if (status === 'VALID') {
        this.onChangeMaison();
      } else {
        this.appartement.clear();
      }
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.buildingService.getBuilding() };
      this.form.get('uuid').setValue(data.uuid);
      this.form.get('nbr').setValue(data.homes.length);
      this.form.get('nbr').disable();
      this.form.get('type').setValue('UPDATE');
      this.promotionSelected = data.promotion.uuid;
      this.setPromotionUuid(data.promotion);
      this.form.patchValue(data);
      this.f.promotion.setValue(data?.promotion?.uuid);
    }
  }

  setPromotionUuid(promotion) {
    this.promotion = promotion;
    if (promotion) {
      this.f.promotion.setValue(promotion.uuid);
      this.onChangePromotion(promotion);
      this.loadBuilding(promotion.uuid);
      this.loadSousPromotions();
    }
  }
  setHomeTypeUuid(uuid, row) {
    if (uuid) {
      row.get('type').setValue(uuid);
    } else {
      row.get('type').setValue(null);
    }
  }
  loadBuilding(uuid) {
    this.buildings = [];
    if (uuid && this.f.type.value === 'UPDATE') {
      this.buildingService.getList(uuid).subscribe((res) => {
        this.buildings = res;
        this._changeDetector.markForCheck();
      })
    }
  }

  loadSousPromotions() {
    this.sousPromotions = [];
    this.promotionService.getList(this.f.promotion.value).subscribe((res) => {
      this.sousPromotions = res;
      this.sousPromotions = this.sousPromotions.filter(promo => promo.type != 'TYPE_A');
    })
  }
  onChangePromotion(event) {
    if (event) {
      this.promotionService.getSingle(event?.uuid).subscribe((res) => {
        this.promotion = res;
        if (!this.edit) {
          this.onChangeMaison();
          this.loadBuilding(res.uuid);
          this.loadSousPromotions();
        }
        if (res?.type === 'TYPE_A') {
          Swal.fire({
            title: 'ATTENTION',
            text: 'Il est impossible d\'ajouter des bâtiments/immeuble sur des promotions de type A.',
            icon: 'error',
            showCancelButton: false,
            showCloseButton: false
          }).then((willDelete) => {
            this.promotion = null;
            this.f.promotion.setValue(null)
            this.f.sousPromotion.setValue(null)
          });
        }
      })
    } else {
      this.promotion = null;
      this.f.promotion.setValue(null)
      this.f.sousPromotion.setValue(null)
    }
  }

  onChangeSousPromotion(event) {
    if (event) {
      this.promotionService.getSingle(event?.uuid).subscribe((res) => {
        this.promotion = res;
        this.f.sousPromotion.setValue(res.uuid)
        if (!this.edit && res?.type) {
          this.onChangeMaison();
          this.loadBuilding(res.uuid);
        }
        if (res?.type === 'TYPE_A') {
          Swal.fire({
            title: 'ATTENTION',
            text: 'Il est impossible d\'ajouter des bâtiments/immeuble sur des promotions de type A.',
            icon: 'error',
            showCancelButton: false,
            showCloseButton: false
          }).then((willDelete) => {
            this.f.sousPromotion.setValue(null)
          });
        }
      })
    } else {
      this.f.sousPromotion.setValue(null)
    }
  }

  onSubmit() {
    this.submit = true;
    if (this.f.sousPromotion.value != null) {
      this.f.promotion.setValue(this.f.sousPromotion.value)
    }
    if (this.form.valid) {
      this.buildingService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({ action: 'BUILDING_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'BUILDING_ADD', payload: res?.data });
          }
        }
      }, error => { });
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
  onChangeMaison() {
    if (this.buildingsF.controls.length > 0) {
      this.appartement.clear();
      var count = 0;
      for (let i = 0; i < this.buildingsF.controls.length; i++) {
        const nbr = this.buildingsF.value[i].nbr >= 0 ? this.buildingsF.value[i].nbr : 0;
        for (let y = 0; y < nbr; y++) {
          count++;
          this.appartement.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              type: [this.buildingsF.value[i].type, [Validators.required]],
              etage: [this.buildingsF.value[i].etage, [Validators.required]],
              porte: [count, [Validators.required]],
              montant: [this.buildingsF.value[i].montant, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              superficie: [this.buildingsF.value[i].superficie, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            })
          );
        }
      }
    }
  }  
  onChangeEtages() {
    this.buildingsF.controls.length = 0;
    var niveau = (this.f.niveau.value >= 0) ? this.f.niveau.value : 0;
    if (this.buildingsF.controls.length < niveau) {
      this.buildingsF.push(this.formBuild.group({
        etage: ["Rez-de-chaussée", [Validators.required]],
        type: [null, [Validators.required]],
        montant: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        superficie: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        nbr: [this.f.nbr.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      }))
      for (let i = 0; i < niveau; i++) {
        this.buildingsF.push(
          this.formBuild.group({
            etage: [i + 1, [Validators.required]],
            type: [null, [Validators.required]],
            montant: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            superficie: [null, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            nbr: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      }
      return this.buildingsF;
    } else {
      this.buildingsF.clear();
    }
  }
  get f() { return this.form.controls; }
  get appartement() { return this.form.get('appartements') as FormArray; }
  get buildingsF() { return this.form.get('buildings') as FormArray; }
}
