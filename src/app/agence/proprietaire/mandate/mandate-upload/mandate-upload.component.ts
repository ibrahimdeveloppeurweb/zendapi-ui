import { Mandate } from '@model/mandate';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MandateService } from '../../../../service/mandate/mandate.service';
import { EmitterService } from '../../../../service/emitter/emitter.service';
import { UploaderService } from '../../../../service/uploader/uploader.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mandate-upload',
  templateUrl: './mandate-upload.component.html',
  styleUrls: ['./mandate-upload.component.scss']
})
export class MandateUploadComponent implements OnInit {
  form: FormGroup;
  submit = false;
  edit = false;
  title = "Ajout du mandat signé"
  mandate: Mandate

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public mandateService: MandateService,
    public uploadService: UploaderService,
    private emitter: EmitterService,
    public toastr: ToastrService,
  ) {
    this.mandate = this.mandateService.getMandate()
    this.newForm();
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['MANDAT'],
      folderUuid: [this.mandate ? this.mandate?.signed?.uuid : null],
      mandate: [this.mandate.uuid],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
  }
  loadfile(data) {
    if (data && data !== null) {
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
    if (this.form.valid) {
      const data = this.form.getRawValue()
      this.mandateService.signed(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'MANDATE_UPLOAD_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'MANDATE_UPLOAD_ADD', payload: res?.data });
          }
        }
      }, error => { });
    } else {
      return;
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
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}

