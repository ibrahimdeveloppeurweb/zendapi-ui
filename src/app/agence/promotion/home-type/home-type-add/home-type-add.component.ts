import { ToastrService } from 'ngx-toastr';
import { HomeType } from '@model/home-type';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-home-type-add',
  templateUrl: './home-type-add.component.html',
  styleUrls: ['./home-type-add.component.scss']
})
export class HomeTypeAddComponent implements OnInit {
  title: string = ""
  edit: boolean = false
  homeType: HomeType
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private homeTypeService: HomeTypeService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.homeTypeService.edit
    this.homeType = this.homeTypeService.getHomeType()
    this.title = (!this.edit) ? "Ajouter un type de maison" : "Modifier un type de maison "+this.homeType.libelle;
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
      description: [null]
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.homeTypeService.getHomeType() }
      this.form.patchValue(data)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.homeTypeService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'HOME_TYPE_UPDATE', payload: res?.data});
          } else {
            this.emitter.emit({action: 'HOME_TYPE_ADD', payload: res?.data});
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
