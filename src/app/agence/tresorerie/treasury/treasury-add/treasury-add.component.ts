import { Component, OnInit } from '@angular/core';
import { Treasury } from '@model/treasury';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TreasuryService } from '@service/treasury/treasury.service';
import { Globals } from '@theme/utils/globals';
import { UserService } from '@service/user/user.service';
import { User } from '@model/user';
import { DualListComponent } from 'angular-dual-listbox';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-treasury-add',
  templateUrl: './treasury-add.component.html',
  styleUrls: ['./treasury-add.component.scss']
})
export class TreasuryAddComponent implements OnInit {
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

  title: string = ""
  edit: boolean = false
  treasury: Treasury
  users: User[]
  validateurRow: User[]
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  typeRow = [
    { label: "CAISSE", value: "CAISSE" },
    { label: "BANQUE", value: "BANQUE" },
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public treasuryService: TreasuryService,
    private emitter: EmitterService,
    private userService: UserService,
  ) {
    this.edit = this.treasuryService.edit
    this.treasury = this.treasuryService.getTreasury()
    this.title = (!this.edit) ? "Ajouter une trésorerie" : "Modifier la trésorerie "+this.treasury.nom
    this.newForm()
  }

  ngOnInit(): void {
    this.userService.getList(null, null).subscribe(res => {
      if(res){
        this.users = res ? res : []
        res?.forEach(item => {
          this.stations.push({
            key: item?.id,
            station: item?.nom,
            state: item?.uuid
          })
        });
        this.editForm()
        this.doReset();
      }
    })
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['CAISSE', [Validators.required]],
      compte: [null],
      nom: [null, [Validators.required]],
      seuilMin: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      seuilMax: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      gerant: [null, [Validators.required]],
      validateurs: this.formBuild.array([]),
      commentaire: [null],
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.treasuryService.getTreasury() }
      this.form.patchValue(data)
      this.f.gerant.setValue(data?.gerant?.uuid)
      this.validateurRow = data.validateurs
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.treasuryService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'TREASURY_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'TREASURY_ADD', payload: res?.data});
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
    if(this.edit){
      if(this.validateurRow.length > 0){
        this.validateurRow.forEach(item => {
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

  get f() { return this.form.controls; }
  get validateurs() { return this.form.get('validateurs') as FormArray; }
}
