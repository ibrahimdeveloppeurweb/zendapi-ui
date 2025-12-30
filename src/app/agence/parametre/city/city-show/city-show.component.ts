import { Ville } from '@model/ville';
import { Component, OnInit } from '@angular/core';
import { VilleService} from '@service/ville/ville.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CityAddComponent } from '../city-add/city-add.component';

@Component({
  selector: 'app-city-show',
  templateUrl: './city-show.component.html',
  styleUrls: ['./city-show.component.scss']
})
export class CityShowComponent implements OnInit {
  title: string = null;
  city: Ville;
ville: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private cityService: VilleService
  ) { }

  ngOnInit(): void {
    this.city = this.cityService.getVille();
    this.title = 'Détail d\'une ville ' + this.city?.libelle;
  }

  editCity(row) {
    this.modalService.dismissAll();
    this.cityService.setVille(row);
    this.cityService.edit = true;
    this.modal(CityAddComponent, 'modal-basic-title', 'md', true, 'static');
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
