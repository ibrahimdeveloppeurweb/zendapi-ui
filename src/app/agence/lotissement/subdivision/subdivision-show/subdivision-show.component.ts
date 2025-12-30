import { SubdivisionAddComponent } from '@lotissement/subdivision/subdivision-add/subdivision-add.component';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subdivision } from '@model/subdivision';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Islet } from '@model/islet';
import { Lot } from '@model/lot';
import { ActivatedRoute } from '@angular/router';
import { FilterService } from '@service/filter/filter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { LotService } from '@service/lot/lot.service';
import { IsletService } from '@service/islet/islet.service';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { AddComponent } from '@agence/localisation/add/add.component';
import { LocalisationService } from '@service/localisation/localisation.service';
import * as mapboxgl from 'mapbox-gl';
import { ShowComponent } from '@agence/localisation/show/show.component';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
  selector: 'app-subdivision-show',
  templateUrl: './subdivision-show.component.html',
  styleUrls: ['./subdivision-show.component.scss']
})

export class SubdivisionShowComponent implements OnInit {
  public activeTab: string = 'LOTISSEMENT';
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  mtnFiltre: Boolean = false;
  bien: boolean = false;
  global = {country: Globals.country, device: Globals.device}
  subdivision: Subdivision = null;
  islets: Islet[]
  lot: Lot;
  lots: Lot[];
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  icon = { url: 'assets/images/map-geo.png', scaledSize: {height: 40, width: 40}}
  type: string = 'LOTISSEMENT';
  etatRow = [
    {label: 'DISPONIBLE', value: 'DISPONIBLE'},
    {label: 'INDISPONIBLE', value: 'INDISPONIBLE'}
  ];
  typeRow = [
    {label: 'LOTISSEMENT', value: 'LOTISSEMENT'},
    {label: 'ILOT', value: 'ILOT'},
    {label: 'LOT', value: 'LOT'}
  ];
  categorieRow = [
    {label: 'RURAL', value: 'RURAL'},
    {label: 'URBAIN', value: 'URBAIN'}
  ];
  nameTitle: string = "Projet de lotissement"
  userTitle: string = "Crée par"
  bienTitle: string = "Lotissement"
  minTitle: string = "Montant MIN"
  refTitle: string = "N° Référence"
  maxTitle: string = "Montant MAX"
  etatTitle: string = "Disponibilité ?"
  categorieTitle: string = "Type de lotissement";
  file: any;

