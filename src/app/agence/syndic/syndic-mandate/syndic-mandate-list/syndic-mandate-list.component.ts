import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';
import { Globals } from '@theme/utils/globals';
import { SyndicMandateAddComponent } from '../syndic-mandate-add/syndic-mandate-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SyndicMandateShowComponent } from '../syndic-mandate-show/syndic-mandate-show.component';
import { EmitterService } from '@service/emitter/emitter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-syndic-mandate-list',
  templateUrl: './syndic-mandate-list.component.html',
  styleUrls: ['./syndic-mandate-list.component.scss']
})
export class SyndicMandateListComponent implements OnInit {

  @Input() mandats: any[] = []
  @Input() validate: boolean = false
  dtOptions: any
  userSession = Globals.user
  dataSelected: any[] = [];
  form: FormGroup;

  constructor(
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private mandateService: MandateSyndicService,
    private emitter: EmitterService
  ) {
    this.newForm()
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
    console.log('this.mandats', this.mandats);

    this.emitter.event.subscribe((data) => {
      if (data.action === 'MANDAT_VALIDER') {
        const row = data.payload
        const index = this.mandats.findIndex(x => x.uuid === row.uuid);
        if (index !== -1) {
          this.mandats[index] = row;
        }
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


  showMandate(item){
    this.mandateService.setMandat(item)
    this.mandateService.edit = false
    this.modal(SyndicMandateShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  editMandate(item){
    this.mandateService.setMandat(item)
    this.mandateService.edit = true
    this.modal(SyndicMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printMandate(item){
    this.mandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, item?.trustee?.uuid, item.uuid);
  }

  onCheckAll(event: any) {
    const isChecked = event.target.checked;
    this.dataSelected = isChecked ? this.mandats.slice() : [];
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
      this.mandateService.validate(this.form.getRawValue()).subscribe((res) => {
        if (res?.status === 'success') {
          res?.data.forEach((payload) => {
            this.emitter.emit({action: 'MANDAT_VALIDER', payload:payload});
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
        this.mandateService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.mandats.findIndex(x => x.id === item.id);
            if (index !== -1) { this.mandats.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  onValidate(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous valider ce mandat ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.checkedAll.push(
          this.formBuild.group({
            uuid: [item?.uuid],
          })
        );        
        this.mandateService.validate(this.form.getRawValue()).subscribe((res: any) => {
          this.emitter.loading()

          if (res?.status === 'success') {
            res?.data.forEach((payload) => {
              this.emitter.emit({action: 'MANDAT_VALIDER', payload:payload});
              this.checkedAll.controls = []; 
              this.form.reset()
            }); 
            this.emitter.stopLoading()
          }
        })
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
      if(result == 'MANDAT'){
        this.mandateService.getList(null).subscribe((res: any) => {
          return this.mandats = res
        })
      }
   }, (reason) => { });
  }

  onClose(){
    this.modalService.dismissAll();
  }
  get checkedAll() { return this.form.get('checkedAll') as FormArray; }



}
