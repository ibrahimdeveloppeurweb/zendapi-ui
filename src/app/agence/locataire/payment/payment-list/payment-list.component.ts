import { Payment } from '@model/payment';
import { Globals } from '@theme/utils/globals';
import { CONFIRMATION } from '@theme/utils/functions';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { PaymentService } from '@service/payment/payment.service';
import { PaymentShowComponent } from '../payment-show/payment-show.component';
import { PaymentAddComponent } from '@locataire/payment/payment-add/payment-add.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  @Input() payments: Payment[]
  @Input() validate: boolean = false
  @Input() locataire: boolean = true
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  total: number = 0;
  userSession = Globals.user
  form: FormGroup;
  dataSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private paymentService: PaymentService,
    private emitter: EmitterService
  ) {
    console.log("hjvdvdbucuuu")
    this.newForm()
  }

  ngOnInit(): void {
    console.log(this.payments);
    
    this.etat = this.payments ? true : false;
    if(this.etat){
      this.payments.forEach(item => { return this.total = this.total + item?.montant })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PAYMENT_UPDATED') {
        this.update(data.payload);
      }
      if (data.action === 'PAYMENT_VALIDATE') {
        const row = data.payload
        const index = this.payments.findIndex(x => x.uuid === row.uuid);
        if (index !== -1) { this.payments.splice(index, 1); }
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
    this.paymentService.setPayment(row)
    this.paymentService.edit = true
    this.paymentService.type = row.type
    this.modal(PaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPayment(row) {
    this.paymentService.setPayment(row)
    this.modal(PaymentShowComponent, 'modal-basic-title', 'xl', true, 'static')
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
      this.paymentService.validate(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'PAYMENT_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset() 
          });
        }
      });
      }
    });
  }
  annulerPayment(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment annuler cet paiement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'NON',
      confirmButtonText: 'OUI <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.paymentService.annuler(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PAYMENT_ANNULER', payload: res?.data});
          }
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
      this.paymentService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'PAYMENT_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset() 
          });

        }
    });

    } else {
      return;
    }
  }

  printerPayment(row): void {
    this.paymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.paymentService.getDelete(item.uuid).subscribe((res: any) => {
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
    }).result.then((result) => {

    }, (reason) => {

    });
  }
  get checkedAll() { return this.form.get('checkedAll') as FormArray; }

}
