import {Rent} from '@model/rent';
import {Renew} from '@model/renew';
import {Tenant} from '@model/tenant';
import {Invoice} from '@model/invoice';
import {Contract} from '@model/contract';
import {Penality} from '@model/penality';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import HC_drilldown from 'highcharts/modules/drilldown';
import {FilterService} from '@service/filter/filter.service';
import { TenantService } from '@service/tenant/tenant.service';
import { ContractService } from '@service/contract/contract.service';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ContractShowComponent } from '@agence/locataire/contract/contract-show/contract-show.component';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { WalletService } from '@service/wallet/wallet.service';
import { DashViewerService } from '@service/dash-viewer/dash-viewer.service';
HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash-locataire',
  templateUrl: './dash-locataire.component.html',
  styleUrls: ['./dash-locataire.component.scss']
})
export class DashLocataireComponent implements OnInit {
  [x: string]: any;

  pieFactureA = 0
  pieFactureI = 0
  pieFactureE = 0
  pieFactureS = 0

  //variable du graph
  public Highcharts = Highcharts;
  public barBasicChartOptions: any

  dtOptions: any = {};
  etat: boolean = false
  type: string = 'TOUT';
  widget : any
  totalTenantI = 0
  typeRow = [
    {label: 'TOUT', value: 'TOUT'},
    {label: 'LOYER', value: 'LOYER'},
    {label: 'FACTURE D\'ENTREE', value: 'ENTREE'},
    {label: 'PENALITE', value: 'PENALITE'},
    {label: 'AUTRES FACTURES', value: 'AUTRE'},
    {label: 'RENOUVELLEMENT', value: 'RENOUVELLEMENT'},
    {label: 'RESILIATION', value: 'RESILIATION'},

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
  graph:any
  pie: any
  renews: Renew[];
  payments = [];
  rents: Rent[];
  penalities: Penality[];
  invoices: Invoice[];
  autres: Invoice[];
  bande: any
  circulaire: any
  public data: any;
  public intervalSub: any;
  public intervalMain: any;
  public lastDate: number;
  global = {country: Globals.country, device: Globals.device}
  tenantI: Tenant[];
  contractA: Contract[];
  contractR: Contract[];
  contractRe: Contract[];
  mois = []
  rentI = []
  rentT = []
  rentP = []
  widgetTotalTitle: string = "Facture(s)";
  widgetCoursTitle: string = "En cours(s)";
  widgetAttenteTitle: string = "Attente(s)";
  widgetSoldeTitle: string = "Soldé(s)";
  widgetImpayeTitle: string = "Impayée(s)";

  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChart: CanvasRenderingContext2D;
  formData: any
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private filterService: FilterService,
    private tenantService: TenantService,
    private contractService: ContractService,
    private walletService: WalletService,
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
    this.graph =  null
    this.pie =  null
    this.widget =  null
    this.formData = $event;
    this.filterService.dashboard($event, 'tenant', null).subscribe(
      res => {
        this.etat = res ? true : false
        this.widget = res?.widget
        this.graph = res?.facture
        this.pie = res?.pie
        this.tenantI = res?.tenantI;
        this.contractA = res?.contractA;
        this.contractR = res?.contractR;
        this.contractRe = res?.contractRe;
        // @ts-ignore
        this.tenantI.forEach(item => { return this.totalTenantI = this.totalTenantI + item?.impaye })
        if(this.type === 'TOUT'){
        } else if(this.type === 'RENEW'){
        } else if(this.type === 'ENTREE'){
        } else if(this.type === 'AUTRE'){
        } else if(this.type === 'LOYER'){
        } else if(this.type === 'PENALITE'){
        } else if(this.type === 'RESILIATION'){
        }
        this.updateCharts()
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
      this.widgetTotalTitle = "Facture(s)";
      this.widgetCoursTitle = "En cours(s)";
      this.widgetAttenteTitle = "Attente(s)";
      this.widgetSoldeTitle = "Soldé(s)";
      this.widgetImpayeTitle = "Impayée(s)";
    } else if($event === 'LOYER'){
      this.widgetTotalTitle = "Loyer(s) total";
      this.widgetCoursTitle = "Loyer(s) en cours(s)";
      this.widgetAttenteTitle = "Loyer(s) en attente(s)";
      this.widgetSoldeTitle = "Loyer(s) soldé(s)";
      this.widgetImpayeTitle = "Loyer(s) impayée(s)";
    } else if($event === 'ENTREE'){
      this.widgetTotalTitle = "Facture d'entree(s) total";
      this.widgetCoursTitle = "Facture d'entree(s) en cours(s)";
      this.widgetAttenteTitle = "Facture d'entree(s) en attente(s)";
      this.widgetSoldeTitle = "Facture d'entree(s) soldé(s)";
      this.widgetImpayeTitle = "Facture d'entree(s) impayée(s)";
    } else if($event === 'PENALITE'){
      this.widgetTotalTitle = "Penalite(s) total";
      this.widgetCoursTitle = "Penalite(s) en cours(s)";
      this.widgetAttenteTitle = "Penalite(s) en attente(s)";
      this.widgetSoldeTitle = "Penalite(s) soldé(s)";
      this.widgetImpayeTitle = "Penalite(s) impayée(s)";
    } else if($event === 'AUTRE'){
      this.widgetTotalTitle = "Autres facture(s) total";
      this.widgetCoursTitle = "Autres facture(s) en cours(s)";
      this.widgetAttenteTitle = "Autres facture(s) en attente(s)";
      this.widgetSoldeTitle = "Autres facture(s) soldé(s)";
      this.widgetImpayeTitle = "Autres facture(s) impayée(s)";
    } else if($event === 'RENEW'){
      this.widgetTotalTitle = "Renouvellement(s) total";
      this.widgetCoursTitle = "Renouvellement(s) en cours(s)";
      this.widgetAttenteTitle = "Renouvellement(s) en attente(s)";
      this.widgetSoldeTitle = "Renouvellement(s) soldé(s)";
      this.widgetImpayeTitle = "Renouvellement(s) impayée(s)";
    } else if($event === 'RESILIATION'){
      this.widgetTotalTitle = "Resiliation(s) total";
      this.widgetCoursTitle = "Resiliation(s) en cours(s)";
      this.widgetAttenteTitle = "Resiliation(s) en attente(s)";
      this.widgetSoldeTitle = "Resiliation(s) soldé(s)";
      this.widgetImpayeTitle = "Resiliation(s) impayée(s)";
    }
  }
  showContract(row): void {
    this.contractService.setContract(row);
    this.modal(ContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showTenant(row) {
    this.tenantService.setTenant(row);
    this.router.navigate(['/admin/locataire/show/' + row.uuid]);
  }
  updateCharts() {
    this.getPie(); // Appelle la méthode pour mettre à jour le graphique à secteurs
    this.getGraph();
  }
  getGraph() {
    this.barBasicChartOptions = {
      chart: {
        type: 'column'
      },
      colors: ['blue', 'green', 'red'],
      title: {
        text: 'STATISTIQUES DE RECOUVREMENT MENSUEL DES LOYERS'
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
        name: 'Total',
        data: this.graph ? this.graph.total || [] : []

      }, {
        color: 'green',
        name: 'Payé',
        data: this.graph ? this.graph.paye || [] : []

      }, {
        color: 'red',
        name: 'Impayée',
        data: this.graph ? this.graph.impaye || [] : []
      },]
    };
  }
  onViewer(entity){
    this.viewerSevice.entity = entity;
    this.viewerSevice.form = this.event;
     this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  openModal(type: string, tabsLibelle=[], tabsValue=[], value= null) {
     this.viewerSevice.entity = type;
    const data = {...this.formData}    
    this.filterService.setFormData(data);
    this.viewerSevice.tabsLibelle = tabsLibelle; 
    this.viewerSevice.tabsValue = tabsValue; 
    this.viewerSevice.value = value; 
    
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
        labels: ['Attente', 'Impayé', 'En cours', 'Soldé'],
        datasets: [{
          data: this.pie,
          backgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a'],
          hoverBackgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a']
        }]
      };
    });
  }
  resetData() { this.data = this.data.slice(this.data.length - 10, this.data.length); }

  getNewSeries(baseval, yrange) {
    const newDate = baseval + 86400000;
    this.lastDate = newDate;
    this.data.push({
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    });
  }
  modal(component, type, size, center, backdrop,style?): void {
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
