import { Repayment } from '@model/repayment';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { RepaymentService } from '@service/repayment/repayment.service';
import { InvoiceRepaymentService } from '@service/invoice-repayment/invoice-repayment.service';
import { RepaymentShowComponent } from '@proprietaire/repayment/repayment-show/repayment-show.component';
import { RepaymentAddComponent } from '@agence/proprietaire/repayment/repayment-add/repayment-add.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-repayment-list',
  templateUrl: './repayment-list.component.html',
  styleUrls: ['./repayment-list.component.scss']
})
export class RepaymentListComponent implements OnInit {
  @Input() owner: boolean = true
  @Input() action: boolean = true
  @Input() validate: boolean = false
  @Input() repayments: Repayment[]

  montant = 0;
  commission = 0;
  dtOptions: any = {};
  etat: boolean = false
  validation = VALIDATION
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device}
  dataSelected: any[] = [];
  form: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private repaymentService: RepaymentService,
    private invoiceRepaymentService: InvoiceRepaymentService,
  ) {
    this.newForm()
  }

  ngOnInit(): void {
    this.etat = this.repayments ? true : false;
    if(this.etat){
      this.repayments.forEach(item => {
        this.montant = this.montant + item?.montant
        this.commission = this.commission + item?.commission
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'REPAYMENT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'REPAYMENT_UPDATED' || data.action === 'REPAYMENT_VALIDATE') {
        this.update(data.payload);
      }

      if (data.action === 'REPAYMENT_VALIDATE') {
        const row = data.payload
        const index = this.repayments.findIndex(x => x.uuid === row.uuid);
        if (index !== -1) { this.repayments.splice(index, 1); }
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
    this.repayments.unshift(item);
  }
  update(item): void {
    const index = this.repayments.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.repayments[index] = item;
    }
  }
  editRepayment(row) {
    this.repaymentService.setRepayment(row)
    this.repaymentService.edit = true
    this.repaymentService.type = row?.type
    this.modal(RepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRepayment(row) {
    this.repaymentService.setRepayment(row)
    this.modal(RepaymentShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerRepayment(row): void {
    this.repaymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  printerInvoiceRepayment(row: any): void {
    this.invoiceRepaymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.repayments.slice() : [];
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

  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet enrégistrement ?',
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
      this.repaymentService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'REPAYMENT_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
    });
    
    } else {
      return;
    }
  }

  validateRepayment(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: '#9ccc65',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.checkedAll.push(
          this.formBuild.group({
            uuid: [item?.uuid],
          })
        );
      this.repaymentService.validate(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'REPAYMENT_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
        }
      });
      }
    });
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
        this.repaymentService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.repayments.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.repayments.splice(index, 1);
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
    }).result.then((result) => { }, (reason) => { });
  }
  get checkedAll() { return this.form.get('checkedAll') as FormArray; }

}
