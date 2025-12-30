import { Component, Input, OnInit } from '@angular/core';
import { Job } from '@model/prestataire/job';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { JobService } from '@service/job/job.service';
import { JobAddComponent } from '@agence/prestataire/job/job-add/job-add.component';
import { JobShowComponent } from '@agence/prestataire/job/job-show/job-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  @Input() jobs: Job[]
  type: string = 'FAMILY'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private jobService: JobService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.jobs ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FAMILY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FAMILY_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.jobs.unshift(row);
  }
  update(row): void {
    const index = this.jobs.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.jobs[index] = row;
    }
  }
  edit(row) {
    this.jobService.setJob(row)
    this.jobService.edit = true
    this.modal(JobAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(row) {
    this.jobService.setJob(row);
    this.modal(JobShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printer(row): void {
    this.jobService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.jobService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.jobs.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.jobs.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
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
