import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TypeLoad } from '@model/typeLoad';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { TypeLoadAddComponent } from '../type-load-add/type-load-add.component';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-type-load-show',
  templateUrl: './type-load-show.component.html',
  styleUrls: ['./type-load-show.component.scss']
})
export class TypeLoadShowComponent implements OnInit {

  title = '';
  typeLoad: TypeLoad;
  userSession = Globals.user
  publicUrl = environment.publicUrl;
  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private typeLoadService: TypeLoadService
  ) {
    this. typeLoad= this.typeLoadService.getTypeLoad()
    this.title = "Détails du type de charge: " + this.typeLoad.libelle
  }

  ngOnInit(): void {
  }

  edit(row) {
    this.modalService.dismissAll();
    this.typeLoadService.setTypeLoad(row);
    this.typeLoadService.edit = true;
    this.modal(TypeLoadAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }


  printer(row): void {
    // this.typeLoadService.getPrinter('SHOW', this.userSession.uuid, row.uuid);
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
