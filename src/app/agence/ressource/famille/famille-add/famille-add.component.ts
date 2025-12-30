import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Famille } from '@model/famille';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FamilleService } from '@service/famille/famille.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-famille-add',
  templateUrl: './famille-add.component.html',
  styleUrls: ['./famille-add.component.scss']
})
export class FamilleAddComponent implements OnInit {
  title: string = ""
  type: string = ""
  edit: boolean = false
  famille: Famille
  form: FormGroup
  submit: boolean = false
  required = Globals.required;
  code: string = null

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private familleService: FamilleService
  ) {
    this.edit = this.familleService.edit
    this.famille = this.familleService.getFamille()
    this.title = (!this.edit) ? "Ajouter une famille de ressource" : "Modifier la famille de ressource"+this.famille.libelle
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      preCode: [null, [Validators.required]],
      postCode: [null, [Validators.required]],
      code: [null, [Validators.required]]
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.familleService.getFamille() }
      this.form.patchValue(data)
      this.f.preCode.setValue(data.codification)
      const codification = data.codification.split('-');
      this.f.preCode.setValue(codification[0])
      this.f.postCode.setValue(codification[1])
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
      this.f.preCode.setValue(input.value.toUpperCase().slice(0, 5)+ "-")
  }
  onInputChangePostCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.f.code.setValue(this.f.preCode.value+input.value.toUpperCase())
  }
  onSubmit() {
    this.submit = true;
    this.f.code.setValue(this.f.preCode.value+this.f.postCode.value.toUpperCase())
    if (this.form.valid) {
      const form = this.form.value;
      this.familleService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'FAMILLE_UPDATED' : 'FAMILLE_ADD', payload: res?.data});
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
