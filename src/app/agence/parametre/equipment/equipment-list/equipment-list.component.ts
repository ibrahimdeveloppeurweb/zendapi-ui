import { Equipment } from '@model/equipment';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { EquipmentService } from '@service/equipment/equipment.service';
import { EquipmentAddComponent } from '@parametre/equipment/equipment-add/equipment-add.component';
import { EquipmentShowComponent } from '@parametre/equipment/equipment-show/equipment-show.component';
import {FilterService} from '@service/filter/filter.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss']
})
export class EquipmentListComponent implements OnInit {
  @Input() equipments: Equipment[] = [];
  @Input() action: boolean = true;
  dtOptions: any = {};
  etat: boolean = false;


  type: string = 'EQUIPEMENT';
  typeRow = [
    {label: 'Equipement', value: 'EQUIPEMENT'}
  ];
  categorieRow = [
    {label: 'Particulier', value: 'PARTICULIER'},
    {label: 'Entreprise', value: 'ENTREPRISE'}
  ];
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de locataire"
  etatTitle: string = "Périodicité"

  nameTitle: string = "Nom / Raison sociale"
  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';



  libelleTitle: string = "N° Contrat"
  libelle: boolean = false
  libelleType = 'TEXT';
  libelleClass= 'House';
  libelleNamespace= 'Client';
  libelleGroups= 'house';

  max: boolean = false;
  min: boolean = false;
  etatRow = [
    { label: "Aucun contrat", value: "AUCUN" },
    { label: "Journalier", value: "JOURNALIER" },
    { label: "Mensuel", value: "MENSUEL" },
    { label: "Trimestriel", value: "TRIMESTRIEL" },
    { label: "Semestriel", value: "SEMESTRIEL" },
    { label: "Annuel", value: "ANNUEL" },
  ]
  filter: any;


  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private equipmentService: EquipmentService,
    private filterService: FilterService,
  ) { }

  ngOnInit(): void {
    this.etat = this.equipments ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'EQUIPMENT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'EQUIPMENT_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  onFilter($event) {
    this.equipments = []
    this.filterService.search($event, 'equipement', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'EQUIPEMENT'){
          this.equipments = res;
        }
    }, err => { })
   }
  onChangeLoad($event) {  }

  appendToList(item): void {
    this.equipments.unshift(item);
  }
  update(item): void {
    const index = this.equipments.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.equipments[index] = item;
    }
  }
  addEquipment() {
    this.modalService.dismissAll();
    this.equipmentService.edit = false;
    this.modal(EquipmentAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  showEquipment(row) {
    this.modalService.dismissAll();
    this.equipmentService.setEquipment(row);
    this.modal(EquipmentShowComponent, 'modal-basic-title', 'md', true, 'static');
  }
  editEquipment(row) {
    this.modalService.dismissAll();
    this.equipmentService.edit = true;
    this.equipmentService.setEquipment(row);
    this.modal(EquipmentAddComponent, 'modal-basic-title', 'md', true, 'static');
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
        this.equipmentService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.equipments.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.equipments.splice(index, 1);
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
    }).result.then((result) => { }, (reason) => { });
  }
}
