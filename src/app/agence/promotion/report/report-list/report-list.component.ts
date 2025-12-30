import { Router } from '@angular/router';
import { Report } from '@model/report';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '@service/report/report.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ReportAddComponent } from '../report-add/report-add.component';
import { ReportShowComponent } from '../report-show/report-show.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {  
  @Input() reports: any = []
  dtOptions: any = {};
  userSession = Globals.user;
  etat: boolean = false

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private emitter: EmitterService,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.reports = this.reportService.getReport()
    this.etat = this.reportService.getEtat()
    console.log('etat',this.etat)
    console.log('reports',this.reports)
    if(this.etat == false) {
      this.reportService.getList().subscribe(res => { return this.reports = res; }, error => {} );
    }
    console.log('reports',this.reports)

    this.emitter.event.subscribe((data) => {
      if (data.action === 'REPORT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'REPORT_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.reports.unshift(...item);
  }
  update(item): void {
    const index = this.reports.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.reports[index] = item;
    }
  }

  showDetailsReport(row) {
    this.reportService.setDetailsReport(row)
    this.modal(ReportShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editReport(row) {
    this.modale.close('ferme');
    this.reportService.setReport(row)
    this.reportService.edit = true
    this.modal(ReportAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printer(row): void {
    this.reportService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.reportService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.reports.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.reports.splice(index, 1);
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
    }).result.then((result) => {}, (reason) => { });
  }
}
