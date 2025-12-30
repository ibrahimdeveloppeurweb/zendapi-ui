import { ZenService } from './../../../../../service/zen360/zen.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { NavigationItem } from '../navigation';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NextConfig } from '../../../../../app-config';
import { AuthService } from '@service/auth/auth.service';
import { UserService } from '@service/user/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserEditPasswordComponent } from '@utilisateur/user/user-edit-password/user-edit-password.component';
import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, Inject, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  public nextConfig: any;
  public navigation: any;
  public prevDisabled: string;
  public nextDisabled: string;
  public contentWidth: number;
  public wrapperWidth: any;
  public scrollWidth: any;
  public windowWidth: number;
  public isNavProfile: boolean;
  user: any;
  publicUrl = environment.publicUrl;
  password = null
  @Output() onNavMobCollapse = new EventEmitter();

  @ViewChild('navbarContent', {static: false}) navbarContent: ElementRef;
  @ViewChild('navbarWrapper', {static: false}) navbarWrapper: ElementRef;

  constructor(
    public nav: NavigationItem,
    private zone: NgZone,
    public router: Router,
    private zenService: ZenService,
    private userService: UserService,
    private modalService: NgbModal,
    private auth: AuthService,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;

    this.nextConfig = NextConfig.config;
    this.windowWidth = window.innerWidth;

    this.navigation = this.nav.get();
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;

    this.isNavProfile = false;
    this.userService.getPassword(this.user.uuid).subscribe(res => { return this.password = res.password; }, error => {});
  }

  ngOnInit() {
    if (this.windowWidth < 992) {
      this.nextConfig['layout'] = 'vertical';
      setTimeout(() => {
        document.querySelector('.pcoded-navbar').classList.add('menupos-static');
        (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = '100%';
      }, 500);
    }
  }

  ngAfterViewInit() {
    if (this.nextConfig['layout'] === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }
  onZen360(){
    if(this.password) {
      const dataRegister = {
        email: this.user?.email,
        username:  this.user?.nom,
        password: this.password,
        plan_id: 1
      }
      this.zenService.register(dataRegister).subscribe(
        response => {
          this.onZen360Login()
        },
        error => {
          console.log(error)
        }
      );
      this.zenService.register(dataRegister).subscribe(res => {
        if (res) {
          this.onZen360Login()
        }
      });
    }
  }
  onZen360Login(){
    const dataLogin = {
      password: this.password,
      username: this.user?.email
    }
    this.zenService.login(dataLogin).subscribe(res => {
      if (res) {
        if(res && res.login_url){
          window.open(res.login_url, '_blank');
        }
      }
    });
  }
  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > (this.contentWidth - this.wrapperWidth)) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    if(this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    if(this.nextConfig.rtlLayout) {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginRight = '-' + this.scrollWidth + 'px';
    } else {
      (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
    }

  }

  fireLeave() {
    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('pcoded-trigger');
    }

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.onNavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if(up_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

  logout() {
    this.auth.removeDataToken();
    this.auth.removePermissionToken();
    this.router.navigate(['/auth/login']);
    this.document.location.reload();
  }

  profilUser() {
    this.userService.profile = false
    console.log(this.user.uuid)
    this.router.navigate(['/admin/user/show/'+this.user.uuid])
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
