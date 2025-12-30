
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { QuartierService } from '@service/quartier/quartier.service';
import { NeighborhoodAddComponent } from '../neighborhood-add/neighborhood-add.component';
import { NeighborhoodShowComponent } from '../neighborhood-show/neighborhood-show.component';
import { Quartier } from '@model/quartier';

@Component({
  selector: 'app-neighborhood-list',
  templateUrl: './neighborhood-list.component.html',
  styleUrls: ['./neighborhood-list.component.scss']
})
export class NeighborhoodListComponent implements OnInit {
  @Input() quartiers: Quartier[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = true
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private quartierService: QuartierService,
  ) {
    this.quartierService.getList().subscribe((res: any) => {
      this.quartiers = res
      console.log(this.quartiers);
    })
  }

  ngOnInit(): void {
    this.etat = this.quartiers ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'QUARTIER_ADD') {
        this.appendToList(data.payload);
      }
      
      if (data.action === 'QUARTIER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.quartiers.unshift(...item);
  }
  update(item): void {
    const index = this.quartiers.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.quartiers[index] = item;
    }
  }
  addQuartier() {
    this.modalService.dismissAll();
    this.quartierService.edit = false;
    this.modal(NeighborhoodAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  editQuartier(row) {
    this.quartierService.setQuartier(row)
    this.quartierService.edit = true
    this.modal(NeighborhoodAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showQuartier(row) {
    this.quartierService.setQuartier(row)
    this.modal(NeighborhoodShowComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.quartierService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.quartiers.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.quartiers.splice(index, 1);
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

