import { RentalService } from '@service/rental/rental.service';
import { RentalAddComponent } from '@proprietaire/rental/rental-add/rental-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Rental } from '@model/rental';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { RentalShowComponent } from '@proprietaire/rental/rental-show/rental-show.component';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.scss']
})
export class RentalListComponent implements OnInit {
  @Input() rentals: Rental[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  total = 0
  loyers = 0
  charges = 0
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private rentalService: RentalService
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.rentals ? true : false;
    this.rentals.forEach(el=>{
      this.total = this.total + el?.total
      this.loyers = this.loyers + el?.montant
      this.charges = this.charges + el?.charge
    })
    this.emitter.event.subscribe((data) => {
      if (data.action === 'RENTAL_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'RENTAL_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  showTenant(row) {
    this.router.navigate(['/admin/locataire/show/' + row.occupantUuid]);
  }
  
  addRental() {
    this.modalService.dismissAll();
    this.rentalService.edit = false;
    this.rentalService.rental = null;
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editRental(row) {
    this.rentalService.setRental(row)
    this.rentalService.edit = true
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRental(row) {
    this.rentalService.setRental(row)
    this.modal(RentalShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerRental(row): void {
    this.rentalService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  appendToList(rental): void {
    this.rentals.unshift(rental);
  }
  update(rental): void {
    const index = this.rentals.findIndex(x => x.uuid === rental.uuid);
    if (index !== -1) {
      this.rentals[index] = rental;
    }
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
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
          this.rentalService.getDelete(item.uuid).subscribe(res => {
          if (res?.code === 200) {
            const index = this.rentals.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.rentals.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }
}
