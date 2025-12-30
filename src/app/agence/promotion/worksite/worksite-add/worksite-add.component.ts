import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Worksite } from '@model/worksite';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { WorksiteService } from '@service/worksite/worksite.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-worksite-add',
  templateUrl: './worksite-add.component.html',
  styleUrls: ['./worksite-add.component.scss']
})
export class WorksiteAddComponent implements OnInit {

  title: string = ""
  edit: boolean = false
  worksite: Worksite
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private worksiteService: WorksiteService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.worksiteService.edit
    this.worksite = this.worksiteService.getWorksite()
    this.title = (!this.edit) ? "Ajouter un type de maison" : "Modifier un type de chantier "+this. worksite.libelle;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null]
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.worksiteService.getWorksite() }
      this.form.patchValue(data)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.worksiteService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'WORKSITE_UPDATE', payload: res?.data});
          } else {
            this.emitter.emit({action: 'WORKSITE_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
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
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title)
    } else if (type == 'success') {
      this.toastr.success(msg, title)
    } else if (type == 'warning') {
      this.toastr.warning(msg, title)
    } else if (type == 'error') {
      this.toastr.error(msg, title)
    }
  }

  get f() { return this.form.controls; }
}

