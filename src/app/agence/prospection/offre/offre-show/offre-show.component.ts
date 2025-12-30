import { Location } from '@angular/common';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreService } from '@service/offre/offre.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UploaderService } from '@service/uploader/uploader.service';


@Component({
  selector: 'app-offre-show',
  templateUrl: './offre-show.component.html',
  styleUrls: ['./offre-show.component.scss']
})
export class OffreShowComponent implements OnInit {

  offre: any
  options: any[] = []
  offres: any[] = []
  files: any
  viewImage: number
  public trafficChartData: any;
  file: any
  global = {country: Globals.country, device: Globals.device}
  publicUrl = environment.publicUrl
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  public activeTab: string = 'DASHBOARD';
  public slideImage: number;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    public config: NgbCarouselConfig,
    private uploader: UploaderService,
    private offreService: OffreService
  ) {
    this.slideImage = 0;
    this.config.interval = 1000;
		this.config.wrap = false;
		this.config.keyboard = false;
		this.config.pauseOnHover = false;

    this.viewImage = 1;

    this.onChangeLoad(this.activeTab);
    this.offreService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
      return this.offre = res
    })
   }

  ngOnInit(): void {
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'DASHBORAD') {
    } else if (type === 'LOT') {
      this.offreService.getList(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.offres = res
      })

    } else if (type === 'RESERVATION') {
    }
  }

  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

  back() { this.location.back();}
}
