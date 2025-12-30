import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import HC_drilldown from 'highcharts/modules/drilldown';
import * as Highcharts from 'highcharts';
import { environment } from '@env/environment';
import { FilterService } from '@service/filter/filter.service';
import { Globals } from '@theme/utils/globals';
import { WalletService } from '@service/wallet/wallet.service';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashViewerService } from '@service/dash-viewer/dash-viewer.service';

HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash-promotion',
  templateUrl: './dash-promotion.component.html',
  styleUrls: ['./dash-promotion.component.scss']
})
export class DashPromotionComponent implements OnInit {

  //variable du graph
  public Highcharts = Highcharts;
  public barBasicChartOptions: any;
  public lineBasicChartOptions: any;
  widget : any
  listing : any
  graph: any
  pie: any
  echeances: any
  echeanciers : []
  global = {country: Globals.country, device: Globals.device}
  dtOptions: any = {};
  etat: boolean = false
  publicUrl = environment.publicUrl;
  totalTenant = 0;
  totalRentS = 0;
  totalRentA = 0;
  total = [];
  totalI = [];
  totalP = [];
  ech = [];
  echI = [];
  echP = [];
  mois = [];
  type: string = 'TOUT';
  typeRow = [
    {label: 'TOUT', value: 'TOUT'}
  ];
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
    autre: null,
    bien: null,
    ordre: "ASC",
    type: "TOUT",
    uuid: null
  }

  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChart: CanvasRenderingContext2D;
  formData: any

  constructor(
    public router: Router,
    private filterService: FilterService,
    private walletService: WalletService,
    private modalService: NgbModal,
    public viewerSevice: DashViewerService,



  ) {
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.onFilter(this.event)
    this.formData = this.event;
  }
  onFilter($event) {
    this.type = $event.type
    this.graph = null
    this.pie = null
    this.echeances = null
    this.total = []
    this.totalP = []
    this.totalI = []
    this.ech = []
    this.echP = []
    this.echI = []
    this.mois = []
    this.formData = $event;
    this.filterService.dashboard($event, 'promotion', null).subscribe(
      res => {
        this.onSet(res);
        this.updateCharts()
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
    } else if($event === 'PROMOTION'){
    } else if($event === 'MAISON'){
    }
  }
  onSet(res){
    this.etat = res ? true : false
    this.widget = res?.widget
    this.listing = res?.listing
    this.graph = res?.facture
    this.pie = res?.pie
    this.echeances = res?.echeances
    this.echeanciers = res?.echeanciers
  }
  updateCharts() {
    this.getPie();
    this.getGraph();
  }
  getGraph() {
    this.barBasicChartOptions = {
      chart: {
        type: 'column'
      },
      colors: ['blue', 'green', 'red'],
      title: {
        text: 'STATISTIQUE DES PAIEMENTS'
      },
      xAxis: {
        categories: (this.graph ? this.graph.mois || [] : []),
        crosshair: true
      },
      yAxis: {
        title: {
          text: this.global.device
        }
      },
      credits: {
        enabled: false
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
      series: [{
        color: 'blue',
        name: 'Total prévisionnel',
        data: this.graph ? this.graph.total || [] : []

      }, {
        color: 'green',
        name: 'Total recouvré',
        data: this.graph ? this.graph.paye || [] : []

      }, {
        color: 'red',
        name: 'Payé restant',
        data: this.graph ? this.graph.impaye || [] : []
      },]
    };


    this.lineBasicChartOptions = {
      chart: {
        type: 'spline',
      },
      colors: ['#D9F0F3', 'green', 'red'],
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      yAxis: {
        title: {
          text: this.global.device
        }
      },
      xAxis: {
        categories: (this.echeances ? this.echeances.mois || [] : []),
        crosshair: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Total prévisionnel',
        data: this.echeances ? this.echeances.total || [] : []
      }, {
        name: 'Total recouvré',
        data: this.echeances ? this.echeances.paye || [] : []
      }, {
        name: 'Payé restant',
        data: this.echeances ? this.echeances.impaye || [] : []
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
  }

  openModal(type: string, tabsLibelle=[], tabsValue=[], value= null,chiffreA= null,marge= null,coutC= null,chiffreR= null,) {
    this.viewerSevice.entity = type;
    const data = {...this.formData}    
    this.filterService.setFormData(data);
    this.viewerSevice.tabsLibelle = tabsLibelle; 
    this.viewerSevice.tabsValue = tabsValue; 
    this.viewerSevice.value = value; 

    this.viewerSevice.chiffreA = chiffreA; 
    this.viewerSevice.marge = marge; 
    this.viewerSevice.coutC = coutC; 
    this.viewerSevice.chiffreR = chiffreR; 
    
    if (tabsLibelle.length > 0 || tabsValue.length > 0) {
        if (tabsLibelle.length == tabsValue.length) {
          this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen')
        }
    }else {
      this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen')
    }
  }


  getPie(){
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChart = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData = {
        labels: ["Occupée", "Reservée", 'Disponible'],
        datasets: [{
          data: this.pie,
          backgroundColor: ['#0e9e4a', '#4680ff', '#ff5252'],
          hoverBackgroundColor: ['#0e9e4a', '#4680ff', '#ff5252']
        }]
      };
    });
  }
  modal(component, type, size, center, backdrop, style?): void {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
}
