import { User } from '@model/user';
import { Router } from '@angular/router';
import { Service } from '@model/service';
import { environment } from '@env/environment';
import { Permission } from '@model/permission';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from '@service/user/user.service';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ServiceService } from '@service/service/service.service';
import { PermissionService } from '@service/permission/permission.service';
import { UserAddComponent } from '@utilisateur/user/user-add/user-add.component';
import { UserAccessComponent } from '@utilisateur/user/user-access/user-access.component';
import { ServiceAddComponent } from '@utilisateur/service/service-add/service-add.component';
import { PermissionAddComponent } from '@utilisateur/permission/permission-add/permission-add.component';
import { UserRestPasswordComponent } from '@utilisateur/user/user-rest-password/user-rest-password.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  publicUrl = environment.publicUrl;
  filter: any;
  type: string = "USER";
  durer: string = "";
  etat: boolean = false;
  users: User[] = [];
  permissions: Permission[] = [];
  services: Service[] = [];
  dtOptions: any = {};
  visibilite: boolean = false;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  typeRow = [
    { label: 'UTILISATEUR', value: 'USER' },
    { label: 'SERVICE', value: 'SERVICE' },
    { label: 'PERMISSION', value: 'PERMISSION' }
  ]
  etatRow = [];
  categorieRow = [];
  nameTitle: string = "Nom prénoms / Raison sociale"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de utilisateur"
  etatTitle: string = "Disponibilité ?"

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private userService: UserService,
    private filterService: FilterService,
    private serviceService: ServiceService,
    private permissionService: PermissionService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.userService.getList(null, null).subscribe(res => {
      this.etat = res ? true : false
      this.users = res;
    }, error => {});
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'USER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'USER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.users.unshift(item);
  }
  update(item): void {
    const index = this.users.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.users[index] = item;
    }
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null;
    this.users = [];
    this.permissions = [];
    this.filterService.search($event, 'user', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'USER'){
          this.users = res;
          return this.users;
        } else if(this.type === 'PERMISSION'){
          this.permissions = res
        } else if(this.type === 'SERVICE'){
          this.services = res;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'USER'){
      this.nameTitle = 'Utilisateur'
      this.categorieTitle = "Type d'agence"
      this.etatRow = [];
      this.categorieRow = [];
      this.visibilite = false;
    } else if($event === 'PERMISSION'){
      this.nameTitle = 'Utilisateur'
      this.etatTitle = 'Etat'
      this.etatRow = []
      this.categorieTitle = 'Type'
      this.categorieRow = []
      this.visibilite = true;
    } else if($event === 'SERVICE'){
      this.nameTitle = 'Responsable'
      this.etatTitle = 'Etat'
      this.etatRow = []
      this.categorieTitle = 'Type'
      this.categorieRow = []
      this.visibilite = false;
    }
  }
  onPrinter() {
    if(this.type === 'USER'){
      this.userService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'SERVICE') {
      this.serviceService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onExport() {
    if(this.type === 'USER'){
      this.userService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'SERVICE') {
      this.serviceService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  addUser() {
    this.modalService.dismissAll()
    this.userService.edit = false
    this.modal(UserAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editUser(row) {
    this.modalService.dismissAll()
    this.userService.setUser(row)
    this.userService.edit = true
    this.modal(UserAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showUser(row) {
    this.userService.setUser(row)
    this.router.navigate(['/admin/user/show/'+row.uuid])
  }
  addPermission() {
    this.modalService.dismissAll()
    this.permissionService.edit = false
    this.modal(PermissionAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  addService() {
    this.modalService.dismissAll()
    this.serviceService.edit = false
    this.modal(ServiceAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  restPassword() {
    this.modalService.dismissAll()
    this.modal(UserRestPasswordComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  resetAccess() {
    this.modalService.dismissAll();
    this.modal(UserAccessComponent, 'modal-basic-title', 'md', true, 'static');
  }

  delete(user) {
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

        this.userService.getDelete(user.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.users.findIndex(x => x.uuid === user.uuid);
            if (index !== -1) {
              this.users.splice(index, 1);
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
    }).result.then((result) => { }, (reason) => { });
  }
}
