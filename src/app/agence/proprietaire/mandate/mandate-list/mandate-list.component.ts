import { Component, Input, OnInit } from '@angular/core';

import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { Mandate } from '@model/mandate';
import { MandateAddComponent } from '@proprietaire/mandate/mandate-add/mandate-add.component';
import { MandateService } from '@service/mandate/mandate.service';
import { MandateShowComponent } from '@proprietaire/mandate/mandate-show/mandate-show.component';
import { MandateUploadComponent } from '../mandate-upload/mandate-upload.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mandate-list',
  templateUrl: './mandate-list.component.html',
  styleUrls: ['./mandate-list.component.scss']
})
export class MandateListComponent implements OnInit {
  @Input() mandates: Mandate[];
  @Input() action: boolean = true
  dtOptions: any = {};
  total = 0
  etat: boolean = false
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  validation = VALIDATION
  dataSelected: any[] = [];
  form: FormGroup;
  hasGarantieLoyerMandates: boolean = false;
  totalCommission: number = 0;
  totalGarantie: number = 0;
  totalPartCharge: number = 0;

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private mandateService: MandateService,
    private emitter: EmitterService
  ) {
    this.newForm()
  }

  ngOnInit(): void {
    this.etat = this.mandates ? true : false;
    if (this.etat) {
      // Calculate all the totals
      this.calculateTotals();
      // Check if there are any mandates with GRT_LOYER billing type
      this.hasGarantieLoyerMandates = this.mandates.some(mandate => mandate.facturation === 'GRT_LOYER');
    }

    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'MANDATE_ADD') {
        this.appendToList(data.payload);
        // Recalculate all totals and update the flag when a new mandate is added
        this.calculateTotals();
        this.hasGarantieLoyerMandates = this.mandates.some(mandate => mandate.facturation === 'GRT_LOYER');
      }
      if (data.action === 'MANDATE_UPDATED') {
        this.update(data.payload);
        // Recalculate all totals and update the flag when a mandate is updated
        this.calculateTotals();
        this.hasGarantieLoyerMandates = this.mandates.some(mandate => mandate.facturation === 'GRT_LOYER');
      }

      if (data.action === 'MANDAT_VALIDATE') {
        const row = data.payload
        const index = this.mandates.findIndex(x => x.uuid === row.uuid);
        if (index !== -1) { this.mandates.splice(index, 1); }
        // Recalculate all totals and update the flag when a mandate is validated/removed
        this.calculateTotals();
        this.hasGarantieLoyerMandates = this.mandates.some(mandate => mandate.facturation === 'GRT_LOYER');
      }
    });
  }

  calculateTotals() {
    // Reset totals
    this.total = 0;
    this.totalCommission = 0;
    this.totalGarantie = 0;
    this.totalPartCharge = 0;

    if (this.mandates) {
      this.mandates.forEach(item => {
        // Calculate main total for non-GRT_LOYER mandates
        if (item?.facturation !== 'GRT_LOYER') {
          this.total += item?.montantCom || 0;
        }

        // Calculate commission total (for all types)
        this.totalCommission += item?.commission || 0;

        // Calculate guarantee total (only for GRT_LOYER)
        if (item?.facturation === 'GRT_LOYER' && item?.montantGarantie) {
          this.totalGarantie += item.montantGarantie;
        }

        // Calculate part charge total (only for GRT_LOYER)
        if (item?.facturation === 'GRT_LOYER') {
          this.totalPartCharge += item?.partCharge || 0;
        }
      });
    }
  }

  newForm(): void {
    this.form = this.formBuild.group({
      valueOne:[null],
      checked: [null],
      checkedAll: this.formBuild.array([]),
    });
  }

  appendToList(mandate): void {
    this.mandates.unshift(mandate);
  }
  update(mandate): void {
    const index = this.mandates.findIndex(x => x.uuid === mandate.uuid);
    if (index !== -1) {
      this.mandates[index] = mandate;
    }
  }
  showMandate(row) {
    this.mandateService.setMandate(row);
    this.modal(MandateShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printerMandate(row): void {
    this.mandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  addMandate() {
    this.modalService.dismissAll();
    this.mandateService.edit = false;
    this.modal(MandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editMandate(row) {
    this.mandateService.setMandate(row);
    this.mandateService.edit = true;
    this.modal(MandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  uploadMandate(row) {
    this.mandateService.setMandate(row);
    this.modal(MandateUploadComponent, 'modal-basic-title', 'md', true, 'static');
  }

  onCheckAll(event: any) {
    let madateCheck = this.mandates.filter(x => x.etat === "INVALIDE")
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? madateCheck.slice() : [];
    this.updateAllCheckboxes(isChecked);
  }

  onCheckItem(item: any) {
    const index = this.dataSelected.indexOf(item);
    if (index === -1) {
      if (item?.etat === "INVALIDE") {
        this.dataSelected.push(item);
      }
      
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
      text: 'Voulez-vous vraiment valider ce mandat ?',
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
      this.mandateService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.code === 200) {   
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'MANDAT_VALIDATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });         
          this.dataSelected = []
          Swal.fire('', res?.message, res?.status);
        }
    });
    
    } else {
      return;
    }
  }
  
  validate(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce mandat ?',
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
        this.mandateService.validate(this.form.getRawValue()).subscribe(res => {
          if (res?.code === 200) {   
            res?.data.forEach((payload) => {
              this.emitter.emit({action: 'MANDAT_VALIDATE', payload:payload});
              this.checkedAll.controls = []; 
              this.form.reset()
            });         
            this.dataSelected = []
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        });
      }
    });
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer ce mandat ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.mandateService.getDelete(item.uuid).subscribe(res => {
          if (res?.code === 200) {
            const index = this.mandates.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.mandates.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
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
