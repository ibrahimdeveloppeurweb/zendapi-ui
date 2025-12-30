import { Equipment } from '@model/equipment';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipmentService } from '@service/equipment/equipment.service';
import { EquipmentAddComponent } from '../equipment-add/equipment-add.component';

@Component({
  selector: 'app-equipment-show',
  templateUrl: './equipment-show.component.html',
  styleUrls: ['./equipment-show.component.scss']
})
export class EquipmentShowComponent implements OnInit {
  title: string = null;
  equipment: Equipment;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private equipmentService: EquipmentService
  ) { }

  ngOnInit(): void {
    this.equipment = this.equipmentService.getEquipment();
    this.title = 'Détail de l\'équipement ' + this.equipment?.libelle;
  }

  editEquipment(row) {
    this.modalService.dismissAll();
    this.equipmentService.setEquipment(row);
    this.equipmentService.edit = true;
    this.modal(EquipmentAddComponent, 'modal-basic-title', 'md', true, 'static');
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
