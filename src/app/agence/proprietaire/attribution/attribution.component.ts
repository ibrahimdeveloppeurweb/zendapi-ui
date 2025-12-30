
import { User } from '@model/user';
import { House } from '@model/house';
import { Owner } from '@model/owner';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HouseService } from '@service/house/house.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from '@service/emitter/emitter.service';
import { DualListComponent } from 'angular-dual-listbox';

@Component({
  selector: 'app-attribution',
  templateUrl: './attribution.component.html',
  styleUrls: ['./attribution.component.scss']
})
export class AttributionComponent implements OnInit {
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

  title: string = '';
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

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private userService: UserService,
    private houseService: HouseService
  ) {
    this.title = 'Attribution de bien a des agents';
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
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      ownerUuid: [null],
      house: [null, [Validators.required]],
      users: this.formBuild.array([])
    })
  }
  setOwnerUuid(uuid) {
    if(uuid){
      this.f.ownerUuid.setValue(uuid);
      this.loadHouses();
    }else {
      this.f.ownerUuid.setValue(null);
      this.f.house.setValue(null);
    }
  }
  loadHouses() {
    this.isLoadingHouse = true;
    this.houses = [];
    this.house = null;
    if (!this.f.ownerUuid.value) {
      this.isLoadingHouse = false;
      return;
    }
    this.houseService.getList(this.f.ownerUuid.value).subscribe((res: any) => {
      this.isLoadingHouse = false;
      this.houses = res?.filter(res => { return res } );
      return this.houses;
    }, error => {
      this.isLoadingHouse = false;
    });
  }
  selectHouse(value) {
    this.house = this.houses.find(item => {
      if (item.uuid === value) {
        this.f.house.setValue(item.uuid);
        return item;
      }
    });
    this.f.house.setValue(value);
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.houseService.attribuate(this.form.getRawValue()).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'ATTRIBUTION_BIEN' , payload: res?.data});
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
    this.users.clear();
    this.confirmed.forEach(item =>{
      this.users.controls.push(
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
        this.users.controls.push(
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
  get users() { return this.form.get('users') as FormArray; }
}
