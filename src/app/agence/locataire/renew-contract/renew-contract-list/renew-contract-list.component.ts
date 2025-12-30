
import { Renew } from '@model/renew';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { RenewService } from '@service/renew/renew.service';
import { RenewContractAddComponent } from '@locataire/renew-contract/renew-contract-add/renew-contract-add.component';
import { RenewContractShowComponent } from '@locataire/renew-contract/renew-contract-show/renew-contract-show.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-renew-contract-list',
  templateUrl: './renew-contract-list.component.html',
  styleUrls: ['./renew-contract-list.component.scss']
})
export class RenewContractListComponent implements OnInit {
  @Input() renews: Renew[]
  @Input() locataire: boolean = true
  @Input() action: boolean = true
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;
  loyer = 0;
  charge = 0;
  form: FormGroup;
  dataSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private renewService: RenewService,
    private emitter: EmitterService
  ) {
    this.newForm()
  }


  ngOnInit(): void {
    this.etat = this.renews ? true : false;
    if(this.etat){
      this.renews.forEach(item => {
        this.total = this.total + item?.invoice?.montant
        this.loyer = this.loyer + item?.loyer
        this.charge = this.charge + item?.charge
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'RENEW_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'RENEW_UPDATED') {
        this.update(data.payload);
      }

      if (data.action === 'RENEW_ACTIVATE') {
        const row = data.payload
        const index = this.renews.findIndex(x => x.uuid === row.uuid);
        if (index !== -1) { this.renews.splice(index, 1); }
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
    this.renews.unshift(item);
  }
  update(item): void {
    const index = this.renews.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.renews[index] = item;
    }
  }
  editRenew(row) {
    this.renewService.setRenew(row)
    this.renewService.edit = true
    this.renewService.type = row.type
    this.modal(RenewContractAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRenew(row) {
    this.renewService.setRenew(row)
    this.modal(RenewContractShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerRenew(row): void {
    this.renewService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.renews.slice() : [];
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
      text: 'Voulez-vous vraiment Activer cet renouvellement ?',
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
      this.renewService.activate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'RENEW_ACTIVATE', payload: payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
    });
    
    } else {
      return;
    }
  }

  activateRenew(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment Activer cet renouvellement?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.checkedAll.push(
          this.formBuild.group({
            uuid: [row?.uuid],
          })
        );
      this.renewService.activate(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'RENEW_ACTIVATE', payload: payload});
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
        this.renewService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.renews.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.renews.splice(index, 1);
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

  get checkedAll() { return this.form.get('checkedAll') as FormArray;
    
   }

}
