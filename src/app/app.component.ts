import { Subscription } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { UserService } from '@service/user/user.service';
import { RateComponent } from '@modal/rate/rate.component';
import { HttpConnectivity, InternetConnectivity } from 'ngx-connectivity';
import { UserEditPasswordComponent } from '@utilisateur/user/user-edit-password/user-edit-password.component';
import { MercureService } from '@service/mercure/mercure.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { WalletUpgradeComponent } from '@agence/modal/wallet-upgrade/wallet-upgrade.component';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Input() formSubmitted =new FormControl(true);

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })
  @ViewChild('content', { static: true }) private content;
  user: any;
  rate: any;

  subscription: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    private userService: UserService,
    public httpConnectivity: HttpConnectivity,
    public internetConnectivity: InternetConnectivity,
    private mercureService: MercureService,
    private emitter: EmitterService,
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.rate = this.auth.getRateToken() ? this.auth.getRateToken() : null;
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.subscription = this.internetConnectivity.isOnline$.subscribe(
      d => {
        if (!d) {
          Swal.fire({
            title: 'OUPS !',
            text: 'Pas de connexion internet !',
            icon: 'question',
            iconHtml: '<i class="feather icon-wifi-off" width="50" height="50"></i>',
            timer: 4000,
            allowOutsideClick: false,
            showConfirmButton: false,
          })
        }
      }
    )

    if (this.user?.lastLogin === null) {
      Swal.fire({
        title: 'Bienvenue!',
        text: 'Merci de nous avoir rejoint !',
        imageUrl: './../assets/images/welcome.png',
        imageWidth: 200,
        imageHeight: 200,
        allowOutsideClick: false,
        showCloseButton: false,
        focusConfirm: false,
        confirmButtonText: 'Ok <i class="fa fa-thumbs-up"></i>',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.type = 'first'
          this.modal(UserEditPasswordComponent, 'modal-basic-title', 'lg', true, 'static')
        }
      })
    }


    var date = new Date();
    if (this.rate && !this.rate.isRate && date.getDate() == 15) {
      this.modal(RateComponent, 'modal-basic-title', 'lg', true, 'static')
    }
    // this.mercureService.getServerSentEvent(`https://zenapi.com/api/private/agency/ticket/user/${this.user?.uuid}`).subscribe((data) => {
    //   this.emitter.emit({ action: 'CHAT_ADD', payload: (JSON.parse(data.data)) as Chat });
    //   this.Toast.fire({
    //     icon: 'info',
    //     title: 'Nouveau message',
    //     text: 'Vous avez recu un nouveau message de ticket'
    //   })
    // });
    // if (this.user !== null && !this.user.isUpdate) {
    //   this.modal(this.content, 'modal-basic-title', 'lg', true, 'static')
    // }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  upgradeModal() {
    this.modal(WalletUpgradeComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  modal(component, type, size, center, backdrop, style?): void {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}


