import { House } from '@model/house';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { HouseService } from '@service/house/house.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { HouseShareComponent } from '@proprietaire/house/house-share/house-share.component';
import { HouseAddComponent } from '@proprietaire/house/house-add/house-add.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-house-list',
  templateUrl: './house-list.component.html',
  styleUrls: ['./house-list.component.scss']
})
export class HouseListComponent implements OnInit {
  @Input() houses: House[] = []
  @Input() proprietaire: boolean = true
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  publicUrl = environment.publicUrl;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private houseService: HouseService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'HOUSE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'HOUSE_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }

  shareLocation(item){
    const lat = item.lat;
    const lng = item.lng;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    const modalRef = this.modalService.open(HouseShareComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.url = url;
  }
  addHouse(type) {
    this.modalService.dismissAll();
    this.houseService.edit = false;
    this.houseService.house = null;
    this.houseService.disponible = type;
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  editHouse(row) {
    this.houseService.setHouse(row)
    this.houseService.edit = true
    this.houseService.disponible = row.disponible
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showHouse(row) {
    this.houseService.setHouse(row)
    this.router.navigate(['/admin/proprietaire/bien/show/' + row.uuid]);
  }
  printerHouse(row): void {
    this.houseService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  appendToList(house): void {
    this.houses.unshift(house);
  }
  update(house): void {
    console.log(house);
    const index = this.houses.findIndex(x => x.uuid === house.uuid);
    if (index !== -1) {
      this.houses[index] = house;
    }
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
          this.houseService.getDelete(item.uuid).subscribe(res => {
            const index = this.houses.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.houses.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }

}
