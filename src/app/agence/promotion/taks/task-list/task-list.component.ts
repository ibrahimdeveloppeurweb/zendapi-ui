import { ReportListComponent } from '@agence/promotion/report/report-list/report-list.component';
import { ReportShowComponent } from '@agence/promotion/report/report-show/report-show.component';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Home } from '@model/home';
import { Tasks } from '@model/tasks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { HomeService } from '@service/home/home.service';
import { ReportService } from '@service/report/report.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() homes: Home[] = []
  dtOptions: any = {};
  etat: boolean = false

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private reportService: ReportService,
    private homeService: HomeService    
  ) { }


  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.homes ? true : false;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TASK_ADD') {
        this.appendToList(data.payload);
      }
      // if (data.action === 'WORKSITE_UPDATE') {
      //   this.update(data.payload);
      // }
    });
  }

  show(row,type) {
    this.router.navigate(['/outils/gantt/' + row.uuid + '/'+type]);
  }
  showReport(row) {    
    this.reportService.setEtat(false)
    this.reportService.setReport(row?.reports)    
    this.modal(ReportListComponent, 'modal-basic-title', 'xl', true, 'static')    
  }

  appendToList(item): void {
    this.homes.unshift(...item);
  }

  modal(component, type, size, center, backdrop, style?) {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
  }
}
