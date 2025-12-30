import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { Ticket } from '@model/ticket';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from '@service/ticket/ticket.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { TicketAddComponent } from '../ticket-add/ticket-add.component';
import { QualificationAddComponent } from '@agence/reclamation/qualification/qualification-add/qualification-add.component';
import { RapportComponent } from '../rapport/rapport.component';
import { NoteComponent } from '../note/note.component';
import { Construction } from '@model/construction';
import { ConstructionService } from '@service/construction/construction.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { EmitterService } from '@service/emitter/emitter.service';
import * as moment from 'moment';


@Component({
  selector: 'app-ticket-show',
  templateUrl: './ticket-show.component.html',
  styleUrls: ['./ticket-show.component.scss']
})
export class TicketShowComponent implements OnInit {
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = { country: Globals.country, device: Globals.device };

  ticket: Ticket = null;
  file: any;
  chats: any[] = [];
  constructions: Construction[] = [];
  notes: any[] = [];
  public showComment = false;
  public loading = false;


  isShareSupported: boolean = false;
  whatsappUrl: string = '';
  slackUrl: string = '';
  mailUrl: string = '';
  facebookUrl: string = '';
  public activeTab = "INFORMATION";
  list: string = 'LOCATIVE';
  public config: PerfectScrollbarConfigInterface = {};
  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private ticketService: TicketService,
    private permissionsService: NgxPermissionsService,
    private constructionService: ConstructionService,
    private emitter: EmitterService
  ) { 
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.loadTicket();

    this.isShareSupported = !!navigator.share;

    const currentUrl = window.location.href;
    this.whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
    this.slackUrl = `slack://open?url=${encodeURIComponent(currentUrl)}`;
    this.mailUrl = `mailto:?subject=Visualiser le ticket&body=${encodeURIComponent(currentUrl)}`;
    this.facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

    this.emitter.event.subscribe((data) => {
      if (data.action === 'TICKET_NOTE') {
        this.appendToList(data.payload);
      }
   
    });
  }

  appendToList(note): void {
    this.notes.unshift(note);
  }

  private loadTicket(): void {
    if (!this.ticket) {
      this.ticketService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        this.ticket = res; 
        return this.ticket
      });
    }
  }


  getTimeDifference(date) {
    
    const Date = moment(date);
    const now = moment();

    const diff = moment.duration(now.diff(Date));
    const days = diff.asDays();
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    var dayString = (Math.floor(days) > 0) ? ((Math.floor(days) == 1) ? "1 jour, " : Math.floor(days) + " jours, ") : "";
    var hourString = (Math.floor(hours) > 0) ? (Math.floor(hours) + " heures, ") : '';
    var minuteString = (Math.floor(minutes) > 0) ? (Math.floor(minutes) + " minutes, ") : "";
    var secondString = (seconds > 0) ? (seconds + " secondes") : "";

    return dayString + hourString + minuteString + secondString;
  }
  getTimeDifferenceTwoDate(debut, fin) {
    const dateD = moment(debut);
    const dateF = moment(fin);

    const diff = moment.duration(dateF.diff(dateD));
    const days = diff.asDays();
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    var dayString = (Math.floor(days) > 0) ? ((Math.floor(days) == 1) ? "1 jour, " : Math.floor(days) + " jours, ") : "";
    var hourString = (Math.floor(hours) > 0) ? (Math.floor(hours) + " heures, ") : '';
    var minuteString = (Math.floor(minutes) > 0) ? (Math.floor(minutes) + " minutes, ") : "";
    var secondString = (seconds > 0) ? (seconds + " secondes") : "";

    return dayString + hourString + minuteString + secondString;
  }

  

  // changement de tabs
  onTabs(type) {
    this.activeTab = type
    if (type === "INFORMATION") {
    
    } else if (type === "INTERVENTION") {
      this.constructionService.getList(null, null, null, null, this.list,this.route.snapshot.params.id).subscribe(res => { return this.constructions = res; }, error => { });
      
    } else if (type === "NOTE") {
      this.ticketService.getListNote(this.route.snapshot.params.id).subscribe((res: any) => {
        this.notes = res; 
        return this.notes
      });
    }else if (type === "FERME") {
 
    }

  }
  shareLink() {
    if (this.isShareSupported) {
      navigator.share({
        title: 'Visualiser le ticket',
        text: 'Voici le lien pour visualiser le ticket:',
        url: window.location.href
      })
        .then(() => console.log('Lien partagé avec succès'))
        .catch((error) => console.log('Erreur lors du partage:', error));
    }
  }

  openShareModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  edit(item) {
    this.ticketService.setTicket(item)
    this.ticketService.edit = true
    this.modal(TicketAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }


  comment() {
    this.showComment = !this.showComment;
  }
  qualifier(item) {
    this.modalService.dismissAll();
    this.ticketService.uuid = item.uuid
    this.modal(QualificationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  ferme(item){
    this.ticketService.uuid = item.uuid;
    this.modal(RapportComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  note(item){
    this.ticketService.uuid = item.uuid;
    this.ticketService.optionTickets = item.optionTicket
    this.modal(NoteComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  
  delete() {

  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  back() { this.location.back(); }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}
