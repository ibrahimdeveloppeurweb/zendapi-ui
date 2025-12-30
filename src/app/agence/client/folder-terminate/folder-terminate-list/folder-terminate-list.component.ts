import { FolderTerminate } from '@model/folder-terminate';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { EmitterService } from '@service/emitter/emitter.service';
import { FolderTerminateService } from '@service/folder-terminate/folder-terminate.service';
import { FolderTerminateAddComponent } from '@client/folder-terminate/folder-terminate-add/folder-terminate-add.component';
import { FolderTerminateShowComponent } from '@client/folder-terminate/folder-terminate-show/folder-terminate-show.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-folder-terminate-list',
  templateUrl: './folder-terminate-list.component.html',
  styleUrls: ['./folder-terminate-list.component.scss']
})
export class FolderTerminateListComponent implements OnInit {
  @Input() terminates: FolderTerminate[];
  @Input() client = true;
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total: number = 0;
  totalA: number = 0;
  form: FormGroup;
  dataSelected: any[] = [];

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private terminateService: FolderTerminateService,
    private permissionsService: NgxPermissionsService
    ) {
      const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
      this.permissionsService.loadPermissions(permission);
      this. newForm()
    }

  ngOnInit(): void {
    this.etat = this.terminates ? true : false;
    if(this.etat){
      this.terminates.forEach(item => {
        this.total += item?.montant
        this.totalA += item?.montantAgence
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TERMINATE_FOLDER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TERMINATE_FOLDER_UPDATED'|| data.action === 'TERMINATE_FOLDER__VALIDATE') {
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
    this.terminateService.setFolderTerminate(row);
    this.terminateService.edit = true;
    this.modal(FolderTerminateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showTerminate(row): void {
    this.terminateService.setFolderTerminate(row);
    this.modal(FolderTerminateShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerTerminate(row): void {
    this.terminateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
      text: 'Voulez-vous vraiment valider cette résiliation ?',
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
      this.terminateService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'TERMINATE_FOLDER__VALIDATE', payload:payload});
            const index = this.terminates.findIndex((x) => {
              return x.uuid === payload.uuid;
            });
            if (index !== -1) {
              this.terminates[index] = payload;
            }
          });
          
        }
    });
    
    } else {
      return;
    }
  }
  validateTerminate(row) {
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
          this.terminateService.validate(this.form.getRawValue()).subscribe((res) => {
            res?.data.forEach((payload) => {
              this.emitter.emit({action: 'TERMINATE_FOLDER__VALIDATE', payload:payload});
              let index = this.terminates.findIndex((x) => {
                return x.uuid === payload.uuid;
              });
              if (index !== -1) {
                this.terminates[index] = payload;
              }
            });
        });
      }
    });
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
            const index = this.terminates.findIndex((x) => {
              return x.uuid === terminate?.uuid;
            });
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
    }).result.then((result) => { }, (reason) => { });
  }
  get checkedAll() { return this.form.get('checkedAll') as FormArray; }

}
