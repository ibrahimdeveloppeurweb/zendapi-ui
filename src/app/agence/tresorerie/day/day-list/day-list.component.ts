import { Day } from '@model/day';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DayService } from '@service/day/day.service';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { DayEndComponent } from '@agence/tresorerie/day/day-end/day-end.component';
import { DayShowComponent } from '@agence/tresorerie/day/day-show/day-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.component.html',
  styleUrls: ['./day-list.component.scss']
})
export class DayListComponent implements OnInit {
  @Input() days: Day[];
  @Input() action: boolean = true
  @Input() tresorerie = true;
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  totalI = 0;
  totalF = 0;
  recette = 0;
  depense = 0;
  solde = 0;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private dayService: DayService,
    private permissionsService: NgxPermissionsService
  ){
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.etat = this.days ? true : false;
      if(this.etat){
        this.days.forEach(item => {
          this.totalI += item?.soldeI
          this.totalF += item?.soldeF
          this.solde += item?.solde
        })
      }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'DAY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'DAY_END') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.days.unshift(row);
  }
  update(row): void {
    const index = this.days.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.days[index] = row;
    }
  }
  endDay(row): void {
    this.dayService.setDay(row);
    this.modal(DayEndComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showDay(row) {
    this.dayService.setDay(row)
    this.modal(DayShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerDay(row): void {
    this.dayService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
}
