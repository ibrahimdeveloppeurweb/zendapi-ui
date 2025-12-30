import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RessourceService } from '@service/ressource/ressource.service';
import { Ressource } from '@model/ressource';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '@service/filter/filter.service';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';

@Component({
  selector: 'app-dash-ressource',
  templateUrl: './dash-ressource.component.html',
  styleUrls: ['./dash-ressource.component.scss']
})
export class DashRessourceComponent implements OnInit {
  public pieChartTag1: CanvasRenderingContext2D;
  public pieChartTag2: CanvasRenderingContext2D;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  actif: string;
  inactif: string;
  type = "RESSOURCE";
  public pieChartData1: any;
  public pieChartData2: any;
  ressources: Ressource[] = []
  ressource: Ressource[];
  widget: any;
  dtOptions: any = {};
  filter : any



  typeRow = [{label: 'TOUT', value: 'RESSOURCE'}];
  stocks = 0
  uses = 0
  pannes =0
  hors=0
  useI=0
  useA=0
  pieRessourceO=25
  pieRessourceR=20
  pieRessourceD=15


  constructor(
    public ressourceService: RessourceTiersService,
    private modalService: NgbModal,
    private filterService: FilterService,
  ) { 
    this.ressourceService.getList().subscribe(res => {
      this.calculate(res)
      this.getPieChartData1()
      this.getPieChartData2()
      return this.ressources = res;
    }, error => {});
  }
  onChangeLoad($event){

  }
  getPieChartData1() {
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag1 = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData1 = {
        labels: ["Stocks", "Uses", "Hors usage"],
        datasets: [{
          data: [this.stocks, this.uses, this.pannes],
          backgroundColor: ['#0e9e4a', '#4680ff', '#ff5252'],
          hoverBackgroundColor: ['#0e9e4a', '#4680ff', '#ff5252']
        }]
      };
    });
  }


  getPieChartData2() {
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag2 = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData2 = {
        labels: ["Actif", "Inactif"],
        datasets: [{
          data: [this.useA, this.useI],
          backgroundColor: ['#0e9e4a','#ff5252'],
          hoverBackgroundColor: ['#0e9e4a','#ff5252']
        }]
      };
    });
  }
  ressourceModal(tableId: number) {
    const modalRef = this.modalService.open(DashViewerComponent,
      {
        windowClass: 'modal-basic-title',
        size: "xl",
        centered: true,
        backdrop: 'static'
      });
    modalRef.componentInstance.tableId = tableId; // Passe l'ID du tableau
  }

  calculate(ressources){
    let st = 0
    let use = 0
    let pannes = 0
    let hors = 0
    let useA = 0
    let useI = 0
    ressources.forEach(item => {
      if (item.etat === 'EN STOCK') {
        st = st + 1
      }
      if (item.etat === 'EN UTILISATION') {
        use = use + 1
      }
      if (item.utilisation === 'ACTIF') {
        useA = useA + 1
      }else if(item.utilisation === 'INACTIF'){
        useI = useI + 1
      }
      if (item.etat === 'EN PANNE') {
        pannes = pannes + 1
      }

      if (item.etat === 'HORS SERVICE') {
        hors = hors + 1
      }
    });
    this.stocks = st
    this.uses = use
    this.pannes = pannes
    this.hors = hors
    this.useA = useA
    this.useI = useI
  }




  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.ressources = []
    this.filterService.search($event, 'ressource', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'RESSOURCE'){
          this.ressources = res;
          this.calculate(res)
          this.getPieChartData1();
          this.getPieChartData2();
        }
    }, err => { })
  }

  ngOnInit(): void {

  }

}
