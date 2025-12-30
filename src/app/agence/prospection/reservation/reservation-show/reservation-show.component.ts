import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OffreService } from '@service/offre/offre.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ReservationService } from '@service/reservation/reservation.service';
import { ReservationAddComponent } from '../reservation-add/reservation-add.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reservation-show',
  templateUrl: './reservation-show.component.html',
  styleUrls: ['./reservation-show.component.scss']
})
export class ReservationShowComponent implements OnInit {
  title: any;
  invoice: any;
  reservation: any;
  offres: any[] = [];
  userSession = Globals.user;
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,    
    private emitter: EmitterService,
    private offreService: OffreService,
    private reservationService: ReservationService
  ) { 
    this.reservation = this.reservationService.getReservation()
    this.title = "Détails du Dossier de pré-réservation numéro " + this.reservation?.numero
  }

  ngOnInit(): void {
  }

  edit(item){
    this.reservationService.setReservation(item);
    this.reservationService.edit = true;
    this.modal(ReservationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printer(type, item){
  }
  delete(type, item){
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
        if(type === 'OFFRE') {
          this.offreService.getDelete(item.uuid).subscribe((res: any) => {
            if (res?.status === 'success') {
              const index = this.offres.findIndex(x => x.id === item.id);
              if (index !== -1) {
                this.offres.splice(index, 1);
              }
              Swal.fire('', res?.message, 'success');
            }
          });
        }
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
}
