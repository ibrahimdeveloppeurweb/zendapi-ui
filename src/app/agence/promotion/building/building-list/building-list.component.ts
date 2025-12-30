import { Router } from '@angular/router';
import { Building } from '@model/building';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { BuildingService } from '@service/building/building.service';
import { BuildingAddComponent } from '../building-add/building-add.component';

@Component({
  selector: 'app-building-list',
  templateUrl: './building-list.component.html',
  styleUrls: ['./building-list.component.scss']
})
export class BuildingListComponent implements OnInit {
  @Input() buildings: Building[] = []
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private buildingService: BuildingService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'BUILDING_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'BUILDING_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.buildings.unshift(item);
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  update(item): void {
    const index = this.buildings.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.buildings[index] = item;
    }
  }
  editBuilding(row) {
    this.buildingService.setBuilding(row)
    this.buildingService.edit = true
    this.modal(BuildingAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showBuilding(row) {
    this.buildingService.setBuilding(row)
    this.router.navigate(['/admin/promotion/building/show/' + row.uuid]);
  }
  printerBuilding(row): void {
    this.buildingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.buildingService.getDelete(item.uuid).subscribe(res => {
            if (res?.code === 200) {
              const index = this.buildings.findIndex(x => x.uuid === item.uuid);
              if (index !== -1) {
                this.buildings.splice(index, 1);
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
