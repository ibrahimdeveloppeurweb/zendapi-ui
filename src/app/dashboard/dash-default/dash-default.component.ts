import * as Highcharts from 'highcharts';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import HC_drilldown from 'highcharts/modules/drilldown';
import { RentService } from '@service/rent/rent.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { OwnerService } from '@service/owner/owner.service';
import {FilterService} from '@service/filter/filter.service';
import {DashViewerService} from '@service/dash-viewer/dash-viewer.service';
import { TenantService } from '@service/tenant/tenant.service';
import { RentShowComponent } from '@locataire/rent/rent-show/rent-show.component';
import {ApexChartService} from "../../theme/shared/components/chart/apex-chart/apex-chart.service";
import { DateHelperService } from '@theme/utils/date-helper.service';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';

HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash-default',
  templateUrl: './dash-default.component.html',
  styleUrls: ['./dash-default.component.scss']
})
export class DashDefaultComponent implements OnInit, OnDestroy  {
  public bandeC: any;
  public bandeM: any;

  //variable du graph
  public Highcharts = Highcharts;
  public barBasicChartOptions: any;

  public lastDate: number;
  public data: any;

  public intervalSub: any;
  public intervalMain: any;
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
    ordre: "ASC",
    type: "TOUT",
    uuid: null
  }
  widget : any
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

  constructor(
    public viewerSevice: DashViewerService,
    public apexEvent: ApexChartService,
    private modalService: NgbModal,
    private filterService: FilterService,
    private tenantService: TenantService,
    private rentService: RentService,
    private ownerService: OwnerService,
    public router: Router,
    ) {
    this.onFilter(this.event)

    // this.getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {min: 10, max: 90});
  }

  ngOnInit(): void {
    this.getGraph();
    this.filterService.dashboard(this.event, 'default', null).subscribe(
      res => {
        this.getGraph();
        this.onSet(res);
    }, err => { })
    this.dtOptions = Globals.dataTable;
    // this.intervalSub = setInterval(() => {
    //   this.getNewSeries(this.lastDate, {min: 10, max: 90});
    //   this.apexEvent.eventChangeSeriesData();
    // }, 2000);

    // this.intervalMain = setInterval(() => {
    //   this.resetData();
    //   this.apexEvent.eventChangeSeriesData();
    // }, 60000);
  }
  onViewer(entity){
    this.viewerSevice.entity = entity;
    console.log(entity);

    this.viewerSevice.form = this.event;
    this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  onFilter($event) {
    this.type = $event.type
    this.event = $event
    this.filterService.dashboard($event, 'default', null).subscribe(
      res => {
        this.onSet(res);
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
    } else if($event === 'LOYER'){
    } else if($event === 'ENTREE'){
    } else if($event === 'PENALITE'){
    } else if($event === 'AUTRE'){
    } else if($event === 'RENEW'){
    }
  }
  onSet(res){
    this.getGraph();
    this.etat = res ? true : false
    this.widget = res?.widget
    this.total = []
    this.totalP = []
    this.totalI = []
    this.mois = []
    this.listing = res?.listing
    this.listing?.tenant.forEach(el => { this.totalTenant = this.totalTenant + el.impaye});
    this.listing?.rentS.forEach(el => { this.totalRentS = this.totalRentS + el.montant});
    this.listing?.rentA.forEach(el => { this.totalRentA = this.totalRentA + el.montant});

    var totalC = []
    var totalM = []
    if (res) {
      res?.contrat.forEach(el => {
        totalC.push(el?.nbr)
      });
      res?.mandat.forEach(el => {
        totalM.push(el?.nbr)
      });
      // this.bandeC.series[0].data = totalC.map(x => x)
      // this.bandeM.series[0].data = totalM.map(x => x)
    }
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
        categories: (this.mois),
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
        data: this.total

      }, {
        color: 'green',
        name: 'Payé',
        data: this.totalP

      }, {
        color: 'red',
        name: 'Impayée',
        data: this.totalI
      },]
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
