import { Procedure } from '@model/procedure';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcedureService } from '@service/procedure/procedure.service';
import { ProcedureAddComponent } from '../procedure-add/procedure-add.component';

@Component({
  selector: 'app-procedure-show',
  templateUrl: './procedure-show.component.html',
  styleUrls: ['./procedure-show.component.scss']
})
export class ProcedureShowComponent implements OnInit {

  title: string = ""
  procedure: Procedure
  constructor(
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private procedureService: ProcedureService
  ) { 
    this.procedure = this.procedureService.getProcedure()
    this.title = "Détails procedure " + this.procedure.category.libelle
  }

  ngOnInit(): void {
  }

  edit(){
    this.procedureService.setProcedure(this.procedure)
    this.procedureService.edit = true
    this.modal(ProcedureAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
