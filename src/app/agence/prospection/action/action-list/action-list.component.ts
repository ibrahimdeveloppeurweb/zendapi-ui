
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityService } from '@service/activity/activity.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { RendService } from '@service/rdv/rend.service';
import { TenantService } from '@service/tenant/tenant.service';
import { ActionAddComponent } from '../action-add/action-add.component';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {

  @Input() actions: any[]
  @Input() notes: any[]
  @Input() tenant: any

  publicUrl = environment.publicUrl
  
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private rendService: RendService,
    private activityService: ActivityService,
    private tenantService: TenantService
  ) { }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'ACTION_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'ACTION_UPDATED') {
        this.update(data.payload);
      }
  
    });
  }
  appendToList(item): void {
    this.actions.unshift(item);
  }
  update(item): void {
    const index = this.actions.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.actions[index] = item;
    }
  }
  appendToListR(item): void {
    // this.rdvs.unshift(item);
  }
  updateR(item): void {
    // const index = this.rdvs.findIndex(x => x.uuid === item.uuid);
    // if (index !== -1) {
    //   this.rdvs[index] = item;
    // }
  }

  add(){
    this.modalService.dismissAll();
    this.modal(ActionAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  
  rdv(){
    this.modalService.dismissAll();
    this.rendService.edit = false;
    this.tenantService.uuid = this.route.snapshot.params.id
    // this.modal(RdvComponent, 'modal-basic-title', 'lg', true, 'static');
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

