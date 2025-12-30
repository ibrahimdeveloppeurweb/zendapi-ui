import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inventory } from '@model/inventory';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { InventoryService } from '@service/inventory/inventory.service';
import { UploaderService } from '@service/uploader/uploader.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-inventory-upload',
  templateUrl: './inventory-upload.component.html',
  styleUrls: ['./inventory-upload.component.scss']
})
export class InventoryUploadComponent implements OnInit {

  form: FormGroup;
  edit = false;
  submit = false;
  inventory: Inventory;
  title = "Ajouter un état des lieux signé";

  constructor(
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private inventoryService: InventoryService,
  ) {
    this.inventory = this.inventoryService.getInventory()
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      folderUuid: [this.inventory ? this.inventory?.signed?.uuid : null],
      inventory: [this.inventory?.uuid],
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
      this.inventoryService.signed(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'INVENTORY_UPLOAD_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'INVENTORY_UPLOAD_ADD', payload: res?.data });
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
