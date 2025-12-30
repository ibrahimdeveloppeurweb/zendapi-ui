import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { AuthService } from '@service/auth/auth.service';
import { UserService } from '@service/user/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEditPasswordComponent } from '@utilisateur/user/user-edit-password/user-edit-password.component';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  user: any;
  publicUrl = environment.publicUrl;

  constructor(
    public router: Router,
    private userService: UserService,
    private modalService: NgbModal,
    private auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
  }

  ngOnInit() {
  }

  logout() {
    this.auth.logout(this.user?.uuid).subscribe(data => {
      if (data.code == 422) { return; }
      this.document.location.reload();
    }, error => { });
  }
  lock() {
    const data = { nom: this.user.nom, sexe: this.user.sexe, path: this.user.path, photo: this.user.photo, email: this.user.email};
    this.auth.removeDataToken()
    this.auth.removePermissionToken()
    this.auth.setDataLock(data)
    this.router.navigate(['/auth/lock/session']);
  }
  profil() {
    this.userService.profile = false
    console.log(this.user.uuid)
    this.router.navigate(['/admin/user/show/'+ this.user.uuid])
  }
  editPassword() {
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
}
