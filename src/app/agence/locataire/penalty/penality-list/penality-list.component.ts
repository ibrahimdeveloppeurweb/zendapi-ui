import { PenalityShowComponent } from '@locataire/penalty/penality-show/penality-show.component';
import { Component, OnInit, Input } from '@angular/core';
import { Penality } from '@model/penality';
import { PAYMENT } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PenalityAddComponent } from '@locataire/penalty/penality-add/penality-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PenalityService } from '@service/penality/penality.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-penality-list',
  templateUrl: './penality-list.component.html',
  styleUrls: ['./penality-list.component.scss']
})
export class PenalityListComponent implements OnInit {
  @Input() penalities: Penality[]
  @Input() locataire: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  payment = PAYMENT
  total: number = 0;
  paye: number = 0;
  impaye: number = 0;
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private penalityService: PenalityService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.penalities ? true : false;
    if(this.etat){
      this.penalities.forEach(item => {
        this.total += item?.invoice.montant
        this.paye += item?.invoice.paye
        this.impaye += item?.invoice.impaye
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PENALITY_ADD') {
        this.appendToList(data.payload);
      }
    });
  }

  appendToList(penality): void {
    this.penalities.unshift(penality);
  }
  addPenality() {
    this.modalService.dismissAll()
    this.modal(PenalityAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPenality(row) {
    this.penalityService.setPenality(row)
    this.modal(PenalityShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerPenality(row): void {
    this.penalityService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.penalityService.getDelete(item.uuid).subscribe(res => {
        }, error => {
          Swal.fire('', error.message, 'error');
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
  uploadPenality(item){

  }
}
