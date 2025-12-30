import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { ShortContract } from '@model/short-contract';
import { ExtendContract } from '@model/extend-contract';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import { ExtendContractService } from '@service/extend-contract/extend-contract.service';

@Component({
  selector: 'app-extend-add',
  templateUrl: './extend-add.component.html',
  styleUrls: ['./extend-add.component.scss']
})
export class ExtendAddComponent implements OnInit {
  montant: number = 0;
  totalHT: number = 0;
  totalTva: number = 0;
  totalTTC: number = 0;
  tempsValue: number = 0;
  totalRemise: number = 0;
  title = "";
  edit = false;
  submit = false;
  form: FormGroup;
  tenantSelected: any;
  extend: ExtendContract;
  contract: ShortContract;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private extendService: ExtendContractService,
    private contractService: ShortContractService,
  ) {
    this.edit = this.extendService.edit;
    this.extend = this.extendService.getExtend();
    if(!this.edit) {
      this.contract = this.contractService.getShortContract();
    } else {
      this.contract = this.extend.contract;
    }
    this.title = (!this.edit) ? 'Prolongement du contrat '+this.contract.libelle : 'Modifier le prolongement du contrat ' + this.extend?.contract?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
    this.tenantSelected = {
      photoSrc: this.contract.tenant?.photoSrc,
      title: this.contract.tenant?.searchableTitle,
      detail: this.contract.tenant?.searchableDetail
    };
  }

  newForm(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      tenant: [this.contract.tenant.uuid],
      contract: [this.contract.uuid],
      dateFinN: [null, [Validators.required]],
      dateFinP: [this.contract.dateFin],
      montantContrat: [this.contract.montant],
      nbrJour: [null],
      echeance: [null],
      date: [null],
      nbrHeure: [null],
      montantN: [null],
      montant: [0],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      options: this.formBuild.array([]),
    });
  }
  editForm(): void {
    if (this.edit) {
      const data = {...this.extendService.getExtend()};
      this.setTenantUuid(data?.contract.tenant?.uuid);
      this.f.contract.setValue(data?.contract?.uuid)
      this.tenantSelected = {
        photoSrc: data?.contract.tenant?.photoSrc,
        title: data?.contract.tenant?.searchableTitle,
        detail: data?.contract.tenant?.searchableDetail
      };
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.echeance = DateHelperService.fromJsonDate(data?.echeance);
      data.dateFinP = DateHelperService.getFormatGeneralDateTime(data.dateFinP);
      data.dateFinN = DateHelperService.getFormatGeneralDateTime(data.dateFinN);
      data?.invoice?.options.forEach((item) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [{value: item.qte, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [{value: item.total, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      });
      this.form.patchValue(data);
    }
  }
  setTenantUuid(uuid): void {
    this.f.tenant.setValue(uuid);
    if (!this.edit) {
    }
  }
  onAddOption() {
    return this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      })
    );
  }
  onDeleteOption(row) {
    const index = this.option.controls.indexOf(row);
    this.option.controls.splice(index, 1);
    this.onChangeTotal();
  }
  onChangeDate() {
    let nbrJour = 0;
    let nbrHeure = 0;
    let newNbrJour = 0;
    let newNbrHeure = 0;
    if (this.contract.dateEntr && this.f.dateFinN?.value) {
      const compare = DateHelperService.compareNgbDateStruct(this.contract.dateEntr, this.f.dateFinN.value, 'YYYYMMDD');
      if (!compare && this.contract.dateEntr && this.f.dateFinN.value) {
        this.toast(
          'La date de fin de contrat ne peut être supérieur à la nouvelle date de fin !',
          'Attention !',
          'warning'
        );
        this.form.get('dateFinN').reset();
      } else {
        nbrJour = this.onCalculNbreJour(this.contract.dateEntr, this.f.dateFinN.value);
        nbrHeure = this.onCalculNbreHeure(this.contract.dateEntr, this.f.dateFinN.value);
        newNbrJour = nbrJour + this.contract.nbr
        newNbrHeure = nbrHeure + this.contract.nbr
      }
      if(this.contract.type === "HORAIRE") {
        this.option.clear();
        this.f.nbrJour.setValue(null);
        this.f.nbrHeure.setValue(newNbrHeure)

        this.option.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: ['Locative '+this.contract.rental.porte, [Validators.required]],
            prix: [this.contract.montant, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [nbrHeure, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [nbrHeure * this.contract.montant, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      } else if(this.contract.type === "JOURNALIER") {
        this.option.clear();
        this.f.nbrHeure.setValue(null);
        this.f.nbrJour.setValue(newNbrJour);

        this.option.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: ['Locative '+this.contract.rental.porte, [Validators.required]],
            prix: [this.contract.montant, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [nbrJour, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [nbrJour * this.contract.montant, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
      this.onChangeTotal();
    }
  }
  onCalculNbreJour(startDate, endDate) {
    var dateD = moment(startDate); //todays date
    var dateF = moment(endDate); //another date
    var duration = moment.duration(dateF.diff(dateD));
    var days = duration.asDays();
    return Math.round(days);
  }
  onCalculNbreHeure(start: string, end: string): number {
    const startDate = moment(start);
    const endDate = moment(end);
    const duration = moment.duration(endDate.diff(startDate));
    return Math.round(duration.asHours());
  }
  onChangeTotal() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    this.option.controls.forEach(elem => {
      var remise = elem.value.remise >= 0 ? elem.value.remise : 0
      var totalHt = (elem.value.prix * elem.value.qte) - remise
      var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0
      var totalTtc = totalHt + totalTva
      elem.get('total').setValue(totalTtc);
      totalOptionRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc
    });

    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalTTC = totalOptionTTC + this.contract.montant;
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
    this.f.montantN.setValue(this.totalTTC + this.contract.montant);
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
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.extendService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'EXTEND_CONTRACT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'EXTEND_CONTRACT_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
    }
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

  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }
}
