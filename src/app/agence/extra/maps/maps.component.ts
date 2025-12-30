import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { environment } from '@env/environment';
import { FilterService } from '@service/filter/filter.service';
import { HouseService } from '@service/house/house.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MapsComponent implements OnInit {
  publicUrl = environment.publicUrl;
  filter: any
  type: string = ""
  lat = Globals.lat;
  lng = Globals.lng;
  global = {country: Globals.country, device: Globals.device}
  zoom = Globals.zoom;
  biens = []
  etatRow = [
    { label: 'DISPONIBLE', value: 'DISPONIBLE' },
    { label: 'VENDU', value: 'VENDU' },
    { label: 'RESERVE', value: 'RESERVE' }
  ]
  typeRow = [
    { label: 'BIEN PROPRIETAIRE', value: 'BIEN' },
    { label: 'PROMOTION', value: 'PROMOTION' },
    { label: 'LOTISSEMENT', value: 'LOTISSEMENT' }
  ]
  nameTitle: string = "Nom du bien"
  etatTitle: string = "Disponibilité ?"
  title: string = "Geolocalisation des biens"
  icon = { url: 'assets/images/map-geo.png', scaledSize: {height: 40, width: 40}}

  constructor(
    private filterService: FilterService,
    private houseService: HouseService
  ) {
    this.houseService.getList().subscribe(res => { return this.biens = res }, error => {})
  }

  ngOnInit(): void {
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.biens = []
    this.filterService.search($event, 'maps', null).subscribe(
      res => {
        if(this.type === 'BIEN'){
          this.biens = res;
          return this.biens;
        } else if(this.type === 'PROMOTION'){
          this.biens = res;
          return this.biens;
        } else if(this.type === 'LOTISSEMENT'){
          this.biens = res;
          return this.biens;
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    this.icon = {url: '', scaledSize: {height: 0, width: 0}}
    if($event === 'BIEN'){
      this.icon = { url: 'assets/images/map-geo.png', scaledSize: {height: 40, width: 40}}
      this.title = 'Geolocalisation des biens'
      this.nameTitle = 'Nom du bien'
      this.etatRow = [];
    } else if($event === 'PROMOTION'){
      this.icon = { url: 'https://img.icons8.com/nolan/2x/marker.png', scaledSize: {height: 40, width: 40}}
      this.title = 'Geolocalisation des promotions'
      this.nameTitle = 'Nom du promotion'
    } else if($event === 'LOTISSEMENT'){
      this.icon = { url: 'assets/images/map-lot.png', scaledSize: {height: 40, width: 40}}
      this.title = 'Geolocalisation des lotissements'
      this.nameTitle = 'Nom du lotissement'
    }
  }
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
  }
  updateZoom(event): void {}
}
