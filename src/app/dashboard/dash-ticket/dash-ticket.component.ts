
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RessourceService } from '@service/ressource/ressource.service';
import { Ressource } from '@model/ressource';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from '@model/ticket';
import { FilterService } from '@service/filter/filter.service';
import { TicketService } from '@service/ticket/ticket.service';
import { Construction } from '@model/construction';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-dash-ticket',
  templateUrl: './dash-ticket.component.html',
  styleUrls: ['./dash-ticket.component.scss']
})
export class DashTicketComponent implements OnInit {
  public pieChartTag1: CanvasRenderingContext2D;
  public pieChartTag2: CanvasRenderingContext2D;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  actif: string;
  inactif: string;
  public pieChartData1: any;
  public pieChartData2: any;
  global = { country: Globals.country, device: Globals.device };
  filter : any
  tickets: Ticket[] = []
  constructions: Construction[] = [];
  ticket: Ticket;
  widget: any;
  dtOptions: any = {};
  event = {
    categorie: null,
    code: null,
    create: null,
    dateD: null,
    dateF: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "TICKET",
    uuid: null
  }
 
  nameTitle: string = "Commerçial"
  name: boolean = true;
  nameType = 'ENTITY';
  nameClass= 'User';
  nameNamespace= 'Admin';
  nameGroups= 'user';

  typeRow = [{label: 'TOUT', value: 'TICKET'}];
  tTicket = 0
  tFaire = 0
  tCours =0
  tFerme=0

  prevuC = 0
  encoursC = 0
  termineC = 0
  stopC = 0

  pieRessourceO=25
  pieRessourceR=20
  pieRessourceD=15


  constructor(
    private ticketService:  TicketService,
    private modalService: NgbModal,
    private filterService: FilterService


  ) { 
    this.onFilter(this.event)
  }
  onChangeLoad($event){

  }
  getPieChartDataTicket() {
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag1 = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData1 = {
        labels: ["A faire", "En cours", "Fermé"],
        datasets: [{
          data: [this.tFaire, this.tCours, this.tFerme],
          backgroundColor: [ '#4680ff', '#0e9e4a','#ff5252'],
          hoverBackgroundColor: [ '#4680ff','#0e9e4a', '#ff5252']
        }]
      };
    });
  }


  getPieChartDataContrution() {
    setTimeout(() => {
      /* pie cart */
      const pieTag = (((this.doughnutChart.nativeElement as HTMLCanvasElement).children));
      this.pieChartTag2 = ((pieTag['doughnut_chart']).lastChild).getContext('2d'); // doughnut_chart
      this.pieChartData2 = {
        labels: ["Prevu", "En cours","Stoppé","Terminé"],
        datasets: [{
          data: [this.prevuC, this.encoursC,this.stopC,this.termineC],
          backgroundColor: [ '#ffc107','#4680ff','#ff5252','#0e9e4a'],
          hoverBackgroundColor: ['#ffc107','#4680ff','#ff5252','#0e9e4a']
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

  calculate(res){
    let st = 0
    let faire = 0
    let encours = 0
    let ferme = 0

    let prevuC = 0
    let encoursC = 0
    let termineC = 0
    let stopC = 0    
    res?.ticket.forEach(item => {
       st = st + 1
      if (item.etat === 'OUVERT') {
        faire = faire + 1
      }
      if (item.etat === 'EN COURS') {
        encours = encours + 1
      }else if(item.etat === 'FERME'){
        ferme = ferme + 1
      }
    });
    this.tTicket = st
    this.tFaire = faire
    this.tCours = encours
    this.tFerme = ferme

    res?.construction.forEach(item => {
     if (item.etat === 'PREVU') {
      prevuC = prevuC + 1
     }
     if (item.etat === 'EN COURS') {
      encoursC = encoursC + 1
     }
      if(item.etat === 'TERMINER'){
        termineC = termineC + 1
     }
     if(item.etat === 'STOPPER'){
      stopC = stopC + 1
     }
   });

   this.prevuC = prevuC
   this.encoursC = encoursC
   this.termineC = termineC
   this.stopC = stopC
    
  }


  onFilter($event) {
    this.filter = null
    this.tickets = []
    this.constructions = []
    this.filterService.search($event, 'ticket', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        this.calculate(res);
        this.getPieChartDataTicket();
        this.getPieChartDataContrution();
        this.tickets = res?.ticket.slice(0, 10);
        this.constructions = res?.construction.slice(0, 10);        
    }, err => { })
   
  }

  ngOnInit(): void {
   
  }

  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }

}



