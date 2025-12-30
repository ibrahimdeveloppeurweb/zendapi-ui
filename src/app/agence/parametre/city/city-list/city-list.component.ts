
import { Ville} from '@model/ville';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { VilleService } from '@service/ville/ville.service';
import { CityAddComponent } from '../city-add/city-add.component';
import { CityShowComponent } from '../city-show/city-show.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
})
export class CityListComponent implements OnInit {
  @Input() cities: Ville[]= [];
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = true
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private villeService: VilleService,
  ) {
    this.villeService.getList().subscribe((res: any) => {
      this.cities = res
    })
  }

  ngOnInit(): void {
    this.etat = this.cities ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CITY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'CITY_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.cities.unshift(...item);
  }
  update(item): void {
    const index = this.cities.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.cities[index] = item;
    }
  }
  addCity() {
    this.modalService.dismissAll();
    this.villeService.edit = false;
    this.modal(CityAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  editCity(row) {
    this.villeService.setVille(row)
    this.villeService.edit = true
    this.modal(CityAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showCity(row) {
    this.villeService.setVille(row)
    this.modal(CityShowComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.villeService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.cities.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.cities.splice(index, 1);
              console.log(item?.isDelete);
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
}
