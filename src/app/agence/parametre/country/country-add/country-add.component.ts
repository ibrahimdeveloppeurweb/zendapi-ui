import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '@model/country';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-country-add',
  templateUrl: './country-add.component.html',
  styleUrls: ['./country-add.component.scss']
})
export class CountryAddComponent implements OnInit {
  title: string = null;
  edit: boolean = false;
  country: Country;
  form: FormGroup;
  submit: boolean = false;
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private countryService: CountryService
  ) {
    this.edit = this.countryService.edit;
    this.country = this.countryService.getCountry();
    this.title = (!this.edit) ? 'Ajouter un pays' : 'Modifier un pays ' + this.country?.nom;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      libelle: [null, [Validators.required]],
    })
  }

  editForm() {
    if (this.edit) {
      let data = {...this.countryService.getCountry()};
      this.form.patchValue(data);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.countryService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'COUNTRY_UPDATED' : 'COUNTRY_ADD', payload: res?.data});
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
    this.form.reset();
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
  get f(): any { return this.form.controls; }

}
