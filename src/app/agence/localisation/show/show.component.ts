import * as mapboxgl from 'mapbox-gl';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, AfterViewInit {
  ilot: boolean = false;
  lot: boolean = false;
  mtnFiltre: Boolean = false;
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
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
  array = [
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: '6',
          color: '#1FF54F',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9582983769109603, 5.3543662647960275],
              [-3.95830608692134, 5.354112944584813],
              [-3.958094061638377, 5.35410143002774],
              [-3.9580747866117463, 5.3543662647960275],
              [-3.9582983769109603, 5.3543662647960275]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: '7',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9895061732841555, 5.3558513637969725],
              [-3.9895061732841555, 5.355637270302267],
              [-3.9892553023274786, 5.355649164387316],
              [-3.9892553023274786, 5.355875151958415],
              [-3.9895061732841555, 5.3558513637969725]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: '8',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9886340980521027, 5.3560892453705975],
              [-3.988526581927772, 5.3559346223588165],
              [-3.9883593346225155, 5.356101139446793],
              [-3.988407119567455, 5.356184397973806],
              [-3.9885026894557143, 5.356113033522803]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p9',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9907295514018415, 5.355918938810603],
              [-3.9907473705957273, 5.355700128213513],
              [-3.9905276005377743, 5.355652817803005],
              [-3.990515721075184, 5.355706042014475],
              [-3.9905869978507553, 5.355741524818953],
              [-3.99058105811946, 5.3558952836147],
              [-3.9907295514018415, 5.355918938810603]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p10',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9898169876134943, 5.356827673872402],
              [-3.989646764342808, 5.356614922551614],
              [-3.989462053985278, 5.3568060381483065],
              [-3.9896576296574153, 5.3569899417792755],
              [-3.9898169876134943, 5.356827673872402]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p11',
          color: '#1FF54F',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.98924836945406, 5.356665405922456],
              [-3.9891614469331387, 5.356564439176623],
              [-3.9890636590965585, 5.356640164238058],
              [-3.98924836945406, 5.356665405922456]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p19',
          color: '#1FF54F',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9892266388238227, 5.356369717548233],
              [-3.9891940428779833, 5.356203843519538],
              [-3.9891071203570334, 5.356225479264978],
              [-3.9890817679556108, 5.356142542236171],
              [-3.9889477624019776, 5.356196631604249],
              [-3.9889513841731628, 5.356297598410848],
              [-3.988983980119002, 5.356384141374676],
              [-3.9890636590965585, 5.3563048103249855],
              [-3.9891071203570334, 5.356308416281493],
              [-3.989117985672692, 5.356394959243772],
              [-3.9892266388238227, 5.356369717548233]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p18',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.989067280868767, 5.356513955797453],
              [-3.98882824393516, 5.3562723567102495],
              [-3.9886507771210518, 5.356492320062216],
              [-3.9888825705112367, 5.3566834356972635],
              [-3.989067280868767, 5.356513955797453]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p17',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9901103511221834, 5.356607710641143],
              [-3.9898459617871254, 5.3563661115910435],
              [-3.9896214119403055, 5.356578862998461],
              [-3.9898713141885764, 5.356798826240123],
              [-3.9901103511221834, 5.356607710641143]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p16',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.98950913701691, 5.356542803443233],
              [-3.989744552178337, 5.35634808180788],
              [-3.9894185927247747, 5.356110088612837],
              [-3.9892157735082208, 5.356110088612837],
              [-3.989233882367273, 5.356337263936936],
              [-3.98950913701691, 5.356542803443233]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p15',
          color: '#F5492C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9891650687043523, 5.3568745512725116],
              [-3.9889803583467938, 5.356690647606854],
              [-3.988752186728817, 5.356932246528643],
              [-3.988969493032215, 5.357065666788017],
              [-3.9891650687043523, 5.3568745512725116],
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          nom: 'p14',
          color: '#1FF54F',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.990526854868932, 5.3562651447957705],
              [-3.9903240356534013, 5.355904548961064],
              [-3.9900053197422096, 5.356196631604249],
              [-3.989983589111972, 5.3563048103249855],
              [-3.990211760729977, 5.35648871410676],
              [-3.990526854868932, 5.3562651447957705]
            ]
          ]
        }
      }
    },
    {
      type: 'geojson',
      data: {
        type: 'Feature',
        color: '#1FF54F',
        properties: {
          nom: 'p13',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-3.9887558085010255, 5.356694253561045],
              [-3.9885348804264424, 5.356528379620471],
              [-3.988375522471358, 5.356737525017451],
              [-3.9886507771210518, 5.356932246528643],
              [-3.9887558085010255, 5.356694253561045]
            ]
          ]
        }
      }
    }


  ]
  constructor (
    private router: Router,
    private formBuild: FormBuilder,
  ) {
    this.draw = new MapboxDraw({
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon',
    });
  }
  // Liste des variables pour le filtre
  form: FormGroup
  advance = false
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

  ngOnInit(): void {
    this.loadMap()
    this.newForm()
  }

  ngAfterViewInit(): void {
  }
  loadMap(){
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1Ijoia2FrYXNoaWhhdGFrZTIzIiwiYSI6ImNsaXU5cTdpaTAxMDEzZXM2cGtqb2t1bjAifQ.P9JjnJpCXSdWVaY0-DMVhg';
    this.map = new mapboxgl.Map({
      container: 'map', // contai
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // sty
      center: [-4.008256, 5.359952],
      zoom: 12,
      pitch: 80, // Angle d'inclinaison pour la vue 3D
      bearing: 41
    });
    this.map.on('load', () => {
      this.array.forEach((item) => {
        const sourceId = `source-${item.data.properties.nom}`; // Générer un identifiant unique pour chaque source
        const layerId = `layer-${item.data.properties.nom}`; // Générer un identifiant unique pour chaque couche
    
        // Ajouter la source de données GeoJSON
        this.map.addSource(sourceId, item);
    
        // Ajouter une nouvelle couche pour visualiser le polygone
        this.map.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId, // Référence à la source de données
          layout: {},
          paint: {
            'fill-color': item.data.properties.color, // Couleur de remplissage bleue
            'fill-opacity': 0.5
          }
        });
    
        // Ajouter une bordure noire autour du polygone
        this.map.addLayer({
          id: `outline-${item.data.properties.nom}`,
          type: 'line',
          source: sourceId,
          layout: {},
          paint: {
            'line-color': '#000',
            'line-width': 3
          }
        });
    
        // Ajouter un événement de clic pour afficher le modal
        this.map.on('click', layerId, (e: any) => {
          const clickedFeature = e.features[0]; // Récupérer l'élément cliqué
          const properties = clickedFeature.properties; // Récupérer les propriétés du polygone
          const polygonName = properties.nom; // Obtenir le nom du polygone
          // this.openModal(polygonName); //Apple de l,ouverture du modale
        });
      });
    });
  }
  newForm(){
    this.form = this.formBuild.group({
      uuid: [null],
      type: [this.typeRow[0].value],
      ville: [null],
      pays: [null],
      lotissement: [null]
    })
  }
  onChangeType() {
  }
  onSubmit(){
  }
  onPrinter() {
  }
  onModel(){
  }
  onExport() {
  }
  onImport(){
  }
  get f() { return this.form.controls }
}

