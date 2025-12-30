import {Invoice} from '@model/invoice';
import {Contract} from '@model/contract';
import {Globals} from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {InvoiceService} from '@service/invoice/invoice.service';
import {ContractService} from '@service/contract/contract.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss']
})
export class InvoiceAddComponent implements OnInit {
  title: string = ""
  form: FormGroup;
  tenantSelected: any;
  submit = false;
  edit = false;
  isLoadingContracts = false;
  required = Globals.required;
  invoice: Invoice;
  contracts: Contract[] = [];
  options = [];
  contract: Contract;
  totalRemise: number = 0;
  totalHt: number = 0;
  totalTtc: number = 0;
  totalTva: number = 0;
  total: number = 0;
  libelle: string = '';

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private  invoiceService: InvoiceService,
    private contractService: ContractService
  )
  {
    this.edit = this.invoiceService.edit;
    this.invoice = this.invoiceService.getInvoice();
    this.title = !this.edit ? "Ajouter d'une facture" : 'Modifier la facture N° '+this.invoice?.code ;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm(): void {
    this.invoiceService.edit = false
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: ['', [Validators.required]],
      date: ['', [Validators.required]],
      echeance: ['', [Validators.required]],
      montant: [0],
      montantHt: [0],
      montantRemise: [0],
      montantTva: [0],
      tenant: [null, [Validators.required]],
      contract: [null, [Validators.required]],
      options: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.invoiceService.getInvoice() }
      this.setTenantUuid(data?.contract.tenant?.uuid);
      this.f.contract.setValue(data?.contract?.uuid)
      this.tenantSelected = {
        photoSrc: data?.contract.tenant?.photoSrc,
        title: data?.contract.tenant?.searchableTitle,
        detail: data?.contract.tenant?.searchableDetail
      };
      this.libelle = data?.contract?.libelle
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.echeance = DateHelperService.fromJsonDate(data?.echeance);
      data?.options.forEach((item) => {
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
      this.form.patchValue(data)
      this.onCalcul()
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
      this.contract = this.contracts.find(item => {
        if (item.uuid === event.target.value) {
          this.f.contract.setValue(item.uuid);
          return item;
        } else {
          this.contracts = [];
          this.f.contract.setValue(null);
        }
      });
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.invoiceService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'INVOICE_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'INVOICE_ADD', payload: res?.data});
          }
        }
      });
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
  onCalcul() {
    let totalRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    this.option.controls.forEach(elem => {
      var remise = elem.value.remise >= 0 ? elem.value.remise : 0
      var totalHt = (elem.value.prix * elem.value.qte) - remise
      var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0
      var totalTtc = totalHt + totalTva
      elem.get('total').setValue(totalTtc);
      totalRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc
    });
    this.totalRemise = totalRemise;
    this.totalHt = totalOptionHT >= 0 ? totalOptionHT : 0;
    this.totalTva = totalOptionTVA >= 0 ? totalOptionTVA : 0;
    this.totalTtc = (totalOptionTTC >= 0) ? totalOptionTTC : 0;
    this.f.montant.setValue(this.totalTtc);
    this.f.montantRemise.setValue(this.totalRemise);
    this.f.montantHt.setValue(this.totalHt);
    this.f.montantTva.setValue(this.totalTva);
  }
  addOption() {
    this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
      })
    );
  }
  onDelete(row) {
    var index = this.option.controls.indexOf(row);
    this.option.controls.splice(index, 1);
    this.onCalcul();
  }
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }
  get f(): any { return this.form.controls; }
  get option(): FormArray { return this.form.get('options') as FormArray; }

}
