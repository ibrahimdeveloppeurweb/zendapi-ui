import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@service/customer/customer.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { RendService } from '@service/rdv/rend.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rdv',
  templateUrl: './rdv.component.html',
  styleUrls: ['./rdv.component.scss']
})
export class RdvComponent implements OnInit {

  title = null;
  type = '';
  edit: boolean = false;
  rend: any;
  customer: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private rendService: RendService,
    private customerService: CustomerService
  ) {
    this.edit = this.rendService.edit;
    this.customer = this.customerService.uuid;
    this.title = 'Programmer un rendez-vous';
    this.newForm()
   }

  ngOnInit(): void {
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      motif: [null, [Validators.required]],
      lieu: [null, [Validators.required]],
      date: [null, [Validators.required]],
      heure: [null, [Validators.required]],
      customer: [this.customer, [Validators.required]],
      description: [null],
    })
  }

  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.rendService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'RDV_UPDATED' : 'RDV_ADD', payload: res?.data });
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
