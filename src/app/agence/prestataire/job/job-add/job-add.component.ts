import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '@service/job/job.service';
import { Job } from '@model/prestataire/job';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-job-add',
  templateUrl: './job-add.component.html',
  styleUrls: ['./job-add.component.scss']
})
export class JobAddComponent implements OnInit {

  title: string = ""
  type: string = ""
  edit: boolean = false
  job: Job
  form: FormGroup
  submit: boolean = false
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    private jobService: JobService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.jobService.edit
    this.job = this.jobService.getJob()
    this.title = (!this.edit) ? "Ajouter une famille" : "Modifier la famille "+this.job.libelle
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]]
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.jobService.getJob() }
      this.form.patchValue(data)
    }
  }
  onSubmit() {
    this.submit = true;
    console.log('jrjrr',this.form.valid)
    if (this.form.valid) {
      const PRODUCT = this.form.value;
      this.jobService.add(PRODUCT).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'PRODUCT_UPDATED' : 'PRODUCT_ADD', payload: res?.data});
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
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
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

}
