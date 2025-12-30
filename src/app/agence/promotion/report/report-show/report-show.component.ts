import { Component, OnInit } from '@angular/core';

import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '@service/report/report.service';
import { EmitterService } from '@service/emitter/emitter.service';
@Component({
  selector: 'app-report-show',
  templateUrl: './report-show.component.html',
  styleUrls: ['./report-show.component.scss']
})
export class ReportShowComponent implements OnInit {

  reports: any =[];
  dtOptions: any = {};
  etat: boolean = false
  title: string =''

  constructor(
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private emitter: EmitterService,
    private reportService: ReportService,
  ) { 
    this.reports = this.reportService.getDetailsReport()
    console.log('reports',this.reports)
    this.title =  'DETAILS DES TÂCHES DU RAPPORT '+this.reports.type+" DU "  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.reports ? true : false;
    // this.reports = this.reportService.getDetailsReport()/
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
