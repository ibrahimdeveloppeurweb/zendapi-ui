
import { User } from '@model/user';
import { House } from '@model/house';
import { Owner } from '@model/owner';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ValidationService } from '@service/validation/validation.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HouseService } from '@service/house/house.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';

@Component({
  selector: 'app-validation-add',
  templateUrl: './validation-add.component.html',
  styleUrls: ['./validation-add.component.scss']
})
export class ValidationAddComponent implements OnInit {
  tab = 1;
  keepSorted = true;
  key: string;
  display: string;
  filter = false;
  source: Array<any>;
  confirmed: Array<any>;
  userAdd = '';
  disabled = false;
  sourceLeft = true;
	private DEFAULT_FORMAT = {
    add: 'Ajouter',
    remove: 'Supprimer',
    all: 'Tout selectionner',
    none: 'Annuler',
    direction:
    DualListComponent.LTR,
    draggable: true
  };
  format: any = this.DEFAULT_FORMAT;
  private sourceStations: Array<any>;
  private confirmedStations: Array<any>;
  private stations: Array<any> = [];
  dataRow: any[] = []
  title: string = '';
  type: string = 'HOUSE';
  form: FormGroup;
  isLoadingHouse = false;
  submit = false;
  owner: Owner;
  ownerUuid ?: null;
  usersRow?: User[] = [];
  houses?: House[] = [];
  house: House;
  ownerSelected?: any;
  required = Globals.required;
  entitySelected = null

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private userService: UserService,
    private houseService: HouseService,
    private promotionService: PromotionService,
    private subdivisionService: SubdivisionService,
    private validationService: ValidationService
  ) {
    this.title = 'Définir mes validateurs';
    this.newForm();
  }

  ngOnInit(): void {
    this.userService.getList().subscribe(res => {
      if(res){
        res?.forEach(item => {
          this.stations.push({
            key: item?.id,
            station: item?.libelle,
            state: item?.uuid
          })
        });
        this.doReset();
      }
    })

    this.type = this.validationService.type
    if(this.type === "HOUSE"){
      this.houseService.getList(null, null, null, null, 'ALL').subscribe(res => {
        if(res){
          this.dataRow = res
          return this.dataRow
        }
      })
    }else if(this.type === "PROMOTION"){
      this.promotionService.getList().subscribe(res => {
        if(res){
          this.dataRow = res
          return this.dataRow
        }
      })
    }else if(this.type === "LOTISSEMENT"){
      this.subdivisionService.getList().subscribe(res => {
        if(res){
          this.dataRow = res
          return this.dataRow
        }
      })
    }
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      status: [null],
      type: [this.type, [Validators.required]],
      options: [null, [Validators.required]],
      validateurs: this.formBuild.array([])
    })

    this.form.get('status').valueChanges.subscribe(res => {
      if (res === "GROUPE") {
        this.form.get('options').setValidators(Validators.required);
      } else {
        this.form.get('options').clearValidators();;
      }
      this.form.get('options').updateValueAndValidity();
    });
  }
  setHouseUuid(uuid) {
    if(uuid){
      this.f.entity.setValue(uuid);
    }else {
      this.f.entity.setValue(null);
    }
  }
  setPromotionUuid(uuid) {
    if(uuid){
      this.f.entity.setValue(uuid);
    }else {
      this.f.entity.setValue(null);
    }
  }
  setLotissementUuid(uuid) {
    if(uuid){
      this.f.entity.setValue(uuid);
    }else {
      this.f.entity.setValue(null);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.getRawValue()
      this.validationService.create(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'VALIDATEUR' , payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => {
          this.toast(error.message, 'Une erreur a été rencontrée', error.status);
        }
      );
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
  setData(){
    this.validateurs.clear();
    this.confirmed.forEach(item =>{
      this.validateurs.controls.push(
        this.formBuild.group({
          uuid: [item?.state],
          libelle: [item?.station],
        })
      );
    })
  }
  private useStations() {
    this.key = 'key';
    this.display = 'station';
    this.keepSorted = true;
    this.source = this.sourceStations;
    this.confirmed = this.confirmedStations;
  }
  doReset() {
    this.sourceStations = JSON.parse(JSON.stringify(this.stations));
    this.confirmedStations = new Array<any>();
    if(this.usersRow.length > 0){
      this.usersRow.forEach(item => {
        this.stations.forEach((key, i) => {
          if(item.id === key.key){ this.confirmedStations.push(this.stations[i]); }
        })
        this.validateurs.controls.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            libelle: [item?.nom],
          })
        );
      })
    }
    this.useStations();
  }
  filterBtn() { return (this.filter ? 'Hide Filter' : 'Show Filter'); }
  doDisable() { this.disabled = !this.disabled; }
  disableBtn() { return (this.disabled ? 'Enable' : 'Disabled'); }
  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
  }
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f() {return this.form.controls;}
  get validateurs() { return this.form.get('validateurs') as FormArray; }
}
