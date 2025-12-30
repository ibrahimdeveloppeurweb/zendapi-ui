import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerService } from '@service/owner/owner.service';
import {FilterService} from '@service/filter/filter.service';
import {MandateService} from '@service/mandate/mandate.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MandateShowComponent} from '@proprietaire/mandate/mandate-show/mandate-show.component';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { WalletService } from '@service/wallet/wallet.service';
import { style } from '@angular/animations';
import { DashViewerService } from '@service/dash-viewer/dash-viewer.service';

@Component({
  selector: 'app-dash-proprietaire',
  templateUrl: './dash-proprietaire.component.html',
  styleUrls: ['./dash-proprietaire.component.scss']
})
export class DashProprietaireComponent implements OnInit {

  publicUrl = environment.publicUrl;
  dtOptions: any = {};
  etat: boolean = false
  widget : any
  listing : any
  pie : any
  type: string = 'TOUT';

  autreTitle = "Propriétaire";
  autre: boolean = true;
  isPrint: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Owner';
  autreNamespace= 'Client';
  autreGroups= 'owner';

  name: boolean = false;
  nameTitle = 'Propriétaire'
  nameType = 'ENTITY';
  nameClass= 'Owner';
  nameNamespace= 'Client';
  nameGroups= 'owner';

  global = {country: Globals.country, device: Globals.device}
  typeRow = [{label: 'TOUT', value: 'TOUT'}];
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
  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChart: CanvasRenderingContext2D;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private ownerService: OwnerService,
    private filterService: FilterService,
    private mandateService: MandateService,
    private walletService: WalletService,
    private _changeDetectorRef: ChangeDetectorRef,
    public viewerSevice: DashViewerService
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.onFilter(this.event);
    this.formData = this.event;
  }

  onFilter($event) {
    this.pie = null
    this.widget = null
    this.type = $event.type
    this.formData = $event;
    this.filterService.dashboard($event, 'owner', null).subscribe(
      res => {
        this.etat = res ? true : false;
        this.widget = res?.widget;
        this.pie = res?.pie;
        this.listing = res?.  listing;
        this.getPie();
        this._changeDetectorRef.markForCheck();
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'TOUT'){
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
  showOwner(row) {
    this.ownerService.setOwner(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }
  showMandate(row) {
    this.mandateService.setMandate(row);
    this.modal(MandateShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  modal(component, type, size, center, backdrop,style?): void {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
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


}
