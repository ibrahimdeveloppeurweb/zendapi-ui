import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from '@model/ticket';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FilterService } from '@service/filter/filter.service';
import { TicketService } from '@service/ticket/ticket.service';
import { TicketAddComponent } from '../ticket-add/ticket-add.component';
import { QualificationAddComponent } from '@agence/reclamation/qualification/qualification-add/qualification-add.component';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { RapportComponent } from '../rapport/rapport.component';
import { NoteComponent } from '../note/note.component';

@Component({
  selector: 'app-ticket-table',
  templateUrl: './ticket-table.component.html',
  styleUrls: ['./ticket-table.component.scss']
})
export class TicketTableComponent implements OnInit {

  @Input() tickets: Ticket[];
  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    public router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private filterService: FilterService,
    public ticketService: TicketService
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;

  }



  edit(item) {
    this.ticketService.setTicket(item)
    this.ticketService.edit = true
    this.modal(TicketAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  show(item) {
    this.router.navigate(['/admin/ticket/show/' + item.uuid]);
  }
  comment(item) {
  }
  qualifier(item) {
    this.modalService.dismissAll();
   this.ticketService.uuid = item.uuid
   this.ticketService.setTicket(item)
    this.modal(QualificationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  ferme(item){
    this.ticketService.uuid = item.uuid;
    this.modal(RapportComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  note(item){
    this.ticketService.uuid = item.uuid;
    this.ticketService.optionTickets = item.optionTicket;
    this.modal(NoteComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }

}
