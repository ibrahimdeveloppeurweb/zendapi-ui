import { Setting } from '@model/setting';
import {NextConfig} from '@appRoot/app-config';
import { environment } from '@env/environment';
import { SettingService } from '@service/setting/setting.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public logo: string;
  public setting: any;
  public nextConfig: any;
  public menuClass: boolean;
  public windowWidth: number;
  public collapseStyle: string;

  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavHeaderMobCollapse = new EventEmitter();
  
  publicUrl = environment.publicUrl;

  constructor(
    private settingService: SettingService
  ) {
    this.menuClass = false;
    this.collapseStyle = 'none';
    this.nextConfig = NextConfig.config;
    this.windowWidth = window.innerWidth;
  }
  

  ngOnInit() { 
    this.getGeneralSetting();
  }

  getGeneralSetting() {
    this.logo = 'assets/images/logo.png'; // Assurer l'image par défaut au départ
    this.settingService.getSingle().subscribe({
      next: (res: any) => {
        if (res) {
          this.setting = res;
          this.logo = this.setting.photoSrc ? this.publicUrl + '/' + this.setting.photoSrc : this.logo;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des paramètres :", err);
      }
    });
  }
  
  
  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = (this.menuClass) ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.onNavCollapse.emit();
    } else {
      this.onNavHeaderMobCollapse.emit();
    }
  }

  //information generale 
  

  //

}
