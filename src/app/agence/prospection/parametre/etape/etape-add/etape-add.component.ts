import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Etape } from '@model/etape';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { EtapeService } from '@service/etape/etape.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-etape-add',
  templateUrl: './etape-add.component.html',
  styleUrls: ['./etape-add.component.scss']
})
export class EtapeAddComponent implements OnInit {
  title: string = ""
  type: string = ""
  edit: boolean = false
  etape: Etape
  form: FormGroup
  submit: boolean = false
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private etapeService: EtapeService
  ) {
    this.edit = this.etapeService.edit
    this.etape = this.etapeService.getEtape()
    this.title = (!this.edit) ? "Ajouter une etape" : "Modifier l'etape "+this.etape.libelle
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
      const data = { ...this.etapeService.getEtape() }
      this.form.patchValue(data)
    }
    console.log(this.form.getRawValue())
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.etapeService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'ETAPE_UPDATED' : 'ETAPE_ADD', payload: res?.data});
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
