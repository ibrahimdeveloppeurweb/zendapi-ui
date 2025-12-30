import { Component, OnInit, Input } from '@angular/core';
import { Rent } from '@model/rent';
import { PAYMENT } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentAddComponent } from '@locataire/rent/rent-add/rent-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RentService } from '@service/rent/rent.service';
import { RentShowComponent } from '../rent-show/rent-show.component';
import {EmitterService} from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rent-list',
  templateUrl: './rent-list.component.html',
  styleUrls: ['./rent-list.component.scss']
})
export class RentListComponent implements OnInit {
  @Input() rents: Rent[]
  @Input() locataire: boolean = true
  checked: boolean = false;
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  payment = PAYMENT
  total = 0;
  paye = 0;
  impaye = 0;
  form: FormGroup;

  constructor(
    private formBuild: FormBuilder,
    private modalService: NgbModal,
    private rentService: RentService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(){
    this.etat = this.rents ? true : false;
    if(this.etat){
      this.rents.forEach(item => {
        this.total += item?.invoice.montant
        this.paye += item?.invoice.paye
        this.impaye += item?.invoice.impaye
        return
      })
      this.table();
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'RENT_ADD') {
        this.appendToList(data.payload);
      }
    });
  }

  table(){
    this.form = this.formBuild.group({
      lignes: this.formBuild.array(this.item())
    });
  }
  item(): FormGroup[] {
    var arr: any[] = []
    if(this.rents && this.rents.length > 0){
      this.rents.forEach((item) =>{
        let etat = item?.type === 'LOYER' && item?.invoice?.etat === 'SOLDE' && item?.contract?.etat === 'ACTIF' ? false : true;
        arr.push(
          this.formBuild.group({
            uuid: [null],
            checked: [{value: false, disabled: etat }],
          })
        )
      })
    }
    console
    return arr;
  }
  onSelectAll($event) {
    if($event.target.checked === true && this.rents && this.rents.length > 0){
      this.rents.forEach((item) =>{
        if (item?.type === 'LOYER' && item?.invoice?.etat === 'SOLDE' && item?.contract?.etat === 'ACTIF') {
          this.checked = true;
          this.lignes.controls.push(
            this.formBuild.group({
              uuid: [item?.uuid],
              checked: [{value: true, disabled: false}],
            })
          )
        }
      })
    } else {
      this.checked = false;
      this.rents.forEach((item) =>{
        if (item?.invoice?.etat === 'SOLDE' && item?.contract?.etat === 'ACTIF') {
          this.lignes.controls.push(
            this.formBuild.group({
              uuid: [null],
              checked: [{value: false, disabled: false}],
            })
          )
        }
      })
    }
  }
  onSelect(index, row) {
    if (this.lignes.controls[index].get('checked').value === true) {
      this.checked = true;
      this.lignes.controls[index].get('uuid').setValue(row?.uuid)
    }
  }
  appendToList(rent): void {
    this.rents.unshift(rent);
  }
  addRent() {
    this.modalService.dismissAll()
    this.rentService.edit = false
    this.modal(RentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRent(row) {
    this.rentService.setRent(row)
    this.modal(RentShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerRent(row): void {
    this.rentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  printerAssocie() {
    // console.log(this.form.getRawValue())
      var data = this.form.getRawValue()
      this.rentService.associe(data).subscribe(res => {
        if (res?.status === 'success') {
          console.log(res)
          let blob = new Blob([res.data], {
            type: res.headers.get('content-type')
          })
          let url = URL.createObjectURL(blob);
          window.open(url, '_blank')
        }
      })
    // this.rentService.getPrinterA(this.userSession?.agencyKey, this.userSession?.uuid, data);
    // if (this.form.valid) {
    //   var data = this.form.getRawValue()
    //   this.rentService.getPrinterAssocie(data).subscribe(
    //     res => {
    //       // if (res?.status === 'success') {
    //         console.log(res)
    //         let blob = new Blob([res.data], {
    //           type: res.headers.get('content-type')
    //         })
    //         let url = URL.createObjectURL(blob);
    //         window.open(url, '_blank')
    //       // }
    //     }, error => {
    //     });
    // }
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
        this.rentService.getDelete(item?.uuid).subscribe(res => {
          if (res?.status === 'success') {
            const index = this.rents.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.rents.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
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

    }, (reason) => {

    });
  }
  get lignes() { return this.form.get('lignes') as FormArray; }

}
