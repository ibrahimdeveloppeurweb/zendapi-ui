import { Quartier} from '@model/quartier';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuartierService } from '@service/quartier/quartier.service';
import { NeighborhoodAddComponent } from '../neighborhood-add/neighborhood-add.component';


@Component({
  selector: 'app-neighborhood-show',
  templateUrl: './neighborhood-show.component.html',
  styleUrls: ['./neighborhood-show.component.scss']
})
export class NeighborhoodShowComponent implements OnInit {
  title: string = null;
  quartier: Quartier;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private quartierService: QuartierService
  ) { }

  ngOnInit(): void {
    this.quartier = this.quartierService.getQuartier();
    this.title = 'Détail d\'un quartier ' + this.quartier?.libelle;
  }

  editQuartier(row) {
    this.modalService.dismissAll();
    this.quartierService.setQuartier(row);
    this.quartierService.edit = true;
    this.modal(NeighborhoodAddComponent, 'modal-basic-title', 'md', true, 'static');
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
