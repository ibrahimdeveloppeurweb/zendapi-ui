import { Component, Input, OnInit } from '@angular/core';
import { Service } from '@model/service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ServiceService } from '@service/service/service.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceAddComponent } from '../service-add/service-add.component';
import { ServiceShowComponent } from '../service-show/service-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  @Input() services: Service[]
  @Input() user: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    private modalService: NgbModal,
    private serviceService: ServiceService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SERVICE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SERVICE_UPDATED') {
        this.update(data.payload);
      }
    });
    this.etat = this.services ? true : false;
  }

  appendToList(service): void {
    this.services.unshift(service);
  }
  update(service): void {
    const index = this.services.findIndex(x => x.uuid === service.uuid);
    if (index !== -1) {
      this.services[index] = service;
    }
  }
  editService(row) {
    this.modalService.dismissAll()
    this.serviceService.setService(row)
    this.serviceService.edit = true
    this.modal(ServiceAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showService(row) {
    this.serviceService.setService(row)
    this.modal(ServiceShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  delete(service) {
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

        this.serviceService.getDelete(service.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.services.findIndex(x => x.uuid === service.uuid);
            if (index !== -1) {
              this.services.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }
}
