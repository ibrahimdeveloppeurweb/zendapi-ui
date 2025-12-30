
import { Ville } from '@model/ville';
import { Country } from '@model/country';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VilleService } from '@service/ville/ville.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { CountryService } from '@service/country/country.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-city-add',
  templateUrl: './city-add.component.html',
  styleUrls: ['./city-add.component.scss']
})
export class CityAddComponent implements OnInit {
  type: string = ""
  title: string = ""
  selected: any
  ville: Ville
  form: FormGroup
  country: Country
  edit: boolean = false
  submit: boolean = false
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private villeService: VilleService,
    private countryService: CountryService
  ) {
    this.edit = this.villeService.edit;
    this.ville = this.villeService.getVille();
    this.title = (!this.edit) ? 'Ajouter une ville' : 'Modifier la ville ' + this.ville?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      country: [null, [Validators.required]],
      libelle: [null, [Validators.required]]
    })
  }
  editForm() {
    if (this.edit) {
      let data = { ...this.villeService.getVille() }
      this.form.patchValue(data);
      let country = data?.country ? data?.country : null
      console.log(data);
      this.selected = {
        title: country ? country?.nom : null,
        detail: country ? country?.indicatif : null,
      }
      this.f.country.setValue(country ? country?.uuid : null); 
    }
  }
  setCountryUuid(uuid) {
    if (uuid) {
      this.f.country.setValue(uuid)
    } else {
      this.f.country.setValue(null)
      this.selected = null
    }
  }
  setCityUuid(uuid) {
    if (uuid) {
      this.f.city.setValue(uuid)
    } else {
      this.f.city.setValue(null)
      this.selected = null
    }
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.villeService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({ action: 'CITY_UPDATED', payload: res?.data });
            } else {
              this.emitter.emit({ action: 'CITY_ADD', payload: res?.data });
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
