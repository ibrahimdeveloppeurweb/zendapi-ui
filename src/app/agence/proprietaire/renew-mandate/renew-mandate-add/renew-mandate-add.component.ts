import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { RenewMandateService } from '@service/renew-mandate/renew-mandate.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { ToastrService } from 'ngx-toastr';
import { MandateService } from '@service/mandate/mandate.service';
import { Mandate } from '@model/mandate';
import { Owner } from '@model/owner';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RenewMandate } from '@model/renew-mandate';

@Component({
  selector: 'app-renew-mandate-add',
  templateUrl: './renew-mandate-add.component.html',
  styleUrls: ['./renew-mandate-add.component.scss']
})
export class RenewMandateAddComponent implements OnInit {
  title: string = '';
  libelle: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit = false;
  renewMandate: RenewMandate;
  mandates: Mandate[] = [];
  mandate: Mandate;
  owners ?: Owner[] = [];
  loading = false;
  ownerSelected: any;
  required = Globals.required;
  taxeRow = [
    {label: 'Propriétaire', value: 'PROPRIETAIRE'},
    {label: 'Agence', value: 'AGENCE'}
  ];
  commissionRow = [
    {label: 'APRES TOUTES LES TAXES', value: 'TAXES'},
    {label: 'SUR LE TOTAL DES LOYERS', value: 'LOYERS'}
  ];
  facturationRow = [
    {label: 'POURCENTAGE DE PAIEMENT', value: 'PRC'},
    {label: 'MONTANT FIXE', value: 'MTN'}
  ]

