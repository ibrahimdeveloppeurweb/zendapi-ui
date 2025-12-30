import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { Component, Input, OnInit } from '@angular/core';
import { Home } from '@model/home';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '@service/home/home.service';
import { HomeAddComponent } from '@promotion/home/home-add/home-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.scss']
})
export class HomeListComponent implements OnInit {
  @Input() homes: Home[] = []
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  publicUrl = environment.publicUrl;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private homeService: HomeService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'HOME_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'HOME_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.homes.unshift(item);
  }
  update(item): void {
    const index = this.homes.findIndex(x => x.uuid === item.uuid );
    if (index !== -1) {
      this.homes[index] = item;
    }
  }
  editHome(row) {
    this.homeService.setHome(row)
    this.homeService.edit = true
    this.modal(HomeAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  showHome(row) {
    this.homeService.setHome(row)
    this.router.navigate(['/admin/promotion/home/show/' + row.uuid]);
  }
  printerHome(row): void {
    this.homeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.homeService.getDelete(item.uuid).subscribe(res => {
            if (res?.code === 200) {
              const index = this.homes.findIndex(x => x.uuid === item.uuid);
              if (index !== -1) {
                this.homes.splice(index, 1);
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
