import { TypeBien } from '@model/type-bien';
import { Component, OnInit } from '@angular/core';
import { TypeBienService } from '@service/type-bien/type-bien.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeBienAddComponent } from '../type-bien-add/type-bien-add.component';

@Component({
  selector: 'app-city-show',
  templateUrl: './type-bien-show.component.html',
  styleUrls: ['./type-bien-show.component.scss']
})
export class TypeBienShowComponent implements OnInit {
  title: string ;
  typeBien: TypeBien;
ville: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private typeBienService: TypeBienService
  ) { }

  ngOnInit(): void {
    this.typeBien = this.typeBienService.getTyepBien();
    this.title = 'Détail d\'un type de bien ' + this.typeBien?.libelle;
  }

  editCity(row) {
    this.modalService.dismissAll();
    this.typeBienService.setTyepBien(row);
    this.typeBienService.edit = true;
    this.modal(TypeBienAddComponent, 'modal-basic-title', 'md', true, 'static');
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