  constructor(
    public modal: NgbActiveModal,
    private renewMandateService: RenewMandateService,
    private mandateService: MandateService,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService
  ) {
    this.edit = this.renewMandateService.edit;
    this.renewMandate = this.renewMandateService.getRenewMandate();
    this.title = (!this.edit) ? 'Ajouter un renouvellement de mandat' : 'Modifier le renouvellement de mandat N˚' + this.renewMandate?.code;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      owner: [null, [Validators.required]],
      mandate: [null],
      type: [null],
      date: [null, [Validators.required]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      taxe: [null],
      valeur: [0, [Validators.pattern(ValidatorsEnums.number)]],
      commission: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number)]],
      facturation: ['PRC', [Validators.required]],
      taxeCommission: [null],
      montantCom: [0, [Validators.pattern(ValidatorsEnums.number)]],
      total: [0],
      pCommission: [null],
      pMontantCom: [null],
      pValeur: [null],
      pTaxe: [null],
      pTaxeCommission: [null],
      pDateD: [null],
      pDateF: [null],
    });
    this.form.get('facturation').valueChanges.subscribe(val => {
      if (val == 'PRC') {
        this.form.get('commission').setValidators([Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(ValidatorsEnums.number)]);
      } else {
        this.form.get('commission').setValidators([Validators.required, Validators.min(0), Validators.pattern(ValidatorsEnums.number)]);
      }
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.renewMandateService.getRenewMandate() }
      this.setOwnerUuid(data?.mandate.house?.owner?.uuid);
      this.libelle = data?.mandate?.libelle
      this.ownerSelected = {
        photoSrc: data?.mandate.house?.owner?.photoSrc,
        title: data?.mandate.house?.owner?.searchableTitle,
        detail: data?.mandate.house?.owner?.searchableDetail
      };
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.pDateF = DateHelperService.fromJsonDate(data?.pDateF);
      data.pDateD = DateHelperService.fromJsonDate(data?.pDateD);
      data.dateF = DateHelperService.fromJsonDate(data?.dateF);
      data.dateD = DateHelperService.fromJsonDate(data?.dateD);
      this.form.patchValue(data)
      this.f.type.setValue(data?.mandate?.type)
      this.f.mandate.setValue(data?.mandate?.uuid)
    }
  }
  setOwnerUuid(uuid) {
    this.f.owner.setValue(uuid);
    if(!this.edit){
      this.loadMandates();
    }
  }
  loadMandates(){
    this.mandates = [];
    this.f.mandate.setValue(null);
    if (this.f.owner.value) {
      this.loading = true;
      this.mandateService.getList(this.f.owner.value, 'VALIDE').subscribe((res) => {
        this.loading = false;
        this.mandates = res;
      });
    }
  }
  setMandateUuid(event) {
    if (event.target.value !== null) {
      this.mandate = this.mandates.find(item => {
        if (item.uuid === event.target.value) {
          this.f.mandate.setValue(item.uuid);
          item.dateF = DateHelperService.fromJsonDate(item?.dateF);
          item.dateD = DateHelperService.fromJsonDate(item?.dateD);
          this.f.type.setValue(item.type)
          this.f.pTaxe.setValue(item.taxe)
          this.f.pTaxeCommission.setValue(item.taxeCommission)
          this.f.pMontantCom.setValue(item.montantCom)
          this.f.pValeur.setValue(item.valeur)
          this.f.pDateD.setValue(DateHelperService.fromJsonDate(item?.dateD))
          this.f.pDateF.setValue(DateHelperService.fromJsonDate(item?.dateF))
          this.f.pCommission.setValue(item.commission)
          this.f.pValeur.setValue(item.valeur)
          return item;
        }
      });
    }
  }
  onChangeTotal(champ) {
    var total = 0;
    var montantT = 0;
    var commission = 0;
    if (champ === 'commission') {
      total = ((this.f.commission.value < 0 || this.f.commission.value > 100) && this.f.valeur.value >= 0) ? 0 :
      Math.round((this.f.commission.value / 100) * this.f.valeur.value);
      this.f.montantCom.setValue(total);
      this.f.total.setValue(total);
      return
    } else if (champ === 'montantCom' || champ === 'montantCom') {
      if (parseInt(this.f.montantCom.value) >= 0 && parseInt(this.f.valeur.value) >= 0) {
        if (parseFloat(this.f.valeur.value) > 0) {
          commission = this.round((this.f.montantCom.value * 100) / this.f.valeur.value, 2);
          montantT = Math.round(this.f.montantCom.value + this.f.valeur.value);
          this.f.total.setValue(montantT)
        }
      }
      return this.f.commission.setValue(commission);
    } else if (champ === 'valeur') {
      if (parseFloat(this.f.commission.value) >= 0 && parseFloat(this.f.valeur.value) >= 0) {
        try {
          const current = parseFloat(this.f.montantCom.value);
          const should = Math.round((parseFloat(this.f.valeur.value) * parseFloat(this.f.commission.value)) / 100);
          if (current === 0 && isFinite(should)) {
            this.f.montantCom.setValue(should);

          } else {
          }
        } catch (e) {
        }
      }
      if (parseFloat(this.f.montantCom.value) >= 0 && parseFloat(this.f.valeur.value) >= 0) {
        try {
          const montantCom = parseFloat(this.f.montantCom.value);
          const valeur = parseFloat(this.f.valeur.value);
          const should = (montantCom / valeur) * 100;
          this.f.commission.setValue(should);
          montantT = Math.round(montantCom + valeur);
          this.f.total.setValue(montantT);
        } catch (e) {
        }
      } else {
        this.f.commission.setValue(0);
        this.f.montantCom.setValue(0);
      }
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.renewMandateService.add(this.form.value).subscribe( res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'RENEW_MANDATE_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'RENEW_MANDATE_ADD', payload: res?.data});
            }
          }
        },
        error => {
          this.toast(error.message, 'Une erreur a été rencontrée', error.status);
        }
      );
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
  onChangeDate() {
    if (this.f.pDateF.value && this.f.dateF.value && this.f.dateD.value) {
      const compare = DateHelperService.compareNgbDateStruct(this.f.pDateF.value, this.f.dateD.value, 'YYYYMMDD');
      const renewDate = DateHelperService.compareNgbDateStruct(this.f.dateD.value, this.f.dateF.value, 'YYYYMMDD');
      // if (!compare && this.f.pDateF.value && this.f.dateD.value) {
      //   this.toast(
      //     'La Date de fin précédent ne peut être supérieur à la nouvelle Date de début !',
      //     'Attention !',
      //     'warning'
      //   );
      //   this.form.get('dateD').reset();
      // }
      if (!renewDate && this.f.dateD.value && this.f.dateF.value) {
        this.toast(
          'La Date de début ne peut être supérieur à la nouvelle Date de fin !',
          'Attention !',
          'warning'
        );
        this.form.get('dateF').reset();
      }
    }
  }
  round(number: number, decimalPlaces: number) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }
  get f() { return this.form.controls; }
}
