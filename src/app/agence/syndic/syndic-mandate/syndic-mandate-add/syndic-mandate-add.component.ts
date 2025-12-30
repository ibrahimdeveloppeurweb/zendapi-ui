import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-syndic-mandate-add',
  templateUrl: './syndic-mandate-add.component.html',
  styleUrls: ['./syndic-mandate-add.component.scss']
})
export class SyndicMandateAddComponent implements OnInit {

  form: FormGroup
  edit: boolean = false
  mandat: any
  title: string = ''
  currentSyndic: any
  submit: boolean = false
  periodicites = [
    { label: 'Mensuel', value: 'MENSUEL' },
    { label: 'Trimestriel', value: 'TRIMESTRIEL' },
    { label: 'Annuel', value: 'ANNUEL' },
  ]
  tantiemes = [
    { label: 'Tantième', value: 'TANTIEME' },
    { label: 'Millième', value: 'MILLIEME' },
  ]

  honoraires = [
    { label: 'Pourcentage sur le budget', value: 'BUDGET' },
    { label: 'Montant', value: 'MONTANT' },
  ]
  agency = Globals.user.agencyKey
  years = []
  currentYear: any;
  contactInterSelected: any
  labelValeur: string = 'Montant'
  defaultAnnee: number
  syndics: any[] = []

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private syndicService: SyndicService,
    private mandateService: MandateSyndicService
  ) {
    this.edit = this.mandateService.edit
    this.mandat = this.mandateService.getMandat()
    const code = this.mandat ? this.mandat?.code : null
    this.title = (!this.edit) ? 'Ajouter un nouveau mandat' : 'Modifier le mandat ' + code;
    this.date()
    this.getListSyndic()
    this.currentYear = new Date().getFullYear();
    this.newForm()
    if(this.mandateService.type === 'SYNDIC'){
      this.f.syndic.setValue(this.mandateService.uuidSyndic)
      this.mandateService.type = null
      this.mandateService.uuidSyndic = null
    }
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      syndic: [null, [Validators.required]],
      honoraire: [0, [Validators.required]],
      periodicite: [null, [Validators.required]],
      tantiemeType: [null],
      tantiemeValue: [0],
      date: [null, [Validators.required]],
      intermediaire: [null],
      contactInter: [null],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      anneeEx: [this.currentYear, [Validators.required]],
      valeur: [null]
    })
  }

  editForm() {
    if (this.edit) {
      const data = { ...this.mandateService.getMandat() };
      this.form.patchValue(data);
      this.currentSyndic = {
        title: data.trustee ? data.trustee.nom : null,
        detail: data.trustee ? data.trustee.nom : null
      }

      data.trustee = data.trustee ? data.trustee.uuid : null
      this.f.syndic.setValue(data.trustee)
      this.f.honoraire.setValue(data.typeHonoraire)
      this.f.valeur.setValue(data.honoraires)

      data.date = DateHelperService.fromJsonDate(data?.date);
      data.dateD = DateHelperService.fromJsonDate(data?.dateD);
      data.dateF = DateHelperService.fromJsonDate(data?.dateF);

      this.f.date.setValue(data.date)
      this.f.dateD.setValue(data.dateD)
      this.f.dateF.setValue(data.dateF)
    }
  }

  getListSyndic(){
    this.syndicService.getList(null).subscribe((res : any) => {
      return this.syndics = res
    })
  }

  date() {
    const startYear = 2000;
    const currentYear = 2090;
    const currentYearValue = new Date().getFullYear();
    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);

    if (year === currentYearValue) {
      this.defaultAnnee = year;
    }
    }
  }

  onChange(value) {
    if (value === 'BUDGET') {
      this.labelValeur = 'Pourcentage de budget (%)'
    } else if (value === 'MONTANT') {
      this.labelValeur = 'Montant'
    }
  }

  setContact(event, type: string) {
    let value = null;
    if (type === 'contactInter') {
      value = this.form.get('contactInter').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'contactInter') {
      this.form.get('contactInter').setValue(valeur)
    }
  }

  setDateFin() {
    if(this.f.dateD.value >= this.f.dateF.value){
      Swal.fire(
        'Attention',
        'La date de début du mandat doit être inférieure à la date de fin du mandat',
        'warning'
      )
      this.f.dateF.reset()
    }
  }

  onSubmit() {
    this.submit = true
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue()
      this.mandateService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          this.modal.close('MANDAT');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'MANDAT_SYNDIC_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'MANDAT_SYNDIC_ADD', payload: res?.data });
          }
        }
        this.emitter.stopLoading();
      })
    }
  }

  onValidate() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous valider ce mandat ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.mandateService.validate(this.mandat.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.emitter.emit({ action: 'MANDAT_SYNDIC_UPDATED', payload: res?.data });
            this.modal.close('ferme');
          }
        })
      }
    });
  }

  setSyndicUuid(uuid) {
    if (uuid) {
      this.f.syndic.setValue(uuid)
    } else {
      this.f.syndic.setValue(null)
    }
  }

  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }

  get f(): any { return this.form.controls; }

}
