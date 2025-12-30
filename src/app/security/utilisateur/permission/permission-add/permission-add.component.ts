
import { ToastrService } from 'ngx-toastr';
import { Path } from '@model/path';
import { Permission } from '@model/permission';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { PathService } from '@service/path/path.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {EmitterService} from '@service/emitter/emitter.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PermissionService } from '@service/permission/permission.service';

@Component({
  selector: 'app-permission-add',
  templateUrl: './permission-add.component.html',
  styleUrls: ['./permission-add.component.scss']
})
export class PermissionAddComponent implements OnInit {
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
  type: string = ""
  edit: boolean = false
  permision: Permission
  pathRow: Path[]
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private pathService: PathService,
    private permissionService: PermissionService
  ) {
    this.edit = this.permissionService.edit
    this.permision = this.permissionService.getPermission()
    this.title = (!this.edit) ? "Ajouter une permission" : "Modifier la permission "+this.permision.nom
    this.newForm()
  }

  ngOnInit(): void {
    this.pathService.getList('CLIENT').subscribe(res => {
      if(res){
        res?.forEach(item => {
          this.stations.push({
            key: item?.id,
            station: item?.libelle,
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
      nom: [null, [Validators.required]],
      description: [null],
      paths: this.formBuild.array([])
    })
  }

  editForm() {
    if (this.edit) {
      const data = { ...this.permissionService.getPermission() }
      this.confirmed = data.paths
      this.form.patchValue(data)
      this.pathRow = data.paths
    }
  }
  setData(){
    this.paths.clear();
    this.confirmed.forEach(item =>{
      this.paths.controls.push(
        this.formBuild.group({
          uuid: [item?.state],
          libelle: [item?.station],
        })
      );
    })
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.permissionService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'PERMISSION_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PERMISSION_ADD', payload: res?.data});
          }
        }
      }, error => {
      });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
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
      if(this.pathRow.length > 0){
        this.pathRow.forEach(item => {
          this.stations.forEach((key, i) => {
            if(item.id === key.key){ this.confirmedStations.push(this.stations[i]); }
          })
          this.paths.controls.push(
            this.formBuild.group({
              uuid: [item?.uuid],
              libelle: [item?.libelle],
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
  get f() { return this.form.controls }
  get paths() { return this.form.get('paths') as FormArray; }
}
