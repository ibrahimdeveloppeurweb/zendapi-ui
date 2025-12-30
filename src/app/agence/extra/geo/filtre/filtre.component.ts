import {Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import {NextConfig} from '@appRoot/app-config';
import {Location} from '@angular/common';
@Component({
  selector: 'app-filtre',
  templateUrl: './filtre.component.html',
  styleUrls: ['./filtre.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FiltreComponent implements OnInit {
  public styleSelectorToggle: boolean; // open configuration menu
  public layoutType: string; // layout type
  public rtlLayout: any; // rtl type
  public menuFixedLayout: any; // menu/navbar fixed flag
  public headerFixedLayout: any; // header fixed flag
  public boxLayout: any; // box layout flag
  public headerBackgroundColor: string; // header background color
  public headerBackColor: string;
  public nextConfig: any;
  public isConfig: boolean;
  scroll = (): void => {
    if (this.headerFixedLayout === false) {
      (document.querySelector('#nav-ps-next') as HTMLElement).style.maxHeight = 'calc(100vh)';
      const el = document.querySelector('.pcoded-navbar.menupos-fixed') as HTMLElement;
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 60) {
        el.style.position = 'fixed';
        el.style.transition = 'none';
        el.style.marginTop = '0';
      } else {
        el.style.position = 'absolute';
        el.style.marginTop = '60px';
      }
    } else if (document.querySelector('.pcoded-navbar').hasAttribute('style')) {
      document.querySelector('.pcoded-navbar.menupos-fixed').removeAttribute('style');
    }
  }
  constructor(private zone: NgZone, private location: Location) {
    this.nextConfig = NextConfig.config;
  }
  ngOnInit() {
    console.log();
    this.styleSelectorToggle = false;
    this.layoutType =  this.nextConfig.layoutType;
    this.setLayout(this.layoutType);
    this.headerBackgroundColor = this.nextConfig.headerBackColor;
    this.rtlLayout = this.nextConfig.rtlLayout;
    this.menuFixedLayout = this.nextConfig.navFixedLayout;
    if (this.nextConfig.layout === 'vertical') {
    }
    this.headerFixedLayout = this.nextConfig.headerFixedLayout;
    this.boxLayout = this.nextConfig.boxLayout;
  }
  // change main layout
  setLayout(layout) {
    this.isConfig = true;
  }
}
