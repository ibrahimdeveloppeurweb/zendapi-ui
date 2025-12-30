import { Component, OnInit } from '@angular/core';
import { Job } from '@model/prestataire/job';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '@service/job/job.service';
import { Globals } from '@theme/utils/globals';
import { JobAddComponent } from '@agence/prestataire/job/job-add/job-add.component';


@Component({
  selector: 'app-job-show',
  templateUrl: './job-show.component.html',
  styleUrls: ['./job-show.component.scss']
})
export class JobShowComponent implements OnInit {
  title: string = ""
  job: Job
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private jobService: JobService
  ) {
    this.job = this.jobService.getJob()
    this.title = "Détails sur la famille " + this.job.libelle
  }

  ngOnInit(): void {
  }

  edit(row) {
    this.modalService.dismissAll()
    this.jobService.setJob(row)
    this.jobService.edit = true
    this.modal(JobAddComponent, 'modal-basic-title', 'md', true, 'static')
  }

  printer(row): void {
    this.jobService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
