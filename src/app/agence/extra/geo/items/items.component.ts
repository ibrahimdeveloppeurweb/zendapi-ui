import {Component, EventEmitter, NgZone, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {NextConfig} from '@appRoot/app-config';
import {Location} from '@angular/common';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { Subdivision } from '@model/subdivision';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemsComponent implements OnInit {
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
  @Output() zoom = new EventEmitter();
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
  lotissements: Subdivision[] = []
  constructor(
    private zone: NgZone, 
    private location: Location,
    private lotissementService: SubdivisionService
  ) {
    this.nextConfig = NextConfig.config;
    this.lotissementService.getList().subscribe((res) => {
      return this.lotissements = res
    })
  }
  ngOnInit() {
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
  onClick(item){
    this.zoom.emit(item);
  }
}