  // Liste des variables qui concerne la maps
  map: mapboxgl.Map | any;
  draw: any;
  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private lotService: LotService,
    private uploader: UploaderService,
    private isletService: IsletService,
    private filterService: FilterService,
    private subdivisionService: SubdivisionService,
    private localisationService : LocalisationService

  ) {
    this.draw = new MapboxDraw({
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon',
    });
    this.onChangeLoad(this.type);
  }

  ngOnInit(): void {
    this.loadMap()
  }

  onFilter($event) {
    this.islets = []
    this.lots = []
    $event.type = this.activeTab
    this.filterService.search($event, 'subdivision', this.subdivision.uuid).subscribe(
      res => {
      if(this.activeTab === 'ILOT'){
        return this.islets = res;
      } else if(this.activeTab === 'LOT'){
        return this.lots = res;
      }
    }, err => { })
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if(type === 'LOTISSEMENT'){
      if(!this.subdivision){
        this.subdivisionService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          if (res.coordonnees.length > 0) {
            this.zooms(res)
          }
          return this.subdivision = res;
        });
      }
    } else if(type === 'ILOT'){
      this.mtnFiltre = false
      this.bienTitle = 'N° Ilot';
      this.bien = true;
      this.refTitle = "N° Référence"
      this.nameTitle = 'Lotissement'
      this.etatTitle = 'ETAT ESPACE ?'
      this.typeRow = [{label: 'ILOT', value: 'ILOT'}];
      this.categorieRow = []
      this.etatRow = [
        { label: 'ILOT DISPONIBLE', value: 'false' },
        { label: 'ESPACE VERT', value: 'true' }
      ];
      this.isletService.getList(this.subdivision.uuid).subscribe((res) => {
        return this.islets = res;
        }, error => {}
      );
    } else if (type === 'LOT') {
      this.mtnFiltre = true
      this.bienTitle = 'N° Lot';
      this.bien = true;
      this.refTitle = "N° Référence"
      this.categorieTitle = 'Type de lot'
      this.etatTitle = 'ETAT ?'
      this.typeRow = [{ label: 'LOT', value: 'LOT' }];
      this.etatRow = [
        { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ];
      this.categorieRow = []
      this.lotService.getList(this.subdivision.uuid).subscribe((res) => {
        return this.lots = res;
      }, error => { }
      );
    }
  }
  editPromotion(row) {
    this.subdivisionService.setSubdivision(row)
    this.subdivisionService.edit = true
    this.modal(SubdivisionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  mapF() {
    this.modalService.dismissAll()
    this.localisationService.edit = false
    this.localisationService.type = 'ILOT';
    this.localisationService.setLocalisation(this.subdivision)
    this.modal(AddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerSubdivision(row): void {
    this.subdivisionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  back(){ window.history.back(); }
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
      if (willDelete.dismiss) { }
      else {
        this.subdivisionService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {this.back()}
        });}
    });
  }
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
  }
  updateZoom(event): void {}
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  loadMap() {
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoia2FrYXNoaWhhdGFrZTIzIiwiYSI6ImNsaXU5cTdpaTAxMDEzZXM2cGtqb2t1bjAifQ.P9JjnJpCXSdWVaY0-DMVhg';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // sty
      center: [-4.008256, 5.359952],
      zoom: 12,
    });
    this.map.on('load', () => {
    this.map.resize();
      if (this.subdivision) {
        const sourceId = `source-${this.subdivision.uuid}`; // Générer un identifiant unique pour chaque source
        const layerId = `layer-${this.subdivision.uuid}`; // Générer un identifiant unique pour chaque couche
        const feat: any = {
          type: 'geojson',
          data: {
            type: 'Feature',
            color: '#1FF54F',
            properties: this.subdivision,
            geometry: {
              type: 'Polygon',
              coordinates: [this.subdivision.coordonnees]
            }
          }
        }

        // Ajouter la source de données GeoJSON
        this.map.addSource(sourceId, feat);

        // Ajouter une nouvelle couche pour visualiser le polygone
        this.map.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId, // Référence à la source de données
          layout: {},
          paint: {
            'fill-color': 'rgba(9, 91, 223, 0.85)', // Couleur de remplissage bleue
            'fill-opacity': 0.5
          }
        });

        // Ajouter une bordure noire autour du polygone
        this.map.addLayer({
          id: `outline-${this.subdivision.uuid}`,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': 'rgba(0, 0, 0, 0.85)',
            'line-width': 1,
          }
        });

        this.map.on('zoom', () => {
          const zoom = this.map.getZoom();
          if (zoom > 0 && zoom <= 10) {
            this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
            this.map.setPaintProperty(layerId, 'fill-opacity', 0.5);
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-dasharray', null);
          }else if (zoom > 10 && zoom <= 13){
            this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
            this.map.setPaintProperty(layerId, 'fill-opacity', 0.5);
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-dasharray', null);
          }else if (zoom > 13 && zoom <= 14){
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-color', 'rgb(255,0,0)');
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-dasharray', [4, 4]);
          }else if (zoom > 14){
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-color', 'rgb(255,0,0)');
            this.map.setPaintProperty(`outline-${this.subdivision.uuid}`, 'line-dasharray', [4, 4]);
          }
        });

      }
      // this.islets.forEach((item: any) => {
      //   const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
      //   const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
      //   const feat: any = {
      //     type: 'geojson',
      //     data: {
      //       type: 'Feature',
      //       color: '#1FF54F',
      //       properties: item,
      //       geometry: {
      //         type: 'Polygon',
      //         coordinates: [item.coordonnees]
      //       }
      //     }
      //   }

      //   // Ajouter la source de données GeoJSON
      //   this.map.addSource(sourceId, feat);

      //   // Ajouter une nouvelle couche pour visualiser le polygone
      //   this.map.addLayer({
      //     id: layerId,
      //     type: 'fill',
      //     source: sourceId, // Référence à la source de données
      //     layout: {},
      //     paint: {
      //       'fill-color': 'rgba(9, 91, 223, 0.85)', // Couleur de remplissage bleue
      //       'fill-opacity': 0.5
      //     }
      //   });

      //   // Ajouter une bordure noire autour du polygone
      //   this.map.addLayer({
      //     id: `outline-${item.uuid}`,
      //     type: 'line',
      //     source: sourceId,
      //     layout: {},
      //     paint: {
      //       'line-color': 'rgba(0, 0, 0, 0.85)',
      //       'line-width': 1,
      //     }
      //   });

      //   this.map.on('zoom', () => {
      //     const zoom = this.map.getZoom();
      //     if (zoom > 0 && zoom <= 10) {
      //       this.map.setPaintProperty(layerId, 'fill-color', null);
      //       this.map.setPaintProperty(layerId, 'fill-opacity', 0);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
      //     }else if (zoom > 10 && zoom <= 13){
      //       this.map.setPaintProperty(layerId, 'fill-color', null);
      //       this.map.setPaintProperty(layerId, 'fill-opacity', 0);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
      //     }else if (zoom > 13 && zoom <= 14){
      //       this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
      //       this.map.setPaintProperty(layerId, 'fill-opacity', 0.5);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
      //     }else if (zoom > 14){
      //       this.map.setPaintProperty(layerId, 'fill-color', null);
      //       this.map.setPaintProperty(layerId, 'fill-opacity', 0);
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
      //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
      //     }
      //   });

      //   // Ajouter un événement de clic pour afficher le modal
      //   // this.map.on('click', layerId, (e: any) => {
      //   //   e.originalEvent.stopPropagation()
      //   //   const clickedFeature = e.features[0];
      //   //   const properties = clickedFeature.properties;
      //   //   this.modalService.dismissAll()
      //   //   this.isletService.setIslet(properties)
      //   //   this.modal(ShowComponent, 'modal-basic-title', 'lg', true, 'static')
      //   // });
      // })
      // this.lots.forEach((item: any) => {
      //   const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
      //   const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
      //   const feat: any = {
      //     type: 'geojson',
      //     data: {
      //       type: 'Feature',
      //       color: '#1FF54F',
      //       properties: item,
      //       geometry: {
      //         type: 'Polygon',
      //         coordinates: [item.coordonnees]
      //       }
      //     }
      //   }

      //   // Ajouter la source de données GeoJSON
      //   this.map.addSource(sourceId, feat);

      //   // Ajouter une nouvelle couche pour visualiser le polygone
      //   this.map.addLayer({
      //     id: layerId,
      //     type: 'fill',
      //     source: sourceId, // Référence à la source de données
      //     layout: {},
      //     paint: {
      //       'fill-color': 'rgb(0,128,0)', // Couleur de remplissage bleue
      //       'fill-opacity': 1
      //     }
      //   });

      //   // Ajouter une bordure noire autour du polygone
      //   this.map.addLayer({
      //     id: `outline-${item.uuid}`,
      //     type: 'line',
      //     source: sourceId,
      //     layout: {},
      //     paint: {
      //       'line-color': 'rgba(0, 0, 0, 0.85)',
      //       'line-width': 1,
      //     }
      //   });

      //   this.map.on('zoom', () => {
      //     const zoom = this.map.getZoom();
      //     this.map.setPaintProperty(layerId, 'fill-color', 'rgb(0,128,0)');
      //     this.map.setPaintProperty(layerId, 'fill-opacity', 1);
      //     this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(0,0,0)');
      //     this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
      //   });

      //   // Ajouter un événement de clic pour afficher le modal
      //   this.map.on('click', layerId, (e: any) => {
      //     e.originalEvent.stopPropagation()
      //     const clickedFeature = e.features[0];
      //     const properties = clickedFeature.properties;
      //     this.modalService.dismissAll()
      //     this.lotService.setLot(properties)
      //     this.modal(ShowComponent, 'modal-basic-title', 'lg', true, 'static')
      //   });
      // })
    });
  }
  zooms(item) {
    var polygonCoordinates = item.coordonnees
    var bounds = new mapboxgl.LngLatBounds();
    polygonCoordinates.forEach(function (coordinate: any) {
      bounds.extend(coordinate);
    });
    this.map.fitBounds(bounds, { padding: 30 });
  }
}
