import { NgxPermissionsService } from 'ngx-permissions';
import { UserAddComponent } from '@utilisateur/user/user-add/user-add.component';
import { Permission } from '@model/permission';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { User } from '@model/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@service/user/user.service';
import { FilterService } from '@service/filter/filter.service';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import {environment} from '@env/environment';
import { UserEditPasswordComponent } from '@utilisateur/user/user-edit-password/user-edit-password.component';
import { AttributionService } from '@service/attribution/attribution.service';
import { UserImgComponent } from '../user-img/user-img.component';

@Component({
  selector: 'app-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.scss']
})
export class UserShowComponent implements OnInit {
  global = {country: Globals.country, device: Globals.device}
  publicUrl = environment.publicUrl;
  filter: any
  user: User
  profile: boolean = true
  permissions: Permission[];
  houses: any[];
  public activeTab: string = 'USER';
  type: string = 'USER';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService,
    private atributionService: AttributionService,
    private permissionsService: NgxPermissionsService
  ) {
    this.profile = this.userService.profile
    this.onChangeLoad(this.type);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }
  onChangeLoad(type): void {
    this.houses = []
    this.activeTab = type;
    if (type === 'USER') {
      this.userService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.user = res
      });
    }
  }

  password() {
    this.userService.editPassword(this.route.snapshot.params.id).subscribe((res: any) => {
      return this.user = res
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
        this.userService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/security/user']) }
        });
      }
    });
  }
  img() {
    // this.userService.editImg(this.route.snapshot.params.id).subscribe((res: any) => {
    //   return this.user = res
    // });

    this.userService.setUser(this.user)
    this.modal(UserImgComponent, 'modal-basic-title', 'sm', true, 'static')
  }
  editPassword(){
    this.userService.setUser(this.user)
    this.modal(UserEditPasswordComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  back(){ this.router.navigate(['/admin/user']) }
}
