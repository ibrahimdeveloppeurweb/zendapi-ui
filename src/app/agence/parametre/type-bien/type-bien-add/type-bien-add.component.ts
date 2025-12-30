
import { TypeBien } from '@model/type-bien';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeBienService } from '@service/type-bien/type-bien.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-type-bien-add',
  templateUrl: './type-bien-add.component.html',
  styleUrls: ['./type-bien-add.component.scss']
})
export class TypeBienAddComponent implements OnInit {
  type: string = ""
  title: string = ""
  selected: any
  form: FormGroup
  typeBien: TypeBien
  edit: boolean = false
  submit: boolean = false
  required = Globals.required;

  typeRow = [
      { label: 'VENTE', value: 'VENTE' },
      { label: 'LOCATION', value: 'LOCATION' }
    ];

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private typeBienService: TypeBienService,
  ) {
    this.edit = this.typeBienService.edit;
    this.typeBien = this.typeBienService.getTyepBien();
    this.title = (!this.edit) ? 'Ajouter un type de bien' : 'Modifier le type de bien ' + this.typeBien?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      description: [null] 
      
    })
  }
  editForm() {
    if (this.edit) {
      let data = { ...this.typeBienService.getTyepBien() }
      this.form.patchValue(data);
      console.log(data);
    
    }
  }
 
 

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.typeBienService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({ action: 'TYPE_BIEN_UPDATED', payload: res?.data });
            } else {
              this.emitter.emit({ action: 'TYPE_BIEN_ADD', payload: res?.data });
            }
            
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

  onClose() {
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
