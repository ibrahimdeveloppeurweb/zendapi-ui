import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from '@model/contract';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ContractService } from '@service/contract/contract.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-contract-upload',
  templateUrl: './contract-upload.component.html',
  styleUrls: ['./contract-upload.component.scss']
})
export class ContractUploadComponent implements OnInit {
  form: FormGroup;
  edit = false;
  submit = false;
  contract: Contract;
  title = "Ajouter un contrat signé";

  constructor(
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    public contractService: ContractService,
  ) {
    this.contract = this.contractService.getContract()
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['CONTRACT'],
      folderUuid: [this.contract ? this.contract?.signed?.uuid : null],
      contract: [this.contract.uuid],
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
      this.contractService.signed(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'CONTRACT_UPLOAD_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'CONTRACT_UPLOAD_ADD', payload: res?.data });
          }
        }
      }, error => { });
    } else {
      return;
    }
  }
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
