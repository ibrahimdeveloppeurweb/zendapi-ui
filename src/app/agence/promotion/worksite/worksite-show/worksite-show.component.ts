import { Component, OnInit } from '@angular/core';
import { Worksite } from '@model/worksite';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorksiteService } from '@service/worksite/worksite.service';
import { WorksiteAddComponent } from '../worksite-add/worksite-add.component';
@Component({
  selector: 'app-worksite-show',
  templateUrl: './worksite-show.component.html',
  styleUrls: ['./worksite-show.component.scss']
})
export class WorksiteShowComponent implements OnInit {
  title: string = ""
  worksite: Worksite

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private worksiteService: WorksiteService
  ) {
    this.worksite = this.worksiteService.getWorksite()
    this.title = "Détails du type de maison "+ this.worksite?.libelle
  }

  ngOnInit() {
  }

  editWorksite(data) {
    this.worksiteService.setWorksite(data)
    this.worksiteService.edit = true
    this.modal(WorksiteAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
