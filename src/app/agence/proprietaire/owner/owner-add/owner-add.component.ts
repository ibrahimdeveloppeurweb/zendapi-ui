import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DateHelperService } from '@theme/utils/date-helper.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Owner } from '@model/owner';
import { OwnerService } from '@service/owner/owner.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { environment } from '@env/environment';

@Component({
  selector: 'app-owner-add',
  templateUrl: './owner-add.component.html',
  styleUrls: ['./owner-add.component.scss']
})
export class OwnerAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title = null;
  type = '';
  edit: boolean = false;
  owner: Owner;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  pieceRow = [
    { label: 'CNI', value: 'CNI' },
    { label: 'ONI', value: 'ONI' },
    { label: 'Carte Consulaire', value: 'Carte Consulaire' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Permis de conduire', value: 'Permis de conduire' },
    { label: 'Autres pieces', value: 'Autres' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  relationshipRow = [
    { label: 'Parents', value: 'Parents' },
    { label: 'Partenaire', value: 'Partenaire' },
    { label: 'Collègue', value: 'Collègue' },
    { label: 'Amie(e)', value: 'Amie(e)' },
    { label: 'Autre', value: 'Autre' }
  ];
  numMask = Globals.numMask;
  telephoneSelected: string = null;
  numbWhatsappSelected: string = null;
  telResponsableSelected: string = null;
  contactUrgenceSelected: string = null;
  fileO: any;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public ownerService: OwnerService,
    public uploadService: UploaderService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.ownerService.edit;
    this.type = this.ownerService.type;
    this.owner = this.ownerService.getOwner();
    this.title = (!this.edit) ? 'Ajouter un propriétaire' : 'Modifier le propriétaire ' + this.owner.nom;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    const defaults = {
      uuid: [null],
      id: [null],
      type: this.type,
      civilite: ['Mr', [Validators.required]],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      folderUuid: [null],
      profession: [null],
      codePostal: [null],
      nom: [null, [Validators.required]],
      telephone: [null, [Validators.required]],
      numbWhatsapp: [null],
      naturePiece: ['CNI'],
      numPiece: [null],
      autrePiece: [null],
      domicile: [null],
      dateN: [null],
      lieuN: [null],
      conjoint: [null],
      employeur: [null],
      rib: [null],
      ncc: [null],
      signatureAutorite: [null],
      dateEmission: [null],
      user: this.formBuild.group({
        uuid: [null],
        id: [null],
        email: [null, [Validators.pattern(ValidatorsEnums.email)]],
        password: [null]
      }),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    };
    switch (this.type) {
      case 'PARTICULIER': {
        Object.assign(defaults, {
          nationalite: [null, [Validators.pattern(ValidatorsEnums.name)]],
          dateExpirePiece: [null],
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
          dateExpirePiece: [null]
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);

    this.form.get('naturePiece')?.valueChanges.subscribe(res => {
      this.form.get('autrePiece').setValue(null);
      if (res && res.trim() !== '') {
        this.form.get('autrePiece').clearValidators();
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
      let data = { ...this.ownerService.getOwner() };
      
      this.f.folderUuid.setValue(data?.folder?.uuid);
      this.telephoneSelected = data?.telephone
      this.telResponsableSelected = data?.telResponsable
      this.contactUrgenceSelected = data?.contactUrgence
      data.dateN = DateHelperService.fromJsonDate(data?.dateN);
      this.form.controls.user.get('email').setValue(data?.email)
      data.dateEmission = DateHelperService.fromJsonDate(data?.dateEmission);
      data.dateExpirePiece = DateHelperService.fromJsonDate(data?.dateExpirePiece);
      this.form.patchValue(data);

      
      console.log(this.form);
    }
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const owner = this.form.getRawValue();
      
      owner.user.password = this.form.value.telephone;
      this.ownerService.add(owner).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'OWNER_UPDATED' : 'OWNER_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
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
    if (this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if (this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if (this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
    }
  }
  loadfile(data) {
    if (data && data !== null) {
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
    if (data && data !== null) {
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
        Object.assign(this.form.value, { [property]: value });
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
    this.fileO = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileO = '';
    this.uploadService.setDataFileByFolder('');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'locataire' }
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    } else {
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
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
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
