import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import HC_drilldown from 'highcharts/modules/drilldown';
import { FilterService } from '@service/filter/filter.service';
import { WalletService } from '@service/wallet/wallet.service';
import { Component, OnInit } from '@angular/core';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { DashViewerService } from '@service/dash-viewer/dash-viewer.service';

HC_drilldown(Highcharts);

@Component({
  selector: 'app-dash-wallet',
  templateUrl: './dash-wallet.component.html',
  styleUrls: ['./dash-wallet.component.scss']
})
export class DashWalletComponent implements OnInit {

  //variable du graph
  public Highcharts = Highcharts;
  public barOptions: any

  widget : any
  graph : any
  listing : any[]
  global = {country: Globals.country, device: Globals.device}
  dtOptions: any = {};
  etat: boolean = false
  publicUrl = environment.publicUrl;
  userSession = Globals.user
  type: string = 'TOUT';
  typeRow = [
    {label: 'TOUT', value: 'AGENCY'},
    {label: 'SOLDE', value: 'SOLDE_AGENCY'},
    {label: 'COMMISSION AGENCE', value: 'COMMISSION_LOYER'},
    {label: 'CAUTION', value: 'CAUTION_AGENCY'},
    {label: 'TVA SUR COMMISSION', value: 'TVA_COMMISSION_AGENCY'},
    {label: 'DEPENSE', value: 'DEPENSE_AGENCY'},
    {label: 'CAUTION CIE/SODECI', value: 'CIE_SODECI_AGENCY'},
    {label: 'HONORAIRE AGENCE', value: 'HONORAIRE_AGENCE_AGENCY'},
    {label: 'TIMBRES FISCAUX', value: 'TIMBRES_FISCAUX_AGENCY'},
    {label: 'DROIT D\'ENREGISTREMENT', value: 'DROIT_ENREGISTREMENT_AGENCY'},
    {label: 'FRAIS DE DOSSIER', value: 'FRAIS_DOSSIER_AGENCY'},
    {label: 'FRAIS D\'ASSURANCE', value: 'FRAIS_ASSURANCE_AGENCY'},
    {label: 'AUTRE FONDS', value: 'AUTRE_AGENCY'}
  ];
  debit = 0
  credit = 0
  solde = 0
  event = {
    autre: null,
    bien: null,
    categorie: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    designation: null,
    etat: null,
    exercice: null,
    libelle: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "AGENCY",
    user: null,
    uuid: null
  }
  formData: any
  wallets: any[]

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private filterService: FilterService,
    private walletService: WalletService,
    public viewerSevice: DashViewerService
  ) {
    this.formData = this.event
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.onFilter(this.event)
  }
  onFilter($event) {
    this.type = $event.type;
    this.widget = null
    this.listing = null
    this.graph = null
    this.formData = $event;
    this.filterService.viewer($event, 'wallet', null).subscribe(
      res => {
        if (this.type === 'AGENCY') {
          this.widget = res?.widget
          this.listing = res?.listing
          this.graph = res?.graph
          this.loadGraph(); 
        }else{
          this.wallets = res
        }
        return res
      }, err => { })
  }

  onChangeLoad($event) {
    this.type = $event;
    this.event.type = $event
    this.onFilter(this.event)
  }
  
  loadGraph () {
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
        // {
        //   color: '#4680ff',
        //   name: 'Total',
        //   data: this.graph ? this.graph.solde || [] : []
        // },
        {
          color: '#0e9e4a',
          name: 'Commission',
          data: this.graph ? this.graph.commission || [] : []
        },
        {
          color: '#ffa21d',
          name: 'Impot sur commission',
          data: this.graph ? this.graph.tva || [] : []
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
        },
        {
          color: '#B72525FF',
          name: "Droit d'enregistrement",
          data: this.graph ? this.graph.droit || [] : []
        },
        {
          color: '#6F6F3CFF',
          name: 'Frais de dossiers',
          data: this.graph ? this.graph.fraisDossier || [] : []
        },
        {
          color: '#7852D8FF',
          name: 'Frais Assurances',
          data: this.graph ? this.graph.fraisAss || [] : []
        },
        {
          color: '#79C259FF',
          name: 'Timbres fiscaux (Légalisation bail)',
          data: this.graph ? this.graph.timbres || [] : []
        }
      ]
    };
  }
  openModal(type: string, title:string) {
    this.viewerSevice.entity = type;
    this.viewerSevice.title = title;
    const data = {...this.formData}
    this.filterService.setFormData(data);
    this.modal(DashViewerComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen')
  }
  onPrinter(): void {
    const type = this.formData?.type === "AGENCY"? "SOLDE_AGENCY" : this.formData?.type
    this.walletService.getPrinterItem(this.userSession?.agencyKey, this.userSession?.uuid, this.formData?.uuid, type, this.formData?.dateD, this.formData?.dateF);
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

  printer(){
    this.walletService.getPrinter('SHOW',this.userSession?.agencyKey, this.userSession?.uuid, null);
  }
}
