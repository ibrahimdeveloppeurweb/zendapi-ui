import { EtapeComponent } from '@agence/prospection/agent/etape/etape.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityService } from '@service/activity/activity.service';
import { AgentService } from '@service/agent/agent.service';
import { OffreService } from '@service/offre/offre.service';
import { RendService } from '@service/rdv/rend.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ReservationService } from '@service/reservation/reservation.service';
import { ActionCommercialService } from '@service/action-commercial/action-commercial.service';
import { ActionAddComponent } from '@agence/prospection/action/action-add/action-add.component';

@Component({
  selector: 'app-prospection-show',
  templateUrl: './prospection-show.component.html',
  styleUrls: ['./prospection-show.component.scss']
})
export class ProspectionShowComponent implements OnInit {
  view: boolean = false;
  public viewImage: number;
  activeTab: string = 'DETAIL'
  file: any;
  biens: any;
  etat: boolean;
  prospect: any;
  rdvs = [];
  offres = [];
  activites = [];
  files: any[] = [];
  agents: any[] = [];
  userSession = Globals.user;
  reservations: any[] = [];
  actions: any[] = [];
  publicUrl = environment.publicUrl;
  global = { country: Globals.country, device: Globals.device }

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private rdvService: RendService,
    private uploader: UploaderService,
    private offreService: OffreService,
    private agentService: AgentService,
    private activityService: ActivityService,
    private prospectService: ProspectionService,
    private reservationService: ReservationService,
    private actionService: ActionCommercialService
  ) {
    this.viewImage = 1;
    this.prospectService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
      return this.prospect = res;
    });
  }

  ngOnInit(): void {
  }

  onChangeLoad(bool: boolean, type) {
    this.activites = []
    this.activeTab = type;
    this.view = bool
    this.activites = []
    if (type === 'DETAIL') {
      this.prospectService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.prospect = res;
      });
    } else if (type === 'ACTIVITE') {
      this.activityService.getList(this.prospect.uuid).subscribe((res: any) => {
        return this.activites = res
      })
      this.rdvService.getList(this.prospect.uuid).subscribe((res: any) => {
        return this.rdvs = res
      })
    } else if (type === 'RESERVATION') {
      this.reservationService.getList(this.prospect.uuid).subscribe((res: any) => {
        console.log(res)
        return this.reservations = res
      })
    } else if (type === 'OFFRE') {
      this.offreService.getList(null, null, this.route.snapshot.params.id, true).subscribe((res: any) => {
        this.etat = false
        return this.offres = res;
      });
    } else if (type === 'ACTION') {
      this.actionService.getList(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.actions = res;
      });
    }
  }

  editProspect(item) { }

  printerProspect(row) {
    this.prospectService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  deleteProspect(item) { }

  showFolder(item) {
    this.offreService.uuid = this.route.snapshot.params.id
    this.offreService.setOffre(item);
    this.router.navigate(['/admin/prospection/reservation/show/' + item.uuid]);
  }
  editFolder(item) { }

  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  action() {
    this.modalService.dismissAll();
    this.prospectService.setProspection(this.prospect);
    this.modal(ActionAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  abonner() {
    this.agentService.typeAssignattion = 'ABONNEES'
    this.prospectService.setProspection(this.prospect)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')

  }
  assigner() {

    this.agentService.typeAssignattion = 'PROSPECT'
    this.prospectService.setProspection(this.prospect)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
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
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  back() { this.location.back(); }

}
