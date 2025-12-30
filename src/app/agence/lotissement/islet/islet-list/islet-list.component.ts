import { Globals } from '@theme/utils/globals';
import { IsletService } from '@service/islet/islet.service';
import { IsletShowComponent } from '@lotissement/islet/islet-show/islet-show.component';
import { IsletAddComponent } from '@lotissement/islet/islet-add/islet-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Islet } from '@model/islet';
import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { LocalisationService } from '@service/localisation/localisation.service';
import { AddComponent } from '@agence/localisation/add/add.component';

@Component({
  selector: 'app-islet-list',
  templateUrl: './islet-list.component.html',
  styleUrls: ['./islet-list.component.scss']
})
export class IsletListComponent implements OnInit {
  @Input() islets: Islet[] = []
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private isletService: IsletService,
    private localisationService : LocalisationService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.islets ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'ISLET_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'ISLET_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  appendToList(item): void {
    this.islets.unshift(item);
  }
  update(item): void {
    const index = this.islets.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.islets[index] = item;
    }
  }
  map(item) {
    this.modalService.dismissAll()
    this.localisationService.edit = false
    this.localisationService.type = 'LOT';
    this.localisationService.setLocalisation(item)
    this.modal(AddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editIslet(row) {
    this.isletService.setIslet(row)
    this.isletService.edit = true
    this.modal(IsletAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showIslet(row) {
    this.isletService.setIslet(row)
    this.modal(IsletShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerIslet(row): void {
    this.isletService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.isletService.getDelete(item.uuid).subscribe(res => {
            if (res?.code === 200) {
              const index = this.islets.findIndex(x => x.uuid === item.uuid);
              if (index !== -1) {
                this.islets.splice(index, 1);
              }
              Swal.fire('', res?.message, res?.status);
            }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }

}
