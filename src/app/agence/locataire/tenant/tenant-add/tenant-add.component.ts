import {Owner} from '@model/owner';
import {Tenant} from '@model/tenant';
import {ToastrService} from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TenantService} from '@service/tenant/tenant.service';
import { Component, HostListener, OnInit} from '@angular/core';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import {FormBuilder, FormArray, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-tenant-add',
  templateUrl: './tenant-add.component.html',
  styleUrls: ['./tenant-add.component.scss']
})
export class TenantAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = null;
  type: string = null;
  edit: boolean = false;
  tenant: Tenant;
  form: FormGroup;
  owner: Owner;
  submit: boolean = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  civilityRow = [
    {label: 'Monsieur', value: 'Mr'},
    {label: 'Madame', value: 'Mme'},
    {label: 'Mademoiselle', value: 'Mlle'}
  ];
  pieceRow = [
    {label: 'CNI', value: 'CNI'},
    {label: 'ONI', value: 'ONI'},
    {label: 'Carte Consulaire', value: 'Carte Consulaire'},
    {label: 'Passeport', value: 'Passeport'},
    {label: 'Permis de conduire', value: 'Permis de conduire'},
    {label: 'Autres pièces', value: 'Autres'}
  ];
  maritalRow = [
    {label: 'Célibataire', value: 'Célibataire'},
    {label: 'Marié(e)', value: 'Marié(e)'},
    {label: 'Veuve', value: 'Veuve'},
    {label: 'Veuf', value: 'Veuf'}
  ];
  relationshipRow = [
    {label: 'Parents', value: 'Parents'},
    {label: 'Partenaire', value: 'Partenaire'},
    {label: 'Collègue', value: 'Collègue'},
    {label: 'Amie(e)', value: 'Amie(e)'},
    {label: 'Autre', value: 'Autre'}
  ];
  taxeRow = [
    {label: 'Propriétaire', value: 'Proprietaire'},
    {label: 'Agence', value: 'Agence'}
  ];
  commissionRow = [
    {label: 'Après toutes les taxes', value: false},
    {label: 'Sur le total des loyers', value: true}
  ];
  numMask = Globals.numMask;
  telephoneSelected: string = null;
  numbWhatsappSelected: string = null;
  telResponsableSelected: string = null;
  contactUrgenceSelected: string = null;
  fileT: any;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public tenantService: TenantService,
    public uploadService: UploaderService
  ) {
    this.edit = this.tenantService.edit;
    this.tenant = this.tenantService.getTenant();
    this.title = (!this.edit) ? 'Ajouter un locataire' : 'Modifier le locataire ' + this.tenant?.nom;
    this.type = this.tenantService.type;
    this.newForm();
  }

  ngOnInit(): void {
    this.form.get('type').setValue(this.type);
    this.editForm();
  }

  newForm() {
    const defaults = {
      uuid: [null],
      id: [null],
      type: this.type,
      profession: [null],
      folderUuid: [null],
      codePostal: [null],
      nom: [null, [Validators.required]],
      telephone: [null, [Validators.required]],
      numbWhatsapp: [null],
      civilite: ['Mr', [Validators.required]],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      naturePiece: ['CNI'],
      dateEmission: [null],
      numPiece: [null],
      dateExpirePiece: [null],
      signatureAutorite: [null],
      domicile: [null],
      dateN: [null],
      lieuN: [null],
      ncc: [null],
      autrePiece: [null],
      user: this.formBuild.group({
        uuid: [null],
        id: [null],
        email: [null, [Validators.pattern(ValidatorsEnums.email)]],
        password:[null]
      }),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    };
    switch (this.type) {
      case 'PARTICULIER': {
        Object.assign(defaults, {
          nationalite: [null, [Validators.pattern(ValidatorsEnums.name)]],
          situationMatrimoniale: [null],
          enfant: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          nomUrgence: [null],
          affiniteUrgence: ['Parents'],
          autreAffinite: [null],
          contactUrgence: [null]
        });
        break;
      }
      case 'ENTREPRISE': {
        Object.assign(defaults, {
          nrc: [null],
          capital: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          siegeSocial: [null],
          nomResponsable: [null],
          posteOccupe: [null],
          telResponsable: [null],
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);

    this.form.get('naturePiece')?.valueChanges.subscribe(res => {
      this.form.get('autrePiece').setValue(null);
      if (res === 'Autres') {
        this.form.get('autrePiece').setValidators(Validators.required);
      } else {
        this.form.get('autrePiece').clearValidators();
      }
      this.form.get('autrePiece').updateValueAndValidity();
    })
    this.form.get('affiniteUrgence')?.valueChanges.subscribe(res => {
      this.form.get('autreAffinite').setValue(null);
      if (res === 'Autre') {
        this.form.get('autreAffinite').setValidators(Validators.required);
      } else {
        this.form.get('autreAffinite').clearValidators();
      }
      this.form.get('autreAffinite').updateValueAndValidity();
    })
  }
  editForm() {
    if (this.edit) {
      let data = {...this.tenantService.getTenant()};
      this.telephoneSelected = data?.telephone
      this.telResponsableSelected = data?.telResponsable
      this.contactUrgenceSelected = data?.contactUrgence
      data.dateN = DateHelperService.fromJsonDate(data?.dateN);
      data.dateEmission = DateHelperService.fromJsonDate(data?.dateEmission);
      data.dateExpirePiece = DateHelperService.fromJsonDate(data?.dateExpirePiece);
      this.form.controls.user.get('email').setValue(data?.email);
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const tenant = this.form.getRawValue();
      tenant.user.password = this.form.value.telephone;
      this.tenantService.add(tenant).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'TENANT_UPDATED' : 'TENANT_ADD', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
      error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
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
  onSexe() {
    if(this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if(this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if(this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
    }
  }
  loadfile(data) {
    if(data && data !== null){
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file?.name, [Validators.required]],
          fileSize: [file?.size, [Validators.required]],
          fileType: [file?.type, [Validators.required]],
          loaded: [data?.todo.loaded, [Validators.required]],
          chunk: [data?.chunk, [Validators.required]],
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
  setContact(event, type: string) {
    let value = null;
    if (type === 'telephone') {
      value = this.form.get('telephone').value
    }  else if (type === 'numbWhatsapp') {
      value = this.form.get('numbWhatsapp').value
    } else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      value = this.form.get('telResponsable').value
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      value = this.form.get('contactUrgence').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'telephone') {
      this.form.get('telephone').setValue(valeur)
    }  else if ( type === 'numbWhatsapp') {
      this.form.get('numbWhatsapp').setValue(valeur)
    }else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      this.form.get('telResponsable').setValue(valeur)
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      this.form.get('contactUrgence').setValue(valeur)
    }
  }
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileT = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileT = '';
    this.uploadService.setDataFileByFolder('');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
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
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
