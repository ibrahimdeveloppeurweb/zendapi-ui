import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, Input} from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {InventoryService} from '@service/inventory/inventory.service';
import { InventoryUploadComponent } from '../inventory-upload/inventory-upload.component';
import {InventoryAddComponent} from '@locataire/inventory/inventory-add/inventory-add.component';
import {InventoryShowComponent} from '@locataire/inventory/inventory-show/inventory-show.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  @Input() inventories = [];
  @Input() locataire: true;
  @Input() action: boolean = true;
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  form: FormGroup;
  dataSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private inventoryService: InventoryService,
    private emitter: EmitterService,
  ) { 
    this.newForm()
  }

  ngOnInit(): void {
    this.etat = this.inventories ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'INVENTORY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'INVENTORY_UPDATED' || 'INVENTORY_VALIDATE') {
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
    this.inventories.unshift(item);
  }
  update(item): void {
    const index = this.inventories.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.inventories[index] = item;
    }
  }
  addInventory() {
    this.modalService.dismissAll();
    this.inventoryService.edit = false;
    this.modal(InventoryAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editInventory(row) {
    this.inventoryService.setInventory(row);
    this.inventoryService.edit = true;
    this.inventoryService.type = row.type;
    this.modal(InventoryAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showInventory(row) {
    this.inventoryService.setInventory(row);
    this.modal(InventoryShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerInventory(row): void {
    this.inventoryService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.inventories.slice() : [];
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
      this.inventoryService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'INVENTORY_VALIDATE', payload: payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
    });
    
    } else {
      return;
    }
  }

  validateInventory(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet enrégistrement ?',
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
      this.inventoryService.validate(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'INVENTORY_VALIDATE', payload: payload});
            this.checkedAll.controls = []; 
            this.form.reset()
            console.log(payload);
          });
        }
    
      });
      }
    });
  }
  uploadInventory(row): void {
    this.inventoryService.setInventory(row);
    this.modal(InventoryUploadComponent, 'modal-basic-title', 'md', true, 'static');
  }
  formatDate(date) { return DateHelperService.fromJsonDate(date); }
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
        this.inventoryService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.inventories.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.inventories.splice(index, 1);
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
