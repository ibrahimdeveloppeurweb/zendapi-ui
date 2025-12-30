import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
import { SubFamily } from '@model/sub-family';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-sub-family-add',
  templateUrl: './sub-family-add.component.html',
  styleUrls: ['./sub-family-add.component.scss']
})
export class SubFamilyAddComponent implements OnInit {

  title: string = ""
  type: string = ""
  edit: boolean = false
  subFamily: SubFamily
  form: FormGroup
  submit: boolean = false
  familySelected?: any;
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    private subFamilyService: SubFamilyService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.subFamilyService.edit
    this.subFamily = this.subFamilyService.getSubFamily()
    this.title = (!this.edit) ? "Ajouter une sous-famille" : "Modifier la sous-famille "+this.subFamily.libelle
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      family: [null, [Validators.required]],
      libelle: [null, [Validators.required]]
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.subFamilyService.getSubFamily() }
      this.familySelected = {
        title: data.family.libelle,
        detail: data.family.libelle
      }
      console.log('data.family.uuid',data.family.uuid)
      this.f.family.setValue(data.family.uuid)
      this.form.patchValue(data)
    }
  }
  setFamilyUuid(uuid) {
    if(uuid){
      this.f.family.setValue(uuid);
    } else {
      this.f.family.setValue(null);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const FAMILY = this.form.value;
      this.subFamilyService.add(FAMILY).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'SUBFAMILY_UPDATED' : 'SUBFAMILY_ADD', payload: res?.data});
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
