
import {Renew} from '@model/renew';
import {ToastrService} from 'ngx-toastr';
import {Contract} from '@model/contract';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RenewService} from '@service/renew/renew.service';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {ContractService} from '@service/contract/contract.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-renew-contract-add',
  templateUrl: './renew-contract-add.component.html',
  styleUrls: ['./renew-contract-add.component.scss']
})
export class RenewContractAddComponent implements OnInit {
  title: string = "";
  form: FormGroup;
  submit = false;
  edit = false;
  tenantSelected: any;
  contracts: Contract[] = [];
  contract: Contract;
  renew: Renew;
  options = [];
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  libelle: string = ""
  isLoadingContracts = false;
  required = Globals.required;
  libelleRow = [
    // { label: 'Frais de dossier (10% non remboursable)', value: 10},
    // { label: 'Frais de renouvellement', value: 0},
    { label: 'Honoraire agence', value: 10},
    { label: 'Impôts', value: 0},
  ]
  limiteRow = []
  dayRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private renewService: RenewService,
    private contractService: ContractService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.renewService.edit;
    this.renew = this.renewService.getRenew();
    this.dayRow.map((x) => { this.limiteRow.push({label: "Le "+ x +" du mois", value: x}) })
    this.title = !this.edit ? "Ajouter un renouvellement" : 'Modifier le renouvellement N° '+this.renew?.code ;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm(): void {
    this.renewService.edit = false
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      tenant: [null, [Validators.required]],
      contract: [null, [Validators.required]],
      pCharge: [0, [Validators.min(0)]],
      pLoyer: [0, [Validators.min(0)]],
      pDatefin: [null, [Validators.required]],
      pPrcRetard: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      pLimite: [1, [Validators.required, Validators.min(0)]],
      loyer: [0, [Validators.required, Validators.min(0)]],
      etat: [0],
      charge: [0, [Validators.required, Validators.min(0)]],
      date: [null, [Validators.required, Validators.min(0)]],
      dateFin: [null, [Validators.required]],
      prcRetard: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      limite: [1, [Validators.required]],
      montant: [0],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      options: this.formBuild.array(this.edit ? [] : this.itemOption() ),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.renewService.getRenew() }
      this.setTenantUuid(data?.contract.tenant?.uuid);
      this.f.contract.setValue(data?.contract?.uuid)
      this.libelle = data?.contract?.libelle
      this.tenantSelected = {
        photoSrc: data?.contract.tenant?.photoSrc,
        title: data?.contract.tenant?.searchableTitle,
        detail: data?.contract.tenant?.searchableDetail
      };
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.pDateFin = DateHelperService.fromJsonDate(data?.pDateFin);
      data.dateFin = DateHelperService.fromJsonDate(data?.dateFin);
      data?.invoice?.options.forEach((item) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [{value: item.total, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      });
      this.form.patchValue(data);
      this.form.controls.pDatefin.setValue(data.pDateFin);
      this.onChangeTotal();
    }
  }
  setTenantUuid(uuid): void {
    this.f.tenant.setValue(uuid);
    if (!this.edit) {
      this.loadContracts();
    }
  }
  loadContracts(): void {
    this.contracts = [];
    this.f.contract.setValue(null);
    if (this.f.tenant.value) {
      this.isLoadingContracts = true;
      this.contractService.getList(this.f.tenant.value, 'ACTIF').subscribe((res) => {
        this.isLoadingContracts = false;
        this.contracts = res;
      });
    }
  }
  setContratUuid(event) {
    if (event.target.value !== null) {
      this.contract = this.contracts.find(item => { return item.uuid === event.target.value });
      if (this.contract) {
        const data = {...this.contract};
        console.log(data)
        this.f.contract.setValue(this.contract?.uuid);
        data.loyer = data?.rental?.montant;
        data.charge = data?.rental?.charge;
        data.dateFin = DateHelperService.fromJsonDate(data?.dateFin);
        this.f.pLoyer.setValue(data?.rental?.montant);
        this.f.pCharge.setValue(data?.rental?.charge);
        this.f.pLimite.setValue(data?.limite);
        this.f.pPrcRetard.setValue(data?.prcRetard);
        this.f.pDatefin.setValue(data?.dateFin);
        this.form.patchValue(data);
        console.log(this.option.controls)
        this.calculDefaultFees()
      } else {
        this.contracts = [];
        this.f.contract.setValue(null);
      }
      this.f.uuid.setValue(null)
    }
  }
  calculDefaultFees() {
    this.option.controls.forEach((option) => {
      let libelle = option.get('libelle').value
      if (libelle === 'Impôts') {
        console.log(this.contract)
        if (this.contract && this.contract.type === 'COMMERCIAL') {
          option.get('prix').setValue(((this.contract.loyer * 12) * 2.5))
        }
        if (this.contract && this.contract.type === 'HABITATION') {
          if (this.contract.loyer < 500000) {
            option.get('prix').setValue(18000)
          }

          if (this.contract.loyer >= 500000) {
            option.get('prix').setValue(((this.contract.loyer * 12) * 2.5))
          }
        }
      }

      if (libelle === 'Honoraire agence') {
        option.get('prix').setValue(((this.contract.loyer * this.contract.commission) / 100))
      }
    })
    this.onChangeTotal()
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.renewService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'RENEW_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'RENEW_ADD', payload: res?.data});
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
  onChangeDate() {
    if (this.f.dateFin?.value && this.f.pDatefin?.value) {
      const compare = DateHelperService.compareNgbDateStruct(this.f.pDatefin.value, this.f.dateFin.value, 'YYYYMMDD');
      if (!compare && this.f.pDatefin.value && this.f.dateFin.value) {
        this.toast(
          'La Date de fin precedent ne peut être supérieur à la nouvelle Date de fin !',
          'Attention !',
          'warning'
        );
        this.form.get('dateFin').reset();
      }
    }
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
    this.totalTTC = totalOptionHT + totalOptionTVA + totalOptionRemise;
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
  }

  itemOption(): FormGroup[] {
    const arr: any[] = [];
      for(let i = 0; i < this.libelleRow.length; i++){
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{value: this.libelleRow[i].label, disabled: true}, [Validators.required]],
            prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
    return arr;
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
  date(value){ return DateHelperService.readableMonth(value); }

  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }

}
