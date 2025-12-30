import { Invoice } from '@model/invoice';
import { ToastrService } from 'ngx-toastr';
import { Contract } from '@model/contract';
import { Terminate } from '@model/terminate';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { InvoiceService } from '@service/invoice/invoice.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { ContractService } from '@service/contract/contract.service';
import { TerminateService } from '@service/terminate/terminate.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-terminate-add',
  templateUrl: './terminate-add.component.html',
  styleUrls: ['./terminate-add.component.scss']
})
export class TerminateAddComponent implements OnInit {
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  step: boolean = false;
  tenantSelected?: any;
  contract?: Contract;
  invoices?: Invoice[];
  totalHT: number = 0;
  totalTva: number = 0;
  totalTTC: number = 0;
  totalDeduire: number = 0;
  totalRemise: number = 0;
  total: number = 0;
  paye: number = 0;
  impaye: number = 0;
  terminate: Terminate;
  required = Globals.required;
  contracts: Contract[] = [];
  loadingC = false;
  global = { country: Globals.country, device: Globals.device }
  retourRow = [
    { label: 'Caution', value: 1 },
    { label: 'Caution CIE / SODECI (25%)', value: 2 }
  ]
  deduireRow = [
    { label: 'Total des impayés', value: 1 },
    { label: 'Etat des lieux', value: 2 }
  ]

  constructor(
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private terminateService: TerminateService,
    private invoiceService: InvoiceService,
    private contractService: ContractService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.terminateService.edit;
    this.terminate = this.terminateService.getTerminate();
    this.title = (!this.edit) ? 'Ajouter une résiliation de contrat' : 'Modifier la résiliation du ' + this.terminate?.contract?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: null,
      tenant: [null],
      contract: [null, [Validators.required]],
      date: [null, [Validators.required]],
      echeance: [null, [Validators.required]],
      montant: [0],
      montantTtc: [0],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      montantRetour: [0, [Validators.required]],
      montantDeduire: [0, [Validators.required]],
      options: this.formBuild.array(this.itemOption()),
      returns: this.formBuild.array([]),
      deducts: this.formBuild.array([]),
    });
  }
  editForm(): void {
    if (this.edit) {
      const data = { ...this.terminateService.getTerminate() };
      data.date = DateHelperService.fromJsonDate(data.date);
      data.echeance = DateHelperService.fromJsonDate(data.invoice.echeance);
      this.contract = data.contract;
      data.contract = data.contract?.uuid;
      this.f.contract.setValue(data.contract);
      this.f.montantDeduire.setValue(data.montantDeduire);
      this.f.montantRetour.setValue(data.montantRetour);
      setTimeout(() => { this.loadInvoices(); }, 1000);
      this.tenantSelected = {
        photoSrc: this.contract?.tenant?.photoSrc,
        title: this.contract?.tenant?.searchableTitle,
        detail: this.contract?.tenant?.searchableDetail
      };
      data?.deducts.forEach((item) => {
        this.deduct.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            libelle: [{ value: item?.libelle, disabled: true }, [Validators.required]],
            prix: [item?.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        )
      });
      data?.returns.forEach((item) => {
        this.return.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            libelle: [{ value: item?.libelle, disabled: true }, [Validators.required]],
            prix: [item?.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        )
      });
      data?.invoice?.options.forEach((item) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            libelle: [item?.libelle, [Validators.required]],
            prix: [item?.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [item?.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item?.tva, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item?.remise, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [{ value: item?.total, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        )
      });
      this.onChangeTotal();
      this.form.patchValue(data);
      this.step = true;
    }
  }
  setTenantUuid(uuid) {
    this.f.tenant.setValue(uuid);
    this.loadContracts();
  }
  setContratUuid(event) {
    let uuid = this.edit ? event : event.target.value
    if (uuid !== null) {
      this.contract = this.contracts.find(item => { if (item.uuid === uuid) { return item; } });
      if(this.contract?.entranceInvoice?.paye >= 0){
        this.loadInvoices();
        this.f.contract.setValue(uuid);
        setTimeout(() => {
          this.return.controls = this.itemRetours()
          this.deduct.controls = this.itemDeduires()
          this.onCalculRetour()
          this.onCalculDeduire()
          this.step = true
        }, 3000);
      } else if (this.contract?.entranceInvoice?.isPay === false) {
        this.step = false
        this.f.contract.setValue(null);
        this.toast(
          "La facture d'entrée de ce contrat n'a jamais fait l'objet de paiement, de quelque façon que se soit.",
          "CONTRAT NON ELIGIBLE",
          "warning"
        );
      }
    }
  }
  loadContracts() {
    this.contracts = [];
    this.f.contract.setValue(null);
    if (this.f.tenant.value) {
      this.loadingC = true;
      this.contractService.getList(this.f.tenant.value, 'ACTIF').subscribe((res) => {
        this.loadingC = false;
        this.contracts = res;
      });
    }
  }
  loadInvoices() {
    this.total = 0
    this.paye = 0
    this.impaye = 0
    this.invoices = [];
    if (this.f.contract.value) {
      this.invoiceService.getList(null, null, this.f.contract.value, 'SOLDE').subscribe((res) => {
        res?.forEach(item => {
          if (item?.type !== 'ENTREE' && item?.type !== 'RESILIATION') {
            this.total += item?.montant
            this.paye += item?.paye
            this.impaye += item?.impaye
            this.invoices.push(item)
          }
        })
      });
      return this.invoices;
    }
  }
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      arr.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          libelle: [null, [Validators.required]],
          prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
          tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          total: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
        })
      );
    }
    return arr;
  }
  itemRetours(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit && this.contract) {
      for (let i = 0; i < this.retourRow.length; i++) {
        var total = 0
        if (this.contract?.entranceInvoice?.options.length > 0) {
          this.contract?.entranceInvoice?.options.find((item) => {
            if (item?.libelle === this.retourRow[i]?.label) {
              total = item?.total
              return total
            }
          })
        }
        var value = this.retourRow[i].value === 1 ? this.contract?.caution : total;
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: this.retourRow[i].label, disabled: true }, [Validators.required]],
            prix: [value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
    }
    return arr;
  }
  itemDeduires(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit && this.contract) {
      for (let i = 0; i < this.deduireRow.length; i++) {
        var value = this.deduireRow[i].value === 1 ? this.impaye : 0;
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: this.deduireRow[i].label, disabled: true }, [Validators.required]],
            prix: [value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
    }
    return arr;
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
    this.totalTTC = totalOptionTTC;
    this.totalDeduire = this.totalTTC + this.f.montantDeduire.value;
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montantTtc.setValue(this.totalTTC);
    this.f.montant.setValue(this.f.montantRetour.value - this.totalDeduire);
  }
  onCalculRetour() {
    var montant = 0;
    this.return.controls?.forEach((item) => {
      montant = montant + item.value.prix
    })
    this.f.montantRetour.setValue(montant)
    this.onChangeTotal()
  }
  onCalculDeduire() {
    var montant = 0;
    this.deduct.controls?.forEach((item) => {
      montant += item.value.prix
    })
    this.f.montantDeduire.setValue(montant)
    this.onChangeTotal()
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      this.terminateService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'TERMINATE_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'TERMINATE_ADD', payload: res?.data });
          }
        }
      }, error => { });
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
  addOptions() {
    this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      })
    );
  }
  onDelete(i) {
    this.option.removeAt(i)
    this.onChangeTotal();
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  toast(msg, title, type) {
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
  get return() { return this.form.get('returns') as FormArray; }
  get deduct() { return this.form.get('deducts') as FormArray; }
}
