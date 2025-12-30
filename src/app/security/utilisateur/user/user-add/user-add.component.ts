
import { User } from '@model/user';
import { ToastrService } from 'ngx-toastr';
import { Permission } from '@model/permission';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { DualListComponent } from 'angular-dual-listbox';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { PermissionService } from '@service/permission/permission.service';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
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
  user: User
  form: FormGroup
  roleRow: Permission[]
  submit: boolean = false
  required = Globals.required
  serviceSelected?: any;
  civilityRow = [
    {label: 'Monsieur', value: 'Mr'},
    {label: 'Madame', value: 'Mme'},
    {label: 'Mademoiselle', value: 'Mlle'}
  ];

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public authService: AuthService,
    private userService: UserService,
    public uploadService: UploaderService,
    public permissionService: PermissionService
  ) {
    this.edit = this.userService.edit
    this.user = this.userService.getUser()
    this.title = (!this.edit) ? "Ajouter un utilisateur" : "Modifier l'utilisateur "+this.user?.nom
    this.newForm()
  }

  ngOnInit(): void {
    this.permissionService.getList().subscribe(res => {
      if(res){
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
    const defaults = {
      uuid: [null],
      id: [null],
      folderUuid: [null],
      photoUuid: [null],
      civilite: ['Mr', [Validators.required]],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      username: [null, [Validators.required, Validators.pattern(ValidatorsEnums.email)]],
      nom: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(ValidatorsEnums.email)]],
      service: [null, [Validators.required]],
      contact: [null, [Validators.required]],
      files: this.formBuild.array([]),
      roles: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    };
    switch (this.edit) {
      case false: {
        Object.assign(defaults, {
          password: [null, [Validators.required]],
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);
  }

  editForm() {
    if (this.edit) {
      const data = { ...this.userService.getUser() }
      this.form.patchValue(data)
      this.f.folderUuid.setValue(data?.folder?.uuid);
      this.setServiceUuid(data?.service?.uuid)
      this.serviceSelected = {
        photoSrc: data?.service?.photoSrc,
        title: data?.service?.nom,
        detail: data?.service?.direction
      };
      this.f.service.setValue(data?.service?.uuid);
      this.f.contact.setValue(data?.telephone);
      this.roleRow = data.droits
    }
  }

  setServiceUuid(uuid) {
    if(uuid) {
      this.f.service.setValue(uuid);
    } else {
      this.f.service.setValue(null);
    }
  }
  onSexe() {
    if(this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if(this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if(this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.userService.add(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (data?.uuid) {
              this.authService.setPermissionToken(res)
              this.emitter.emit({action: 'USER_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'USER_ADD', payload: res?.data});
            }
          }
        });
    } else { return; }
  }
  setData(){
    this.roles.clear();
    this.confirmed.forEach(item =>{
      this.roles.controls.push(
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
      if(this.roleRow.length > 0){
        this.roleRow.forEach(item => {
          this.stations.forEach((key, i) => {
            if(item.id === key.key){ this.confirmedStations.push(this.stations[i]); }
          })
          this.roles.controls.push(
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
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'locataire'}
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
      this.formBuild.array([])
      this.form.controls['folderUuid'].setValue(null);
    }
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
  get file() { return this.form.get('files') as FormArray; }
  get roles() { return this.form.get('roles') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
