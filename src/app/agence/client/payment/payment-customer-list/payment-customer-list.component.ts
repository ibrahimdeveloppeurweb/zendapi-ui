import { PaymentCustomer } from '@model/payment-customer';
import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import { VALIDATION } from '@theme/utils/functions';
import { CONFIRMATION } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { PaymentCustomerAddComponent } from '@client/payment/payment-customer-add/payment-customer-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PaymentCustomerShowComponent } from '@client/payment/payment-customer-show/payment-customer-show.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-customer-list',
  templateUrl: './payment-customer-list.component.html',
  styleUrls: ['./payment-customer-list.component.scss']
})
export class PaymentCustomerListComponent implements OnInit {
  @Input() payments: PaymentCustomer[]
  @Input() client: boolean = true
  @Input() action: boolean = true
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  confirmation = CONFIRMATION
  total = 0;
  form: FormGroup;
  dataSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private paymentCustomerService: PaymentCustomerService,
    private emitter: EmitterService
  ) {
    this.newForm()
  }

  ngOnInit(): void {
    this.etat = this.payments ? true : false;
    if(this.etat){
      this.payments.forEach(item => { return this.total = this.total + item?.montant })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_CUSTOMER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PAYMENT_CUSTOMER_UPDATED' || data.action === 'PAYMENT_CUSTOMER_VALIDATE') {
        this.update(data.payload);
      }
    });
  }

  newForm(): void {
    this.form = this.formBuild.group({
      valueOne:[null],
      checked: [null],
      checkedAll: this.formBuild.array([]),
    });
  }

  appendToList(item): void {
    this.payments.unshift(...item);
  }
  update(item): void {
    const index = this.payments.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.payments[index] = item;
    }
  }
  editPayment(row) {
    this.paymentCustomerService.setPayment(row)
    this.paymentCustomerService.edit = true
    this.paymentCustomerService.type = row.type
    this.modal(PaymentCustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPayment(row) {
    this.paymentCustomerService.setPayment(row)
    this.modal(PaymentCustomerShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerPayment(row): void {
    this.paymentCustomerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.payments.slice() : [];
    this.updateAllCheckboxes(isChecked);

    console.log(this.dataSelected);
    
  }

  onCheckItem(item: any) {
    const index = this.dataSelected.indexOf(item);
    if (index === -1) {
      this.dataSelected.push(item);
    } else {
      this.dataSelected.splice(index, 1);
    }
    this.checkIfAllChecked();
    console.log(this.dataSelected);
    
  }

  updateAllCheckboxes(isChecked: boolean) {
    const checkboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    checkboxes.forEach((checkbox: any) => {
      checkbox.checked = isChecked;
    });
  }

  checkIfAllChecked() {
    const allCheckboxes = document.querySelectorAll('.form-check-input:not(#checkAll)');
    const allChecked = Array.from(allCheckboxes).every((checkbox: HTMLElement) => (checkbox as HTMLInputElement).checked);
    const checkAllCheckbox = document.getElementById('checkAll') as HTMLInputElement;
    if (checkAllCheckbox) {
      checkAllCheckbox.checked = allChecked;
    }
  }

  validatePayment(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet paiement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.checkedAll.push(
          this.formBuild.group({
            uuid: [row?.uuid],
          })
        );
      this.paymentCustomerService.validate(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_VALIDATE', payload: payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
        }
    
      });
      }
    });
  }

  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce paiement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
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
    if (this.form.valid) {
      this.dataSelected.forEach((item) => {
        this.checkedAll.push(
          this.formBuild.group({
            uuid: [item?.uuid],
          })
        );
      });
      this.paymentCustomerService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
    });
    
    } else {
      return;
    }
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.paymentCustomerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.payments.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.payments.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }

  get checkedAll() { return this.form.get('checkedAll') as FormArray; }

}
