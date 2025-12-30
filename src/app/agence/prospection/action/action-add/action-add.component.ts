
import { Treasury } from '@model/treasury';
import { Globals } from '@theme/utils/globals';
import { Component, HostListener, OnInit } from '@angular/core';
import { FundRequest } from '@model/fund-request';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { UploaderService } from '@service/uploader/uploader.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProspectionService } from '@service/prospection/prospection.service';
import { ActionCommercialService } from '@service/action-commercial/action-commercial.service';

@Component({
  selector: 'app-action-add',
  templateUrl: './action-add.component.html',
  styleUrls: ['./action-add.component.scss']
})
export class ActionAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = ""
  edit: boolean = false
  fundRequest: FundRequest
  treasuries: Treasury[]
  form: FormGroup
  submit: boolean = false
  currentFund?: any;
  actionSelected: any;
  prospectSelected: any;
  required = Globals.required
  user = Globals.user
  typeRow = [
    {label : 'ENVOI MAIL', value: 'ENVOI MAIL'},
    {label : 'APPEL TELEPHONIQUE', value: 'APPEL TELEPHONIQUE'},
    {label : 'RDV PHYSIQUE', value: 'RDV PHYSIQUE'},
    {label : 'ENVOI DE CONNTRAT', value: 'ENVOI DE CONNTRAT'},
    {label : 'ATTENTE DE RECPTION DU CONTRAT', value: 'ATTENTE DE RECPTION DU CONTRAT'},
    {label : 'ATTENTE VERSEMENT APPORT', value: 'ATTENTE VERSEMENT APPORT'},
    {label : 'CONTRAT IMCOMPLET', value: 'CONTRAT IMCOMPLET'},
    {label : 'CONTRAT À RESIGNER', value: 'CONTRAT À RESIGNER'},
  ]

  prospectsRow: any[] = []
  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private prospectionService: ProspectionService,
    private actionService: ActionCommercialService
  ) {
    
    this.title = (!this.edit) ? "Effectuer une action commerçiale" : " Modier l' action commerçiale "
    this.newForm()
    this.prospectionService.getList().subscribe((res: any) => {
      return this.prospectsRow = res
    })
    
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      prospect: [this.prospectionService.uuid],
      type: [null, [Validators.required]],
      objet: [null, [Validators.required]],
      description: [null, [Validators.required]],
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
     
    }
  }

  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.actionService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'ACTION_UPDATE', payload: res?.data});
          } else {
            this.emitter.emit({action: 'ACTION_ADD', payload: res?.data});
          }
        }
      }, error => {});

    } else { return; }
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

  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'commercial'}
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
  get f() { return this.form.controls; }
  get folder() { return this.form.get('folders') as FormArray; }
}

