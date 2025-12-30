import {Contract} from '@model/contract';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input, OnInit} from '@angular/core';
import {EmitterService} from '@service/emitter/emitter.service';
import {ContractService} from '@service/contract/contract.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {ContractAddComponent} from '@locataire/contract/contract-add/contract-add.component';
import {ContractShowComponent} from '@locataire/contract/contract-show/contract-show.component';
import {ContractUploadComponent} from '@locataire/contract/contract-upload/contract-upload.component';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  @Input() contracts: Contract[];
  @Input() validate: boolean = false
  @Input() action: boolean = true
  @Input() locataire = true;
  checked: boolean = false;
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;
  paye = 0;
  impaye = 0;
  dataSelected: any[] = [];

  form: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private contractService: ContractService
  ) {
  this.newForm()
   
  }

  ngOnInit(): void {
    this.etat = this.contracts ? true : false;
    if(this.etat){
      this.contracts.forEach(item => {
        this.total += item?.entranceInvoice?.montant
        this.paye += item?.entranceInvoice?.paye
        this.impaye += item?.entranceInvoice?.impaye
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CONTRACT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'CONTRACT_UPDATED') {
        this.update(data.payload);
      }
      if (data.action === 'CONTRACT_ACTIVATE') {
        const row = data.payload
        const index = this.contracts.findIndex(x => x.id === row.id);
        if (index !== -1) { this.contracts.splice(index, 1); }
      }
    });
   
  }

  appendToList(row): void {
    this.contracts.unshift(row);
  }
  update(row): void {
    const index = this.contracts.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.contracts[index] = row;
    }
  }

  newForm(): void {
    this.form = this.formBuild.group({
      valueOne:[null],
      checked: [null],
      checkedAll: this.formBuild.array([]),
    });
  }
 
  editContract(row): void {
    this.contractService.setContract(row);
    this.contractService.edit = true;
    this.modal(ContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  uploadContract(row): void {
    this.contractService.setContract(row);
    this.modal(ContractUploadComponent, 'modal-basic-title', 'md', true, 'static');
  }
  genereRent(row): void {
    Swal.fire({
      title: '',
      text: "Voulez-vous vraiment générer tous les loyers depuis la date d'entrée du locataire ?",
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
          this.contractService.genererRent(row).subscribe((res) => {
          const index = this.contracts.findIndex((x) => {
            return x.uuid === res?.data.uuid;
          });
          if (index !== -1) {
            this.contracts[index] = res?.data;
          }
        });
      }
    });
  }
  showContract(row): void {
    this.contractService.setContract(row);
    this.contractService.validated = this.validate
    this.modal(ContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerContract(row): void {
    this.contractService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  activateContract(row) { 
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce contrat ?',
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
          console.log(this.form.getRawValue());
          this.contractService.activate(this.form.getRawValue()).subscribe((res) => {
            if (res?.status === 'success') {
              res?.data.forEach((payload) => {
                this.emitter.emit({action: 'CONTRACT_ACTIVATE', payload:payload});
                this.checkedAll.controls = []; 
                this.form.reset()           
              });
            }
        });
      }
    });
  }
  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.contracts.slice() : [];
    this.updateAllCheckboxes(isChecked);
    
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
      text: 'Voulez-vous vraiment valider ce contrat ?',
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
      this.contractService.activate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'CONTRACT_ACTIVATE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
      });
    } else {
      return;
    }
  }
  
  delete(row) {
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
        this.contractService.getDelete(row.uuid).subscribe((res: any) => {
          const index = this.contracts.findIndex((x) => {
            return x.uuid === row.uuid;
          });
          if (index !== -1) {
            this.contracts.splice(index, 1);
          }
          Swal.fire('Contrat Supprimé', res?.message, 'success');
        });
      }
    });
  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
  readableDate(date) { return DateHelperService.readable(date); }
  formatDate(date) { return DateHelperService.fromJsonDate(date); }
  timelapse(date): string { return DateHelperService.getTimeLapse(date); }
  get checkedAll() { return this.form.get('checkedAll') as FormArray; }
}
