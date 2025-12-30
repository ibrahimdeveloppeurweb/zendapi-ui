import { Ville } from '@model/ville';
import { Common } from '@model/common';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VilleService } from '@service/ville/ville.service';
import { CommonService } from '@service/common/common.service'
import { EmitterService } from '@service/emitter/emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-common-add',
  templateUrl: './common-add.component.html',
  styleUrls: ['./common-add.component.scss']
})
export class CommonAddComponent implements OnInit {
  selected: any
  ville: Ville
  common: Common
  form: FormGroup
  cities: Ville[]
  citySelected: any
  commons: Common[];
  type: string = ""
  title: string = ""
  edit: boolean = false
  submit: boolean = false
  required = Globals.required;
  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private villeService: VilleService,
    private commonService: CommonService
  ) {
    this.edit = this.commonService.edit;
    this.common = this.commonService.getCommon();
    this.title = (!this.edit) ? 'Ajouter une commune' : 'Modifier la commune ' + this.common?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      city: [null, [Validators.required]],
      country: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
    })
  }

  editForm() {
    if (this.edit) {
      let data = { ...this.commonService.getCommon() };
      console.log(data);
      this.form.patchValue(data);

      let country = data?.city ? data?.city?.country : null
      console.log(country);
      this.selected = {
        title: country ? country?.nom : null,
        detail: country ? country?.indicatif : null,
      }
      this.loadCitys(country?.uuid)
  
      this.f.country.setValue(country ? country?.uuid : null); 
      this.f.city.setValue(data?.city ? data?.city?.uuid : null) 
      
    }
  }
  setCountryUuid(uuid) {
    if (uuid) {
      this.f.country.setValue(uuid)
      this.loadCitys(uuid)

    } else {
      this.f.country.setValue(null)
      this.selected = null
    }
  }
  loadCitys(country) {
    this.villeService.getList(country).subscribe(res => {
      this.cities = res;
      return this.cities;
    }, error => { });
    this.form.get('libelle').reset();
  }
  setCityUuid($event) {
    console.log($event);
    const value= $event.target.value;
    if (value) {
      this.f.city.setValue(value)
      this.loadCommons(value)
      console.log(this.loadCommons(value));

    } else {
      this.f.city.setValue(null)
      this.selected = null
      this.commons = []

    }
  }
  loadCommons(city) {
    this.commonService.getList(city).subscribe(res => {
      this.commons = res;
      return this.commons;
    }, error => { });
    this.form.get('libelle').reset();
  }
  
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.commonService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({ action: 'COMMON_UPDATED', payload: res?.data });
            } else {
              this.emitter.emit({ action: 'COMMON_ADD', payload: res?.data });
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

