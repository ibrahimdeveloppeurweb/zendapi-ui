import { AfterViewInit, Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/angular';
import { FilterService } from '@service/filter/filter.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContractService} from '@service/contract/contract.service';
import { FolderService } from '@service/folder/folder.service';
import {MandateService} from '@service/mandate/mandate.service';
import {ContractShowComponent} from '@locataire/contract/contract-show/contract-show.component';
import { FolderShowComponent } from '@client/folder/folder-show/folder-show.component';
import {MandateShowComponent} from '@proprietaire/mandate/mandate-show/mandate-show.component';

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit, AfterViewInit {
  loaded: boolean = false;
  type: string = "CONTRAT"
  etat: string = ""
  event = {
    categorie: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    etat: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "CONTRAT",
    uuid: null
  }
  etatRow = []
  typeRow = [
    { label: 'CONTRAT', value: 'CONTRAT'},
    { label: 'MANDAT', value: 'MANDAT'},
    { label: 'DOSSIER', value: 'DOSSIER'}

  ]
  nameTitle: string = "Nom du bien"
  etatTitle: string = "Disponibilité ?"
  title: string = "Geolocalisation des biens"
  filter: any
  events = [];
  datas = [];
  evet = [];
  calendarOptions: CalendarOptions;
  rows = [];
  load = [];

  tbarConfig = {
    items: [
      {
        type: 'button',
        text: 'My button'
      }
    ]
  };
  features = {
    eventEdit : false
  }
  constructor(
    private filterService: FilterService,
    private modalService: NgbModal,
    private contractService: ContractService,
    private mandateService: MandateService,
    private folderService: FolderService
  ) { }

  ngOnInit(): void {
    this.onFilter(this.event)
  }
  ngAfterViewInit() {
    if(this.loaded) {
      this.rows = this.events;
      this.load = this.datas;
    }
  }

  onFilter($event) {
    this.loaded = false;
    this.filterService.type = this.type;
    this.events = []
    this.datas = []
    var color = ""
    this.filterService.search($event, 'calendrier', null).subscribe(
      res => {
        if($event.type === 'CONTRAT'){
          res?.forEach(item=>{
            if(item.statut === 'EN COURS'){
              color = '#27ca37'
            } else if (item.statut === 'EN TERME') {
              color = '#feac31'
            } else if (item.statut === 'INACTIF') {
              color = '#f70d18'
            } else if (item.statut === 'EXPIRE') {
              color = '#ff7043'
            }
            if(formatDate( new Date(), 'yyyy-MM-dd', 'fr-FR') > formatDate(item.dateFin, 'yyyy-MM-dd', 'fr-FR')){color = '#F93030' }
            if(this.monthDiff(new Date(), new Date(item.dateFin)) <= 3){color = '#FFC300' }
            this.events.push({
              id: item?.id.toString(),
              name: item?.tenant?.nom,
              eventColor: color
            });
            this.datas.push({
              id: item?.id,
              startDate: item?.dateEntr,
              endDate: item?.dateFin,
              name: item?.tenant?.nom.toUpperCase() + ' : ' + item?.libelle,
              allDay: true,
              resourceId: item?.id.toString(),
              eventColor: color
            })
          });
        } else if($event.type === 'MANDAT'){
          res?.forEach(item=>{
            if(item.statut === 'EN COURS'){
              color = '#27ca37'
            } else if (item.statut === 'EN TERME') {
              color = '#feac31'
            } else if (item.statut === 'INACTIF') {
              color = '#f70d18'
            } else if (item.statut === 'EXPIRE') {
              color = '#ff7043'
            }
            if(formatDate( new Date(), 'yyyy-MM-dd', 'fr-FR') > formatDate( item.dateF, 'yyyy-MM-dd', 'fr-FR')){ color = '#F93030' }
            if(this.monthDiff(new Date(), new Date(item.dateF)) <= 3){ color = '#FFC300' }
            this.events.push({
              id: item?.id.toString(),
              name: item?.tenant?.nom,
              eventColor: color,
            });
            this.datas.push({
              id: item?.id,
              startDate: item?.dateEntr,
              endDate: item?.dateFin,
              name: item?.tenant?.nom + ' : ' + item?.libelle,
              allDay: true,
              resourceId: item?.id.toString(),
              eventColor: color
            })
          });
        } else if($event.type === 'DOSSIER'){

          res?.forEach(item=>{
            if(item.statut === 'EN COURS'){
              color = '#27ca37'
            } else if (item.statut === 'EN TERME') {
              color = '#feac31'
            } else if (item.statut === 'INACTIF') {
              color = '#f70d18'
            } else if (item.statut === 'EXPIRE') {
              color = '#ff7043'
            }
            if(formatDate( new Date(), 'yyyy-MM-dd', 'fr-FR') > formatDate( item.dateF, 'yyyy-MM-dd', 'fr-FR')){ color = '#F93030' }
            if(this.monthDiff(new Date(), new Date(item.dateF)) <= 3){ color = '#FFC300' }
            this.events.push({
              id: item?.id.toString(),
              name: item?.tenant?.nom,
              eventColor: color,
            });
            this.datas.push({
              id: item?.id,
              startDate: item?.dateEntr,
              endDate: item?.dateFin,
              name: item?.tenant?.nom.toUpperCase() + ' : ' + item?.libelle,
              allDay: true,
              resourceId: item?.id.toString(),
              eventColor: color,
            })
          });
        }
        this.events = this.events;
        this.datas = this.datas;
        this.loaded = true;
    }, err => { })
  }
  showContract(row): void {
    this.contractService.setContract(row?.event?._def?.extendedProps?.entite);
    this.modal(ContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showMandate(row) {
    this.mandateService.setMandate(row?.event?._def?.extendedProps?.entite);
    this.modal(MandateShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  showFolder(row) {
    this.folderService.setFolder(row?.event?._def?.extendedProps?.entite)
    this.modal(FolderShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'CONTRAT'){
      this.nameTitle = 'Libelle du contrat'
      this.etatRow = [];
    } else if($event === 'MANDAT'){
      this.nameTitle = 'Libelle du mandat'
      this.etatRow = [];
    } else if($event === 'DOSSIER'){
      this.nameTitle = 'Libelle du dossier'
      this.etatRow = [];
    }
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months+2;
  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }
}
