import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import HC_drilldown from 'highcharts/modules/drilldown';
import * as Highcharts from 'highcharts';
HC_drilldown(Highcharts);
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '@service/filter/filter.service';
import { WalletService } from '@service/wallet/wallet.service';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';

@Component({
  selector: 'app-owner-wallet',
  templateUrl: './owner-wallet.component.html',
  styleUrls: ['./owner-wallet.component.scss']
})
export class OwnerWalletComponent implements OnInit {
  @Input() widget: any
  @Input() owner: any
  @Input() graph: any
  @Input() listing: any[]

  userSession = Globals.user
  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}
    //variable du graph
  public Highcharts = Highcharts;
  public barOptions: any
  formData: any
  wallets: any[]

  constructor(
    private modalService: NgbModal,
    private filterService: FilterService,
    private walletService: WalletService
  ) { 
  
  }

  ngOnInit(): void {
    this.formData = this.filterService.getFormData()
    this.getGraph()
  }

  getGraph () {
    this.barOptions = {
      chart: {
        type: 'column'
      },
      colors: ['#0e9e4a'],
      title: {
        text: "DIAGRAMME DE REPRESENTATION DU PROTEFEUILLE"
      },
      xAxis: {
        categories: (this.graph ? this.graph.mois || [] : []),
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
        max: 15000000, // Définit le minimum à 0 pour éviter les valeurs négatives sur l'axe Y
        allowDecimals: false, // Évite les décimales si les nombres sont des entiers
        tickInterval: 1000
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
          color: '#0e9e4a',
          name: 'Commission',
          data: this.graph ? this.graph.commission || [] : []
        },
        {
          color: '#ffa21d',
          name: 'Loyer',
          data: this.graph ? this.graph.loyer || [] : []
        },
        {
          color: '#9A7575FF',
          name: 'Caution',
          data: this.graph ? this.graph.caution || [] : []
        },
        {
          color: '#7C94C7FF',
          name: 'Dépense',
          data: this.graph ? this.graph.depense || [] : []
        }
      ]
    };
  }
  openModal(type: string) {
    // this.walletService.type = type;
    // this.walletService.uuid = this.owner.uuid;
    // const data = {...this.formData}
    // this.filterService.setFormData(data);
    // this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen')
  }

  onPrinter(): void {
    this.walletService.getPrinterItem(this.userSession?.agencyKey, this.userSession?.uuid, this.owner?.uuid, "SOLDE_OWNER", this.formData?.dateD, this.formData?.dateF);
  }
  modal(component, type, size, center, backdrop, style?) {
    this.modalService
      .open(component, {
        windowClass: style,
        ariaLabelledBy: type,
        size: size,
        centered: center,
        backdrop: backdrop,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

}


