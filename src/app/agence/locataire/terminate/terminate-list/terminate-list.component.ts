import { Terminate } from '@model/terminate';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { EmitterService } from '@service/emitter/emitter.service';
import { TerminateService } from '@service/terminate/terminate.service';
import { TerminateAddComponent } from '@locataire/terminate/terminate-add/terminate-add.component';
import { TerminateShowComponent } from '@locataire/terminate/terminate-show/terminate-show.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-terminate-list',
  templateUrl: './terminate-list.component.html',
  styleUrls: ['./terminate-list.component.scss']
})
export class TerminateListComponent implements OnInit {
  @Input() terminates: Terminate[];
  @Input() locataire = true;
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total: number = 0;
  dataSelected: any[] = [];
  form: FormGroup;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private terminateService: TerminateService,
    private formBuild: FormBuilder,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.newForm();
  }

  ngOnInit(): void {
    this.etat = this.terminates ? true : false;
    if(this.etat){
      this.terminates.forEach(item => {
        this.total += item?.invoice.montant
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TERMINATE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TERMINATE_UPDATED') {
        this.update(data.payload);
      }

      if (data.action === 'TERMINATE_RESILIE') {
        const row = data.payload
        const index = this.terminates.findIndex(x => x.id === row.id);
        if (index !== -1) { this.terminates.splice(index, 1); }
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

  appendToList(rent): void {
    this.terminates.unshift(rent);
  }
  update(row): void {
    const index = this.terminates.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.terminates[index] = row;
    }
  }
  editTerminate(row): void {
    this.terminateService.setTerminate(row);
    this.terminateService.edit = true;
    this.modal(TerminateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showTerminate(row): void {
    this.terminateService.setTerminate(row);
    this.modal(TerminateShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerTerminate(row): void {
    this.terminateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  
  activateTerminate(row) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cette résiliation ?',
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
          this.terminateService.activate(this.form.getRawValue()).subscribe((res) => {
            if (res?.status === 'success') {
              res?.data.forEach((payload) => {
                this.emitter.emit({action: 'TERMINATE_RESILIE', payload:payload});
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
    this.dataSelected = isChecked ? this.terminates.slice() : [];
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
      this.terminateService.activate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'TERMINATE_RESILIE', payload:payload});
            this.checkedAll.controls = []; 
            this.form.reset()
          });
          
        }
    });
    
    } else {
      return;
    }
  }

  delete(terminate) {
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
        this.terminateService.getDelete(terminate.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.terminates.findIndex(x => x.id === terminate.id);
            if (index !== -1) {
              this.terminates.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
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

  get checkedAll() { return this.form.get('checkedAll') as FormArray; }
}
