import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Worksite } from '@model/worksite';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { WorksiteService } from '@service/worksite/worksite.service';
import { Globals } from '@theme/utils/globals';
import { WorksiteAddComponent } from '../worksite-add/worksite-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { WorksiteShowComponent } from '../worksite-show/worksite-show.component';


@Component({
  selector: 'app-worksite-list',
  templateUrl: './worksite-list.component.html',
  styleUrls: ['./worksite-list.component.scss']
})
export class WorksiteListComponent implements OnInit {
  @Input() worksites: Worksite[] = [];
  dtOptions: any = {};
  etat: boolean = false

  constructor(
    private router: Router,
    private emitter: EmitterService,
    private modalService: NgbModal,
    private worksiteService: WorksiteService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.worksites ? true : false;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'WORKSITE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'WORKSITE_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.worksites.unshift(...item);
  }
  update(item): void {
    const index = this.worksites.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.worksites[index] = item;
    }
  }
  showWorkSite(row) {
    console.log(row);
    this.worksiteService.setWorksite(row)
    this.modal(WorksiteShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showDq(item) {    
    this.router.navigate(['/outils/gantt/' + item.uuid + '/DQ']);
  }
  editWorkSite(row) {
    this.worksiteService.setWorksite(row)
    this.worksiteService.edit = true
    this.modal(WorksiteAddComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.worksiteService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.worksites.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.worksites.splice(index, 1);
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
