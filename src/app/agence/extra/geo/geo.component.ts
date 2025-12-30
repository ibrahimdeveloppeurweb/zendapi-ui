import * as mapboxgl from 'mapbox-gl';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Subdivision } from '@model/subdivision';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from '@service/emitter/emitter.service';
import { PromotionService } from '@service/promotion/promotion.service';
import { IsletService } from '@service/islet/islet.service';
import { Islet } from '@model/islet';
import { LotService } from '@service/lot/lot.service';
import { Lot } from '@model/lot';
import { ShowComponent } from './show/show.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {
  ilot: boolean = false;
  lot: boolean = false;
  mtnFiltre: Boolean = false;
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = { country: Globals.country, device: Globals.device };
  filter: any;
  type: string = 'PROMOTION';
  etatRow = [
    { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
    { label: 'DISPONIBLE', value: 'DISPONIBLE' }
  ];
  userTitle: string = "Crée par";
  nameTitle: string = "Promotion";
  ilotTitle: string = "N° Ilot";
  lotTitle: string = "N° Lot";
  minTitle: string = "Montant MIN";
  maxTitle: string = "Montant MAX";
  etatTitle: string = "Disponibilité ?";
  cookie: string = "";
  // Liste des variables qui concerne la maps
  map: mapboxgl.Map | any;
  draw: any;
  lotissements: Subdivision[] = []
  islets: Islet[] = []
  lots: Lot[] = []
  // Liste des variables pour le filtre
  form: FormGroup
  advance = false
  typeM = null
  uuid = null
  isletUuid = null
  lotUuid = null
  mode = null
  isSubmit = false
  typeRow = [
    { label: 'LOTISSEMENT', value: 'LOTISSEMENT' },
    { label: 'ILOT', value: 'ILOT' },
    { label: 'LOT', value: 'LOT' },
    { label: 'PROMOTION', value: 'PROMOTION' },
    { label: 'MAISON', value: 'MAISON' }
  ];
  paysRow = [
    { label: "Cote d'ivoire", value: "Cote d'ivoire" },
    { label: 'Benin', value: 'Benin' },
    { label: 'Mali', value: 'Mali' },
    { label: 'Niger', value: 'Niger' },
    { label: 'Nigeria', value: 'Nigeria' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunisie', value: 'Tunisie' },
    { label: 'Togo', value: 'Togo' }
  ];
  villeRow = [
    { label: "Abidjan", value: "Abidjan" },
    { label: 'Yamoussokro', value: 'Yamoussokro' },
    { label: 'Bouake', value: 'Bouake' },
    { label: 'San pedro', value: 'San pedro' },
    { label: 'Lakota', value: 'Lakota' },
    { label: 'Grand-Bassam', value: 'Grand-Bassam' },
    { label: 'Bingerville', value: 'Bingerville' },
    { label: 'Korhogo', value: 'Korhogo' }
  ];
  tooltip: any = null
  dataRow: any[] = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private lotService: LotService,
    private emitter: EmitterService,
    private isletService: IsletService,
    private promotionService: PromotionService,
    private lotissementService: SubdivisionService
  ) {
    this.newForm()

    this.uuid = this.route.snapshot.params.id
    this.mode = this.route.snapshot.params.mode
    this.typeM = this.route.snapshot.params.type

    // this.loadData()
    this.draw = new MapboxDraw({
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon',
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoia2FrYXNoaWhhdGFrZTIzIiwiYSI6ImNsaXU5cTdpaTAxMDEzZXM2cGtqb2t1bjAifQ.P9JjnJpCXSdWVaY0-DMVhg';
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // sty
      center: [-4.008256, 5.359952],
      zoom: 12
    });

    this.loadData()
  }
  newForm() {
    if (this.typeM == 'LOTISSEMENT' || this.typeM == 'PROMOTION' || this.typeM == 'PATRIMOINE') {
      this.form = this.formBuild.group({
        id: [null],
        uuid: [null],
        nb: [null],
        type: ['DESSINER', [Validators.required]],
        entity: [this.uuid, [Validators.required]],
        options: this.formBuild.array([]),
        coordonnees: this.formBuild.array([])
      })
    } else {
      this.form = this.formBuild.group({
        id: [null],
        uuid: [null],
        type: ['DESSINER', [Validators.required]],
        options: this.formBuild.array([]),
        coordonnees: this.formBuild.array([])
      })
    }
  }
  loadData() {
    if (this.mode == 'LIST' || this.mode == 'EDIT') {
      this.lotissementService.getCoords().subscribe((res) => {
        res.forEach(item => {
          if (item.coordonnees && item.coordonnees.length > 0) {
            this.lotissements.push(item)
          }
        });
        return this.lotissements
      })
      this.isletService.getCoords().subscribe((res) => {
        res.forEach(item => {
          if (item.coordonnees && item.coordonnees.length > 0) {
            this.islets.push(item)
          }
        });
        return this.islets
      })
      this.lotService.getCoords().subscribe((res) => {
        res.forEach(item => {
          if (item.coordonnees && item.coordonnees.length > 0) {
            this.lots.push(item)
          }
        });
        return this.lots
      })
    } else if (this.mode == 'ADD' && this.uuid && this.uuid != null) {
      if (this.typeM == 'LOTISSEMENT' || this.typeM == 'ILOT') {
        this.lotissementService.getSingle(this.uuid).subscribe((res) => {
          if (res) {
            if (res.coordonnees && res.coordonnees.length > 0) {
              this.lotissements.push(res)
            }
          }
          return this.lotissements
        })
        if (this.typeM == 'ILOT') {
          this.isletService.getCoords(this.uuid).subscribe((res) => {
            res.forEach(item => {
              this.islets.push(item);
            });
            return this.islets
          })
        }
      }
      if (this.typeM == 'LOT') {
        this.isletService.getSingle(this.uuid).subscribe((res) => {
          if (res) {
            if (res.coordonnees && res.coordonnees.length > 0) {
              this.islets.push(res)
            }
          }
          return this.islets
        })
        this.lotService.getCoords(null, this.uuid).subscribe((res) => {
          res.forEach(item => {
            this.lots.push(item);
          });
          return this.lots;
        })
      }
    }


    this.loadMap()
  }
  loadMap() {
    if (this.mode == 'ADD' || this.mode == 'EDIT') {
      this.map.addControl(this.draw);
      this.map.on('draw.create', (event) => {
        const newFeatures = event.features;
        if (this.typeM == 'LOTISSEMENT' || this.typeM == 'PROMOTION' || this.typeM == 'PATRIMOINE') {
          this.isSubmit = newFeatures[0] ? true : false;
          this.onLoadCoordonnees(newFeatures[0].geometry.coordinates[0])
        } else if (this.typeM == 'ILOT') {
          const lastPolygon = newFeatures[newFeatures.length - 1];
          this.addIlotCoordonnee(lastPolygon.geometry.coordinates[0])
        } else if (this.typeM == 'LOT') {
          const lastPolygon = newFeatures[newFeatures.length - 1];
          this.addLotCoordonnee(lastPolygon.geometry.coordinates[0])
        }
      });
    }
    // Ajouter les couches après que la carte soit initialisée
    this.addLotissements();
    this.addIslets();
    this.addLots();

    // this.map.on('load', () => {
    //   this.lotissements.forEach((item: any) => {
    //     const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
    //     const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
    //     const feat: any = {
    //       type: 'geojson',
    //       data: {
    //         type: 'Feature',
    //         color: '#1FF54F',
    //         properties: item,
    //         geometry: {
    //           type: 'Polygon',
    //           coordinates: [item.coordonnees]
    //         }
    //       }
    //     }

    //     // Ajouter la source de données GeoJSON
    //     this.map.addSource(sourceId, feat);

    //     // Ajouter une nouvelle couche pour visualiser le polygone
    //     this.map.addLayer({
    //       id: layerId,
    //       type: 'fill',
    //       source: sourceId, // Référence à la source de données
    //       layout: {},
    //       paint: {
    //         'fill-color': 'rgba(9, 91, 223, 0.85)', // Couleur de remplissage bleue
    //         'fill-opacity': 0.5
    //       }
    //     });

    //     // Ajouter une bordure noire autour du polygone
    //     this.map.addLayer({
    //       id: `outline-${item.uuid}`,
    //       type: 'line',
    //       source: sourceId,
    //       layout: {},
    //       paint: {
    //         'line-color': 'rgba(0, 0, 0, 0.85)',
    //         'line-width': 1,
    //       }
    //     });

    //     this.map.on('zoom', () => {
    //       const zoom = this.map.getZoom();
    //       if (zoom > 0 && zoom <= 10) {
    //         this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 1);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //       }else if (zoom > 10 && zoom <= 13){
    //         this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 1);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //       }else if (zoom > 13 && zoom <= 14){
    //         this.map.setPaintProperty(layerId, 'fill-color', null);
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 0);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(255,0,0)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
    //       }else if (zoom > 14){
    //         this.map.setPaintProperty(layerId, 'fill-color', null);
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 0);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(255,0,0)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
    //       }
    //     });
    //   })
    //   this.islets.forEach((item: any) => {
    //     const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
    //     const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
    //     const feat: any = {
    //       type: 'geojson',
    //       data: {
    //         type: 'Feature',
    //         color: '#1FF54F',
    //         properties: item,
    //         geometry: {
    //           type: 'Polygon',
    //           coordinates: [item.coordonnees]
    //         }
    //       }
    //     }

    //     // Ajouter la source de données GeoJSON
    //     this.map.addSource(sourceId, feat);
    //     // Ajouter une nouvelle couche pour visualiser le polygone
    //     this.map.addLayer({
    //       id: layerId,
    //       type: 'fill',
    //       source: sourceId, // Référence à la source de données
    //       layout: {},
    //       paint: {
    //         'fill-color': '#00FFFF', // Couleur de remplissage bleue
    //         'fill-opacity': 1
    //       }
    //     });

    //     // Ajouter une bordure noire autour du polygone
    //     this.map.addLayer({
    //       id: `outline-${item.uuid}`,
    //       type: 'line',
    //       source: sourceId,
    //       layout: {},
    //       paint: {
    //         'line-color': 'rgba(0, 0, 0, 0.85)',
    //         'line-width': 1,
    //       }
    //     });

    //     this.map.on('zoom', () => {
    //       const zoom = this.map.getZoom();
    //       if (zoom > 0 && zoom <= 10) {
    //         this.map.setPaintProperty(layerId, 'fill-color', null);
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 0);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //       }else if (zoom > 10 && zoom <= 13){
    //         this.map.setPaintProperty(layerId, 'fill-color', null);
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 0);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //       }else if (zoom > 13 && zoom <= 14){
    //         this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 1);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //       }else if (zoom > 14){
    //         this.map.setPaintProperty(layerId, 'fill-color', null);
    //         this.map.setPaintProperty(layerId, 'fill-opacity', 0);
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
    //         this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
    //       }
    //     });
    //   })
    //   this.lots.forEach((item: any) => {
    //     const color = item?.etat === 'INDISPONIBLE' ? '#928B92' : item?.etat === 'DISPONIBLE' ? '#3FDB2A' : item?.etat === 'RESERVE' ? '#F7DE5F' : '#FF332C'
    //     const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
    //     const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
    //     const feat: any = {
    //       type: 'geojson',
    //       data: {
    //         type: 'Feature',
    //         color: color,
    //         properties: item,
    //         geometry: {
    //           type: 'Polygon',
    //           coordinates: [item.coordonnees]
    //         }
    //       }
    //     }

    //     // Ajouter la source de données GeoJSON
    //     this.map.addSource(sourceId, feat);

    //     // Ajouter une nouvelle couche pour visualiser le polygone
    //     this.map.addLayer({
    //       id: layerId,
    //       type: 'fill',
    //       source: sourceId, // Référence à la source de données
    //       layout: {},
    //       paint: {
    //         'fill-color': color,
    //         'fill-opacity': 1,
    //       }
    //     });

    //     // Ajouter une bordure noire autour du polygone
    //     this.map.addLayer({
    //       id: `outline-${item.uuid}`,
    //       type: 'line',
    //       source: sourceId,
    //       layout: {},
    //       paint: {
    //         'line-color': 'rgb(0,0,0)',
    //         'line-width': 1,
    //       }
    //     });

    //     this.map.on('zoom', () => {
    //       const zoom = this.map.getZoom();
    //       this.map.setPaintProperty(layerId, 'fill-color', color);
    //       this.map.setPaintProperty(layerId, 'fill-opacity', 1);
    //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(0,0,0)');
    //       this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
    //     });

    //     // Ajouter un événement de clic pour afficher le modal
    //     this.map.on('click', layerId, (e: any) => {
    //       e.originalEvent.stopPropagation()
    //       const clickedFeature = e.features[0]; 
    //       const properties = clickedFeature.properties; 
    //       this.modalService.dismissAll()
    //       this.lotService.setLot(properties)
    //       this.modal(ShowComponent, 'modal-basic-title', 'lg', true, 'static')
    //     });
    //   })
    // });
  }
  addLotissements() {
    this.map.on('load', () => {
      this.lotissements.forEach((item: any) => {
        const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
        const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
        const feat: any = {
          type: 'geojson',
          data: {
            type: 'Feature',
            color: '#1FF54F',
            properties: item,
            geometry: {
              type: 'Polygon',
              coordinates: [item.coordonnees]
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
          id: `outline-${item.uuid}`,
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
            this.map.setPaintProperty(layerId, 'fill-opacity', 1);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
          } else if (zoom > 10 && zoom <= 13) {
            this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
            this.map.setPaintProperty(layerId, 'fill-opacity', 1);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
          } else if (zoom > 13 && zoom <= 14) {
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(255,0,0)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
          } else if (zoom > 14) {
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgb(255,0,0)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
          }
        });
      })
    })
  }

  addIslets() {
    this.map.on('load', () => {
      this.islets.forEach((item: any) => {
        const sourceId = `source-${item.uuid}`; // Générer un identifiant unique pour chaque source
        const layerId = `layer-${item.uuid}`; // Générer un identifiant unique pour chaque couche
        const feat: any = {
          type: 'geojson',
          data: {
            type: 'Feature',
            color: '#1FF54F',
            properties: item,
            geometry: {
              type: 'Polygon',
              coordinates: [item.coordonnees]
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
            'fill-color': '#00FFFF', // Couleur de remplissage bleue
            'fill-opacity': 1
          }
        });

        // Ajouter une bordure noire autour du polygone
        this.map.addLayer({
          id: `outline-${item.uuid}`,
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
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
          } else if (zoom > 10 && zoom <= 13) {
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', null);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
          } else if (zoom > 13 && zoom <= 14) {
            this.map.setPaintProperty(layerId, 'fill-color', 'rgba(9, 91, 223, 0.85)');
            this.map.setPaintProperty(layerId, 'fill-opacity', 1);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', null);
          } else if (zoom > 14) {
            this.map.setPaintProperty(layerId, 'fill-color', null);
            this.map.setPaintProperty(layerId, 'fill-opacity', 0);
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-color', 'rgba(0, 0, 0, 0.85)');
            this.map.setPaintProperty(`outline-${item.uuid}`, 'line-dasharray', [4, 4]);
          }
        });
      })
    })
  }

  addLots() {
    this.map.on('load', () => {
      this.lots.forEach((item: any) => {
        const color = this.getColorFromEtat(item?.etat);
        const sourceId = `source-${item?.uuid}`;
        const layerId = `layer-${item?.uuid}`;
        const feat: any = {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: item,
            geometry: {
              type: 'Polygon',
              coordinates: [item?.coordonnees]
            }
          }
        };
    
        // Ajouter la source de données GeoJSON
        this.map.addSource(sourceId, feat);
    
        // Ajouter une couche pour visualiser le polygone
        this.map.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          layout: {},
          paint: {
            'fill-color': color,
            'fill-opacity': 1,
          }
        });
    
        // Ajouter une bordure noire autour du polygone
        this.map.addLayer({
          id: `outline-${item?.uuid}`,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': 'rgb(0,0,0)',
            'line-width': 1,
          }
        });
    
        // Gérer les clics sur cette couche
        this.map.on('click', layerId, (e: any) => {
          const clickedItem = this.getClickedItem(e);
          if (clickedItem) {
            this.modalService.dismissAll();
            this.lotService.setLot(clickedItem);
            this.modal(ShowComponent, 'modal-basic-title', 'lg', true, 'static');
          }
        });
      });
    });
  }
  // Fonction pour obtenir l'élément cliqué
  getClickedItem(event: any): any {
    const features = this.map.queryRenderedFeatures(event.point);
    const clickedFeature = features.find((feature: any) => feature.layer && feature.layer.id.startsWith('layer-'));
    return clickedFeature ? clickedFeature.properties : null;
  }
  // Fonction pour obtenir la couleur en fonction de l'état
  getColorFromEtat(etat: string): string {
    switch (etat) {
      case 'INDISPONIBLE':
        return '#928B92';
      case 'DISPONIBLE':
        return '#3FDB2A';
      case 'RESERVE':
        return '#F7DE5F';
      default:
        return '#FF332C';
    }
  }

  showTooltip(properties) {
    // Créez une infobulle ou un tooltip personnalisé ici et affichez les informations
    // Vous pouvez utiliser une librairie comme Mapbox GL JS Popup pour cela
    // Par exemple :
    const popup = new mapboxgl.Popup()
      .setLngLat([properties.longitude, properties.latitude])
      .setHTML(`<p>${properties.nom}</p>`)
      .addTo(this.map);

    this.tooltip = popup; // Stockez la référence à l'infobulle pour pouvoir la masquer ultérieurement
  }
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.remove(); // Supprime l'infobulle ou le tooltip
      this.tooltip = null; // Réinitialise la référence
    }
  }
  zooms(item) {
    var polygonCoordinates = item.coordonnees
    var bounds = new mapboxgl.LngLatBounds();
    polygonCoordinates.forEach(function (coordinate: any) {
      bounds.extend(coordinate);
    });
    this.map.fitBounds(bounds, { padding: 20 });
  }
  edit() {
    if (this.typeM == 'LOTISSEMENT' || this.typeM == 'PROMOTION' || this.typeM == 'PATRIMOINE') {
      this.draw.deleteAll()
    }
    if (this.typeM == 'ILOT') {
      Swal.fire({
        title: "Veuillez selectionner l'ilot ",
        input: 'select',
        inputOptions: this.generateOptions(this.islets),
        inputClass: 'select-container', /// Appel de la fonction pour générer les options
        showCancelButton: true,
        confirmButtonText: 'Dessiner',
        showLoaderOnConfirm: true,
        preConfirm: (selectedValue) => {
          const value = this.islets[selectedValue].uuid;
          this.isletUuid = value
          this.draw.changeMode('draw_polygon');
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
      });
    } else if (this.typeM == 'LOT') {
      console.log(this.lots)
      Swal.fire({
        title: "Veuillez selectionner le lot ",
        input: 'select',
        inputOptions: this.generateOptions(this.lots),
        inputClass: 'select-container', /// Appel de la fonction pour générer les options
        showCancelButton: true,
        confirmButtonText: 'Dessiner',
        showLoaderOnConfirm: true,
        preConfirm: (selectedValue) => {
          const value = this.lots[selectedValue].uuid;
          this.lotUuid = value
          this.draw.changeMode('draw_polygon');
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
      });
    } else {
      this.draw.changeMode('draw_polygon');
    }
  }
  generateOptions(items) {
    const options = {};
    items.forEach((item, index) => {
      options[index] = item.searchableTitle;
    });
    return options;
  }
  onLoadCoordonnees(array) {
    let nb = array.length
    this.f.nb.setValue(nb)
    array.forEach((item, i) => {
      var num = i + 1;
      this.coordonnees.push(
        this.formBuild.group({
          id: [null],
          uuid: [null],
          point: [{ value: num, disabled: true }, [Validators.required]],
          lng: [{ value: item[0], disabled: false }, [Validators.required]],
          lat: [{ value: item[1], disabled: false }, [Validators.required]]
        })
      );

    });
  }
  addIlotCoordonnee(polygon) {
    let nb = polygon.length
    this.options.push(
      this.formBuild.group({
        entity: [{ value: this.isletUuid, disabled: true }, [Validators.required]],
        nb: [nb, [Validators.required]],
        coordonnees: this.formBuild.array([])
      })
    );
    polygon.forEach((item, i) => {
      var num = i + 1;
      // @ts-ignore
      this.options.at(this.options.length - 1).get('coordonnees').push(
        this.formBuild.group({
          point: [{ value: num, disabled: true }, [Validators.required]],
          lng: [{ value: item[0], disabled: false }, [Validators.required]],
          lat: [{ value: item[1], disabled: false }, [Validators.required]]
        })
      );
    })

    const index = this.islets.findIndex(x => x.uuid === this.isletUuid);
    if (index !== -1) {
      this.islets.splice(index, 1);
    }
    this.isletUuid = null
    this.isSubmit = this.options.length > 0 ? true : false;
  }
  addLotCoordonnee(polygon) {
    let nb = polygon.length
    this.options.push(
      this.formBuild.group({
        entity: [{ value: this.lotUuid, disabled: true }, [Validators.required]],
        nb: [nb, [Validators.required]],
        coordonnees: this.formBuild.array([])
      })
    );
    polygon.forEach((item, i) => {
      var num = i + 1;
      // @ts-ignore
      this.options.at(this.options.length - 1).get('coordonnees').push(
        this.formBuild.group({
          point: [{ value: num, disabled: true }, [Validators.required]],
          lng: [{ value: item[0], disabled: false }, [Validators.required]],
          lat: [{ value: item[1], disabled: false }, [Validators.required]]
        })
      );
    })

    const index = this.lots.findIndex(x => x.uuid === this.lotUuid);
    if (index !== -1) {
      this.lots.splice(index, 1);
    }
    this.lotUuid = null
    this.isSubmit = this.options.length > 0 ? true : false;
  }
  onSubmit() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.save();
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
  save() {
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      if (this.typeM == 'LOTISSEMENT') {
        this.lotissementService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
            this.router.navigate(['/outils/geo-localisation/' + null + '/' + 'LOTISSEMENT' + '/' + 'ADD'])
          },
          error => { });
      } else if (this.typeM == 'PROMOTION') {
        this.promotionService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
            this.router.navigate(['/outils/geo-localisation/' + null + '/' + 'LOTISSEMENT' + '/' + 'ADD'])
          },
          error => { });
      } else if (this.typeM == 'ILOT') {
        this.isletService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
            this.router.navigate(['/outils/geo-localisation/' + null + '/' + 'LOTISSEMENT' + '/' + 'ADD'])
          },
          error => { });
      } else if (this.typeM == 'LOT') {
        this.lotService.coordonnee(data).subscribe(
          res => {
            if (res?.status === 'success') {
              this.emitter.emit({ action: this.edit ? 'LOCALISATION_UPDATED' : 'LOCALISATION_ADD', payload: res?.data });
            }
            this.emitter.stopLoading();
            this.router.navigate(['/outils/geo-localisation/' + null + '/' + 'LOTISSEMENT' + '/' + 'ADD'])
          },
          error => { });
      } else {

      }
    } else {
      this.emitter.stopLoading();
      return;
    }
  }
  back() {
    window.history.back();
  }
  get f(): any { return this.form.controls; }
  get options() { return this.form.get('options') as FormArray; }
  get coordonnees() { return this.form.get('coordonnees') as FormArray; }
}

