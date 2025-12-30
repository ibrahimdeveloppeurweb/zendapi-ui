import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Confirmation } from '@model/confirmation';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { ConfirmationService } from '@service/confirmation/confirmation.service';
import { PaymentService } from '@service/payment/payment.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { SupplyService } from '@service/supply/supply.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-confirmation-add',
  templateUrl: './confirmation-add.component.html',
  styleUrls: ['./confirmation-add.component.scss']
})
export class ConfirmationAddComponent implements OnInit {
  title: string = ""
  edit: boolean = false
  isHidden: boolean = false
  confirmation: Confirmation
  payments: any[]
  form: FormGroup
  submit: boolean = false
  required = Globals.required;
  typeRow = [
    { label: "PAIEMENT LOCATAIRE", value: "LOCATAIRE" },
    { label: "PAIEMENT CLIENT", value: "CLIENT" }
  ]
  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public supplyService: SupplyService,
    public paymentService: PaymentService,
    public treasuryService: TreasuryService,
    public paymentCustomerService: PaymentCustomerService,
    public confirmationService: ConfirmationService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private emitter: EmitterService

  ) {
    this.edit = this.confirmationService.edit
    this.confirmation = this.confirmationService.getConfirmation()
    this.title = (!this.edit) ? "Ajouter une confirmation" : "Modifier la confirmation de " + this.confirmation?.code
    this.newForm()
    this.f.treasury.setValue(this.confirmationService.treausry)
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      user: [null],
      treasury: [null, Validators.required],
      type: ['LOCATAIRE', Validators.required],
      dateD: [null],
      dateF: [null],
      mode: [null],
      options: this.formBuild.array(this.itemOption()),
    });
  }
  onLoadPayment(){
    this.option.clear()
    if(this.f.type.value !== null){
      this.treasuryService.getSingle(this.confirmationService.treausry).subscribe((res: any) => {
        if (res) {
          this.loadMode(res)
          this.isHidden = false
          if(this.f.type.value === 'LOCATAIRE'){
            this.paymentService.getList(null, this.f.dateD.value, this.f.dateF.value, null, res?.type, this.f.user.value).subscribe(res => {
              this.payments = res ? res : [];
              if(this.payments){
                this.option.controls = this.itemOption()
              }
            }, error => {});
          }
          if(this.f.type.value === 'CLIENT'){
            this.paymentCustomerService.getList(null, this.f.dateD.value, this.f.dateF.value, null, res?.type, this.f.user.value).subscribe(res => {
              this.payments = res ? res : [];
              if(this.payments){
                this.option.controls = this.itemOption()
              }
            }, error => {});
          }
        }
      });
    }
  }
  itemOption(): FormGroup[] {
    var arr: any[] = []
    if(this.payments && this.payments.length > 0){
      if (this.f.type.value === 'LOCATAIRE') {
        this.payments.forEach((item) =>{
          arr.push(
            this.formBuild.group({
              uuid: [item.uuid],
              checked: [false],
              entity: [{value: item?.invoice?.contract ? item?.invoice?.contract?.tenant?.searchableTitle : item?.invoice?.short?.tenant?.searchableTitle, disabled: true}],
              libelle: [{value: item?.invoice?.libelle, disabled: true}],
              montant: [{value: item?.montant, disabled: true}],
              mode: [{value: item?.mode, disabled: true}],
            })
          )
        })
      }
      if (this.f.type.value === 'CLIENT') {
        this.payments.forEach((item) =>{
          arr.push(
            this.formBuild.group({
              uuid: [item.uuid],
              checked: [false],
              entity: [{value: item?.invoice?.folder.customer?.searchableTitle, disabled: true}],
              libelle: [{value: item?.type === 'NORMAL' ? item?.invoice?.libelle : 'Facture de remboursement du dossier '+item?.invoice?.folder?.code, disabled: true}],
              montant: [{value: item?.montant, disabled: true}],
              mode: [{value: item?.mode, disabled: true}],
            })
          )
        })
      }
    }
    return arr;
  }
  loadMode(treasury){
    if (treasury.type === "CAISSE") {
      this.f.mode.setValue("ESPECE")
      this.modeRow = [
        { label: "ESPECE", value: "ESPECE" },
        { label: "MOBILE MONEY", value: "MOBILE MONEY" },
        { label: "WAVE", value: "WAVE" }
      ];
    }
    if (treasury.type === "BANQUE") {
      this.f.mode.setValue("CHEQUE")
      this.modeRow = [
        { label: "CHEQUE", value: "CHEQUE" },
        { label: "VERSEMENT", value: "VERSEMENT" },
        { label: "VIREMENT", value: "VIREMENT" }
      ];
    }
  }
  onSelectAllPayment($event) {
    this.option.controls.forEach(item => {
      item.get('checked').setValue($event.target.checked)
    })
    this.isHidden = $event.target.checked
  }
  onSelectPayment() {
    let checked = 0;
    this.option.controls.forEach(item => {
      if (item.get('checked').value === true) { checked = checked + 1; }
    })
    this.isHidden = checked > 0 ? true : false;
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      if(data.type === "LOCATAIRE"){
        this.paymentService.confirmate(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            this.emitter.emit({action: 'PAYMENT_CONFRIMATION', payload: res?.data});
          }
        });
      } else if(data.type === "CLIENT"){
        this.paymentCustomerService.confirmate(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            this.emitter.emit({action: 'PAYMENT_CONFRIMATION', payload: res?.data});
          }
        });
      }
    } else { return; }
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
    this.form.reset()
    this.modal.close('ferme');
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
  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }
}
