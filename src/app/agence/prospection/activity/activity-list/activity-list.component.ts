import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityService } from '@service/activity/activity.service';
import { ActivityAddComponent } from '../activity-add/activity-add.component';
import { ProspectionService } from '@service/prospection/prospection.service';
import { RendService } from '@service/rdv/rend.service';
import { environment } from '@env/environment';
import { EmitterService } from '@service/emitter/emitter.service';
import { RdvComponent } from '../rdv/rdv.component';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  @Input() rdvs: any[]
  @Input() activites: any[]
  @Input() prospect: any[]
  publicUrl = environment.publicUrl
  
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private rendService: RendService,
    private activityService: ActivityService,
    private prospectService: ProspectionService
  ) { }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'ACTIVITY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'ACTIVITY_UPDATED') {
        this.update(data.payload);
      }
      if (data.action === 'RDV_ADD') {
        this.appendToListR(data.payload);
      }
      if (data.action === 'RDV_UPDATED') {
        this.updateR(data.payload);
      }
    });
  }
  appendToList(item): void {
    this.activites.unshift(item);
  }
  update(item): void {
    const index = this.activites.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.activites[index] = item;
    }
  }
  appendToListR(item): void {
    this.rdvs.unshift(item);
  }
  updateR(item): void {
    const index = this.rdvs.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.rdvs[index] = item;
    }
  }

  add(){
    this.modalService.dismissAll();
    this.activityService.edit = false;
    this.prospectService.setProspection(this.prospect);
    this.modal(ActivityAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  rdv(){
    this.modalService.dismissAll();
    this.rendService.edit = false;
    this.prospectService.setProspection(this.prospect);
    this.modal(RdvComponent, 'modal-basic-title', 'lg', true, 'static');
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
