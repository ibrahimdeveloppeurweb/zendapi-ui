import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { OffreTypeService } from '@service/offre-type/offre-type.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-offre-type-add',
  templateUrl: './offre-type-add.component.html',
  styleUrls: ['./offre-type-add.component.scss']
})
export class OffreTypeAddComponent implements OnInit {

  title = null;
  type = '';
  edit: boolean = false;
  offreType: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  professionnelleRow = [
    { label: 'Agent de l\'Etat', value: 'Agent de l\'Etat' },
    { label: 'Agent(e) du secteur privé', value: 'Agent(e) du secteur privé' },
    { label: 'Artisan(e)', value: 'Artisan(e)' },
    { label: 'Agriculteur', value: 'Agriculteur' },
    { label: 'Profession libérale', value: 'Profession libérale' },
    { label: 'Commerçant(e)', value: 'Commerçant(e)' },
    { label: 'Autre, à préciser', value: 'Autre, à préciser' },
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public offreTypeService: OffreTypeService,
    public uploadService: UploaderService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) { 
    this.edit = this.offreTypeService.edit;
    this.type = this.offreTypeService.type;
    this.offreType = this.offreTypeService.getOffreType();
    this.title = (!this.edit) ? 'Ajouter un type d\'offre' : 'Modifier le type d\'offre ' + this.offreType.nom;
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      libelle: [null, [Validators.required]],
      description: [null],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),  
    })
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
  
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.offreTypeService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'TYPE_OFFRE_UPDATED' : 'TYPE_OFFRE_ADD', payload: res?.data });
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
  
  onClose() {
      this.form.reset()
      this.modal.close('ferme');
  }
  onReset() {
      this.form.reset()
  }
  
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }



}
