import {Rent} from '@model/rent';
import {Renew} from '@model/renew';
import {Tenant} from '@model/tenant';
import {Invoice} from '@model/invoice';
import {Contract} from '@model/contract';
import {Penality} from '@model/penality';
import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import HC_drilldown from 'highcharts/modules/drilldown';
import { RentService } from '@service/rent/rent.service';
import { OwnerService } from '@service/owner/owner.service';
import {FilterService} from '@service/filter/filter.service';
import { TenantService } from '@service/tenant/tenant.service';
import {MandateService} from '@service/mandate/mandate.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { ContractService } from '@service/contract/contract.service';
import { RentShowComponent } from '@locataire/rent/rent-show/rent-show.component';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MandateShowComponent} from '@proprietaire/mandate/mandate-show/mandate-show.component';
import {ApexChartService} from "../../theme/shared/components/chart/apex-chart/apex-chart.service";
import { ContractShowComponent } from '@agence/locataire/contract/contract-show/contract-show.component';
import { WalletService } from '@service/wallet/wallet.service';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { DashViewerService } from '@service/dash-viewer/dash-viewer.service';
HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  public barOptions: any
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
  formData: any
  type: string = 'TOUT';
  typeRow = [
    {label: 'TOUT', value: 'TOUT'},
    {label: 'PROPRIETAIRE', value: 'OWNER'},
    {label: 'LOCATION', value: 'LOCATION'},
    {label: 'PROGRAMME IMMOBLIER', value: 'PROGRAMME'},
    {label: 'PROJET DE LOTISSEMENT', value: 'LOTISSEMENT'},
    {label: 'CRM', value: 'CRM'}
  ];

  autreTitle = "Propriétaire";
  autre: boolean = false;
  isPrint: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Owner';
  autreNamespace= 'Client';
  autreGroups= 'owner';

  bienTitle: string = "Nom du bien"
  bien: boolean = false
  bienType = 'ENTITY';
  bienClass= 'House';
  bienNamespace= 'Client';
  bienGroups= 'house';

  nameTitle: string = "Locataire"
  name: boolean = false;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  // VARIABLE POUR LE DASH DEFAULT
  widget : any
  pie : any
  graph : any
  graph1: any;
  echeances : any
  listing : any
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
  mois = [];
  public bandeC: any;
  public bandeM: any;
  //variable du graph
  public barOptions2: any
  public Highcharts = Highcharts;
  public barBasicChartOptions: any;
  public lastDate: number;
  public data: any;
  public intervalSub: any;
  public intervalMain: any;

  // DASH OWNER
  pieLocativeO = 0;
  pieLocativeR = 0;
  pieLocativeD = 0;

  // DASH LOCATION
  pieFactureA = 0
  pieFactureI = 0
  pieFactureE = 0
  pieFactureS = 0

  //variable du graph
  totalTenantI = 0
  renews: Renew[];
  payments = [];
  rents: Rent[];
  penalities: Penality[];
  invoices: Invoice[];
  autres: Invoice[];
  bande: any
  circulaire: any
  tenantI: Tenant[];
  contractA: Contract[];
  contractR: Contract[];
  contractRe: Contract[];
  rentI = []
  rentT = []
  rentP = []
  widgetTotalTitle: string = "Facture(s)";
  widgetCoursTitle: string = "En cours(s)";
  widgetAttenteTitle: string = "Attente(s)";
  widgetSoldeTitle: string = "Soldé(s)";
  widgetImpayeTitle: string = "Impayée(s)";


  // DASH PROMOTION
  pieHouseVe = 0
  pieHouseRe = 0
  pieHouseDi = 0

  //variable du graph
  public lineBasicChartOptions: any;
  echeanciers : []
  ech = [];
  echI = [];
  echP = [];
  public pieChartDataProgramme: any;

  // DASH LOTISSEMENT
  pieLotVe = 0
  pieLotRe = 0
  pieLotDi = 0
  public pieChartData: any;
  public pieChartTagLocation: CanvasRenderingContext2D;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChart: CanvasRenderingContext2D;
  @ViewChild('doughnutChart2', {static: false}) doughnutChart2: ElementRef; // doughnut
  public pieChart2: CanvasRenderingContext2D;
  @ViewChild('doughnutChart3', {static: false}) doughnutChart3: ElementRef; // doughnut
  public pieChart3: CanvasRenderingContext2D;
  @ViewChild('doughnutChart4', {static: false}) doughnutChart4: ElementRef; // doughnut
  public pieChart4: CanvasRenderingContext2D;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    public apexEvent: ApexChartService,
    private filterService: FilterService,
    private walletService: WalletService,
    public viewerSevice: DashViewerService,

    // DASH DEFAULT
    private rentService: RentService,
    private ownerService: OwnerService,
    private tenantService: TenantService,
    private contractService: ContractService,
    // DASH OWNER
    private mandateService: MandateService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {

    this.formData = this.event;
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.onFilter(this.event);
    this.getGraph1();
  }

  onFilter($event) {
    this.graph = null
    this.pie = null
    this.echeances = null
    this.pieChartData = null
    this.type = $event.type
    this.formData = $event;
    if(this.type === 'TOUT'){
      this.filterService.dashboard($event, 'default', null).subscribe(
        res => {
          this.etat = res ? true : false
          this.widget = res?.widget
          this.total = []
          this.totalP = []
          this.totalI = []
          this.mois = []
          this.listing = res?.listing
          this.graph = res?.facture
          this.listing?.tenant.forEach(el => { this.totalTenant = this.totalTenant + el.impaye});
          this.listing?.rentS.forEach(el => { this.totalRentS = this.totalRentS + el.montant});
          this.listing?.rentA.forEach(el => { this.totalRentA = this.totalRentA + el.montant});

          var totalC = []
          var totalM = []
          // if (res) {
          //   res?.contrat.forEach(el => {
          //     totalC.push(el?.nbr)
          //   });
          //   res?.mandat.forEach(el => {
          //     totalM.push(el?.nbr)
          //   });
          //   this.bandeC.series[0].data = totalC.map(x => x)
          //   this.bandeM.series[0].data = totalM.map(x => x)
          // }

        this.updateCharts()
      }, err => { })
    }else if(this.type === 'OWNER'){
      this.filterService.dashboard($event, 'owner', null).subscribe(
        res => {
          this.etat = res ? true : false;
          this.widget = res?.widget;
          this.listing = res?.listing;
          this.pie = res?.pie
          this.updateCharts()
          this._changeDetectorRef.markForCheck();
      }, err => { })
    }else if(this.type === 'LOCATION'){
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
          this.updateCharts()
      }, err => { })
    }else if(this.type === 'PROGRAMME'){
      this.filterService.dashboard($event, 'promotion', null).subscribe(
        res => {
          this.graph = res?.facture
          this.echeances = res?.echeances
          this.pie = res?.pie
          this.widget = res?.widget
          this.echeanciers = res?.echeanciers
          this.listing = res?.listing
          this.updateCharts()
      }, err => { })
    }else if(this.type === 'LOTISSEMENT'){
      this.type = $event.type
      this.filterService.dashboard($event, 'lotissement', null).subscribe(
        res => {
          this.graph = res?.facture
          this.echeances = res?.echeances
          this.pie = res?.pie
          this.widget = res?.widget
          this.echeanciers = res?.echeanciers
          this.listing = res?.listing
          this.updateCharts()
      }, err => { })
    }else if(this.type === 'CRM'){
      this.type = $event.type
      this.filterService.dashboard($event, 'crm', null).subscribe(
        res => {
          // this.graph = res?.facture
          // this.echeances = res?.echeances
          // this.pie = res?.pie
          this.widget = res?.widget
          // this.echeanciers = res?.echeanciers
          // this.listing = res?.listing
          // this.updateCharts()
      }, err => { })
    }
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
      this.event = {
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
      this.onFilter(this.event)
    } else if($event === 'LOCATION'){
      this.name = true;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';

      this.widgetTotalTitle = "Facture(s)";
      this.widgetCoursTitle = "En cours(s)";
      this.widgetAttenteTitle = "Attente(s)";
      this.widgetSoldeTitle = "Soldé(s)";
      this.widgetImpayeTitle = "Impayée(s)";
      this.event = {
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
        type: "LOCATION",
        uuid: null
      }
      this.onFilter(this.event)
    } else if($event === 'OWNER'){
      this.name = false;
      this.nameTitle = 'Locataire'
      this.nameType = 'ENTITY';
      this.nameClass= 'Tenant';
      this.nameNamespace= 'Client';
      this.nameGroups= 'tenant';

      this.bien = true;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = true;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';
      this.event = {
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
        type: "OWNER",
        uuid: null
      }
      this.onFilter(this.event)
    } else if($event === 'PROGRAMME'){
      this.name = true;
      this.nameTitle = 'Promotion'
      this.nameType = 'ENTITY';
      this.nameClass= 'Promotion';
      this.nameNamespace= 'Client';
      this.nameGroups= 'promotion';

      this.bien = false;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = false;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';
      this.event = {
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
        type: "PROGRAMME",
        uuid: null
      }
      this.onFilter(this.event)
    } else if($event === 'LOTISSEMENT'){
      this.name = true;
      this.nameTitle = 'Projet de lotissement'
      this.nameType = 'ENTITY';
      this.nameClass= 'Subdivision';
      this.nameNamespace= 'Client';
      this.nameGroups= 'subdivision';

      this.bien = false;
      this.bienTitle = 'Nom du bien';
      this.bienType = 'ENTITY';
      this.bienClass= 'House';
      this.bienNamespace= 'Client';
      this.bienGroups= 'house';

      this.autreTitle = "Propriétaire";
      this.autre = false;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';
      this.event = {
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
        type: "LOTISSEMENT",
        uuid: null
      }
      this.onFilter(this.event)
    } else if($event === 'CRM'){
      this.name = true;
      this.nameTitle = 'Promotion'
      this.nameType = 'ENTITY';
      this.nameClass= 'Promotion';
      this.nameNamespace= 'Client';
      this.nameGroups= 'promotion';

      this.bien = true;
      this.bienTitle = 'Projet de lotissement';
      this.bienType = 'ENTITY';
      this.bienClass= 'Subdivision';
      this.bienNamespace= 'Client';
      this.bienGroups= 'subdivision';

      this.autreTitle = "Propriétaire";
      this.autre = false;
      this.autreType = 'ENTITY';
      this.autreClass= 'Owner';
      this.autreNamespace= 'Client';
      this.autreGroups= 'owner';
      this.event = {
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
        type: "CRM",
        uuid: null
      }
      this.onFilter(this.event)
    }
  }

  updateCharts() {// Appelle la méthode pour mettre à jour le graphique à secteurs
    if(this.type === 'TOUT'){
      this.getGraph();
    }else if(this.type === 'PROGRAMME'){
      this.getGraphProgrammeOrLotisseent();
    }else if(this.type === 'LOTISSEMENT'){
      this.getGraphProgrammeOrLotisseent();
    }else if(this.type === 'LOCATION'){
      this.getGraph();
    }else if(this.type === 'CRM'){
      this.getGraph1();
    }else if(this.type === 'OWNER'){
    }
    this.getPie();
  }

  getGraph1 () {
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

  // DASH DEFAULT
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
  getPie(){
    if(this.type === 'PROGRAMME'){
      setTimeout(() => {
        /* pie cart */
        const pieTag = (((this.doughnutChart3.nativeElement as HTMLCanvasElement).children));
        this.pieChart3 = ((pieTag['doughnut_chart3']).lastChild).getContext('2d'); // doughnut_chart
        this.pieChartData = {
          labels: ["Occupée", "Reservée", 'Disponible'],
          datasets: [{
            data: this.pie,
            backgroundColor: ['#0e9e4a', '#4680ff', '#ff5252'],
            hoverBackgroundColor: ['#0e9e4a', '#4680ff', '#ff5252']
          }]
        };
      });
    }else if(this.type === 'LOTISSEMENT'){
      setTimeout(() => {
        /* pie cart */
        const pieTag = (((this.doughnutChart4.nativeElement as HTMLCanvasElement).children));
        this.pieChart4 = ((pieTag['doughnut_chart4']).lastChild).getContext('2d'); // doughnut_chart
        this.pieChartData = {
          labels: ["Occupée", "Reservée", 'Disponible'],
          datasets: [{
            data: this.pie,
            backgroundColor: ['#0e9e4a', '#4680ff', '#ff5252'],
            hoverBackgroundColor: ['#0e9e4a', '#4680ff', '#ff5252']
          }]
        };
      });
    }else if(this.type === 'LOCATION'){
      setTimeout(() => {
        /* pie cart */
        const pieTag = (((this.doughnutChart2.nativeElement as HTMLCanvasElement).children));
        this.pieChart2 = ((pieTag['doughnut_chart2']).lastChild).getContext('2d'); // doughnut_chart
        this.pieChartData = {
          labels: ['Attente', 'Impayé', 'En cours', 'Soldé'],
          datasets: [{
            data: this.pie,
            backgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a'],
            hoverBackgroundColor: ['#4680ff', '#ff5252', '#ffa21d', '#0e9e4a']
          }]
        };
      });
    }else if(this.type === 'OWNER'){
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
  }

  showOwner(row): void {
    this.ownerService.setOwner(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }

  showTenant(row) {
    this.tenantService.setTenant(row);
    this.router.navigate(['/admin/locataire/show/' + row.uuid]);
  }

  showRent(row) {
    this.rentService.setRent(row)
    this.modal(RentShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  showMandate(row) {
    this.mandateService.setMandate(row);
    this.modal(MandateShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  // DASH LOCATION
  showContract(row): void {
    this.contractService.setContract(row);
    this.modal(ContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  getGraphProgrammeOrLotisseent() {
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

  ngOnDestroy() {
    if (this.intervalSub) {
      clearInterval(this.intervalSub);
    }
    if (this.intervalMain) {
      clearInterval(this.intervalMain);
    }
  }
  getDayWiseTimeSeries(baseval, count, yrange) {
    let i = 0;
    while (i < count) {
      const x = baseval;
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      this.data.push({x, y});
      this.lastDate = baseval;
      baseval += 86400000;
      i++;
    }
  }
  resetData() {
    this.data = this.data.slice(this.data.length - 10, this.data.length);
  }
  getNewSeries(baseval, yrange) {
    const newDate = baseval + 86400000;
    this.lastDate = newDate;
    this.data.push({
      x: newDate,
      y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
    });
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

  modal(component, type, size, center, backdrop, style?): void {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  date(date){
    var format = 'MMMM Do, YYYY [at] h:mm:ss A';
    DateHelperService.formatDatefromServer(date, format)
  }
}
