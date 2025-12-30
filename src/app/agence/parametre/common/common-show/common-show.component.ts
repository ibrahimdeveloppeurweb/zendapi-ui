import { Common } from '@model/common';
import { Component, OnInit } from '@angular/core';
import { CommonService} from '@service/common/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonAddComponent } from '../common-add/common-add.component';

@Component({
  selector: 'app-common-show',
  templateUrl: './common-show.component.html',
  styleUrls: ['./common-show.component.scss']
})
export class CommonShowComponent implements OnInit {
  title: string = null;
  common: Common;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.common = this.commonService.getCommon();
    this.title = 'Détail d\'une commune' +  this.common?.libelle;
  }

  editCommon(row) {
    this.modalService.dismissAll();
    this.commonService.setCommon(row);
    this.commonService.edit = true;
    this.modal(CommonAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  onClose(){
    this.modale.close('ferme');
  }
  modal(component, type, size, center, backdrop) {
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
