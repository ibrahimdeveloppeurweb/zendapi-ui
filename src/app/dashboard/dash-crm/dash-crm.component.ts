import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { Globals } from '@theme/utils/globals';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import HC_drilldown from 'highcharts/modules/drilldown';
import { FilterService } from '@service/filter/filter.service';
import { dashboardCrmService } from '@service/dashboard-crm/dashboard-crm.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '@service/wallet/wallet.service';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';

HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash-crm',
  templateUrl: './dash-crm.component.html',
  styleUrls: ['./dash-crm.component.scss']
})
export class DashCrmComponent implements OnInit {
  mois = [];
  data: any;
  total = [];
  listing: any;
  table1: any;
  table2: any;
  widget: any;
  graph1: any;
  pieRow: any;
  userSession = Globals.user;
  prospect: any;
  dtOptions: any = {};
  type: string = 'TOUT';
  montantLP: number = 0;
  montantIP: number = 0;
  montantImP: number = 0;
  isPrint: boolean = true;
  global = {country: Globals.country, device: Globals.device};
  typeRow = [
    {label: 'TOUT', value: 'TOUT'}
  ];

  autreTitle = "Promotion";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Promotion';
  autreNamespace= 'Client';
  autreGroups= 'promotion';

  bienTitle: string = "Projet de lotissement"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'Subdivision';
  bienNamespace= 'Client';
  bienGroups= 'subdivision';

  libelleTitle: string = "Commercial"
  libelle: boolean = true
  libelleType = 'ENTITY';
  libelleClass= 'User';
  libelleNamespace= 'Admin';
  libelleGroups= 'user';
  event = {
    categorie: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    etat: null,
    max: null,
    min: null,
    name: null,
    bien: null,
    autre: null,
    libelle: null,
    ordre: "ASC",
    type: "TOUT",
    uuid: null
  }
  formData: any


  //variable du graph
  public Highcharts = Highcharts;
  public barOptions: any
  public barOptions2: any
  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChartTag: CanvasRenderingContext2D;

  constructor(
    public router: Router,
    private filterService: FilterService,
    private dashboardCrmService: dashboardCrmService,
    private walletService: WalletService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.onFilter(this.event);
    this.getPie();
    this.getGraph();
  }

  onFilter($event) {
    this.widget = null
    this.graph1 = null
    this.table1 = null
    this.table2 = null
    this.pieRow = []
    this.type = $event.type
    this.filterService.dashboard($event, 'crm', null).subscribe(
      res => {
        this.widget = res.widget
        this.graph1 = res.graph1
        this.table1 = res.table1
        this.table2 = res.table2
        this.pieRow = res.pieRow
        this.updateCharts();
        return res;
      },err => { }
    )
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
    }
  }
  updateCharts() {
      this.getPie(); // Appelle la méthode pour mettre à jour le graphique à secteurs
      this.getGraph(); // Appelle la méthode pour mettre à jour le graphique à barres
  }

  getPie(){
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData = {
        labels: ['Contacts', 'Visites Bureau', 'Visites Chantier', 'Contrats envoyés', 'Contrats Signés', 'Annulations'],
        datasets: [{
          data: this.pieRow,
          backgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a','#7C94C7FF', '#9A7575FF'],
          hoverBackgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a','#7C94C7FF', '#9A7575FF']
        }]
      };
    });
  }

  getGraph () {
    this.barOptions = {
      chart: {
        type: 'column'
      },
      colors: ['#0e9e4a'],
      title: {
        text: "DIAGRAMME DES ACTIONS COMMERCIALES"
      },
      xAxis: {
        categories: (this.graph1 ? this.graph1.mois || [] : []),
        crosshair: true
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: "Nombre"
        },
        min: 0, // Définit le minimum à 0 pour éviter les valeurs négatives sur l'axe Y
        max: 1000, // Définit le minimum à 0 pour éviter les valeurs négatives sur l'axe Y
        allowDecimals: false, // Évite les décimales si les nombres sont des entiers
        tickInterval: 25
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>' ,
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          color: '#4680ff',
          name: 'Contacts',
          data: this.graph1 ? this.graph1.contacts || [] : []
        },
        {
          color: '#0e9e4a',
          name: 'Visites Bureau',
          data: this.graph1 ? this.graph1.bureau || [] : []
        },
        {
          color: '#ffa21d',
          name: 'Visites Chantier',
          data: this.graph1 ? this.graph1.chantier || [] : []
        },
        {
          color: '#7C94C7FF',
          name: 'Contrats Envoyés',
          data: this.graph1 ? this.graph1.contrats || [] : []
        },
        {
          color: '#9A7575FF',
          name: 'Annulations',
          data: this.graph1 ? this.graph1.annulations || [] : []
        }
      ]
    };
    this.barOptions2 = {
      chart: {
        type: 'column'
      },
      colors: ['#0e9e4a'],
      title: {
        text: "DIAGRAMME DES ENCAISSEMENTS"
      },
      xAxis: {
        categories: (["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet"]),
        crosshair: true
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: "XOF"
        },
        min: 0, // Définit le minimum à 0 pour éviter les valeurs négatives sur l'axe Y
        allowDecimals: false, // Évite les décimales si les nombres sont des entiers
        tickInterval: 100000
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>' ,
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          color: '#C38C3FFF',
          name: 'Encaissements ZS',
          data: [12000000000, 400000000, 1000000, 140000000, 89000000, 80000000, 900000000]
        },
        {
          color: '#164C2CFF',
          name: 'Encaissements SPDI',
          data: [10000000000, 40390000000, 19000000, 100000000, 890000000, 400000000, 390000000]
        }
      ]
    };
  }

  onPrinter($event){
    console.log($event)
    this.dashboardCrmService.getPrinter($event,this.userSession?.agencyKey, this.userSession?.uuid)
  }

  openModal( type: string){
    // this.walletService.type= type;
    // const data = {...this.formData}
    // this.filterService.setFormData(data);
    // this.modal(DashViewerComponent, 'modal-basic-title', 'lg', true, 'static', 'full-screen')
  }
  modal(component, type, size, center, backdrop, style?): void {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }

}
